const SmsLog = require('../models/SmsLogModel');
const User = require('../models/UserModel');
const Event = require('../models/EventModel');
const SignedUpEvent = require('../models/SignedUpEventModel');
const dayjs = require('dayjs');

const mongoose = require('mongoose');

//for use after the event, will log the sms response and then close the event
async function updateSmsLog(eventId, recipient,  response) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const id =  new mongoose.Types.ObjectId(`${eventId}`);
    const user = await User.getUser(recipient);
    const userId = new mongoose.Types.ObjectId(`${user._id}`);
    const log = await SmsLog.findOneAndUpdate(
      { event: id, 
        recipient: userId
      },
      {
        $set: { 
            response: response,
            status: 'complete'

        },
      },
      { new: true, upsert: true },
      { session }
    );
    await log;
    console.log('Updated call log ', log);

    await Event.updateOne({ id }, { $set: { status: 'closed' } }, { new: true, upsert: true }, { session });
    console.log('event is now closed');
    await session.commitTransaction();

  } catch (err) {
    await session.abortTransaction();
    console.log("Error updating smslog: ", err);
  }
}

//for use with webhook response
async function findDateFromSmsLog(recipient, receivedAt) {
  const dateSubstr = dayjs(receivedAt).format('YYYY-MM-DD');
  console.log('receivedAt: ', dateSubstr);
  const agg = [
    {
      $match: {
        recipient: recipient,
      },
    },
    {
      $lookup: {
        from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'eventInfo',
      },
    },
    {
      $project: {
        _id: 1,
        date: '$eventInfo.date',
        endsAt: '$eventInfo.endsAt',
      },
    },
  ];

  const cursor = await SmsLog.aggregate(agg);
  // only return the datetime for the event that contains the date of the received response.
  // The dates should be the same since the user is required to respond on the same date
  // user must also be a recipient for the event in the smslog.
  const event = await Object.values(cursor).filter(
    (key) => dayjs(key.date[0]).format('YYYY-MM-DD') === dayjs(receivedAt).format('YYYY-MM-DD')
  )[0];
  console.log('cursor: ', cursor);
  console.log('event: ', event);
  // const eventDetails = await cursor[0];
  return event;
}

//for testing
async function createSmsLog( eventDate, messageType, mongoId, smsId) {
    const mongoID = new mongoose.Types.ObjectId(`${mongoId}`);

    const event = await SignedUpEvent.getSignedUpEventByDate(eventDate, mongoID)
    const eventId = event._id;
    const log = await SmsLog.createLog(eventId, eventDate, messageType, mongoID, smsId);
    if(messageType === 'followup') {
        await log.set({ status: 'pending'});
    } else {
        await log.set({ status: 'complete'});
    }
    log.save();
    return await log;
}

module.exports = { updateSmsLog, findDateFromSmsLog, createSmsLog };
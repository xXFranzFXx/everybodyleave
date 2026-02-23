const SmsLog = require('../models/SmsLogModel');
const User = require('../models/UserModel');
const Event = require('../models/EventModel');
const SignedUpEvent = require('../models/SignedUpEventModel');
const SmsRecipient = require('../models/SmsRecipientModel');
const dayjs = require('dayjs');

const mongoose = require('mongoose');

async function updateSmsLog(eventId, recipient,  response, eventDate="",smsBatchId="") {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const fieldPath = `log.${recipient}`;
    const id =  new mongoose.Types.ObjectId(`${eventId}`);
    const log = await SmsLog.findOneAndUpdate(
      { event: eventId },
      {
        $addToSet: { log: recipient },
        $setOnInsert: {
          eventDate: eventDate,
          smsId: smsBatchId,
        },
      },
      { new: true, upsert: true },
      { session }
    );
    await log;
    console.log('Updated call log ', log);

    await Event.updateOne({ id }, { $set: { status: 'closed' } }, { new: true, upsert: true }, { session });
    console.log('event is now closed');
    await SmsRecipient.findOneAndUpdate({})
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
async function saveResponseToLog(eventId, eventDate, phone, response) {
 const recipient = await User.getUser(phone);
 const mongoId = new mongoose.Types.ObjectId(recipient._id);
 const log = await SmsLog.getUserSms(eventId, mongoId, { eventDate: new Date(nudgeTimeUtc)})
}
async function createSmslog(eventId="", eventDate="", messageType, phone, smsId) {
    const recipient = await User.getUser(phone);
    const mongoId = new mongoose.Types.ObjectId(recipient._id)
    const event = eventId ? eventId : await SignedUpEvent.getSignedUpEventByDate(eventDate, mongoId)
    const log = await SmsLog.createLog(event, eventDate, messageType, recipient, smsId);
    if(messageType === 'followup') {
        await log.set({ status: 'pending'});
    } else {
        await log.set({ status: 'complete'});
    }
    log.save();
    return await log;
}

module.exports = { updateSmsLog, findDateFromSmsLog, createSmslog };
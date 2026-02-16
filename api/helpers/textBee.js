const axios = require('axios');
const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;
const SmsLog = require('../models/SmsLogModel');
const User = require('../models/UserModel');
const Event = require('../models/EventModel');
const SignedUpEvent = require('../models/SignedUpEventModel');
const dayjs = require('dayjs');

const mongoose = require('mongoose');

function fifteenMinuteLimit(reminder, receivedAt) {
  const x = dayjs(reminder);
  const y = dayjs(receivedAt);
  const duration = x.diff(y, 'minutes');
  return duration <= 15;
}

function followUpMinuteLimit(endsAt, receivedAt) {
  const x = dayjs(endsAt);
  const y = dayjs(receivedAt);
  const duration = y.diff(x, 'minutes');
  return duration <= 25;
}

async function getEventTime(phone, id) {
  const user = await User.getUser(phone);
  const userId = new mongoose.Types.ObjectId(`${user._id}`);
  const event = await SignedUpEvent.getSignedUpEvent(id, userId);
  const eventDate = event.date;
  return eventDate;
}
async function textBeeSendSms(message, recipient) {
  const response = await axios.post(
    `${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`,
    {
      recipients: [recipient],
      message: message,
    },
    {
      headers: {
        'x-api-key': API_KEY,
      },
    }
  );
  const result = await response.data;
  console.log('TextBee Sms Sent: ', result.data);

  return result;
}
async function textBeeBulkSms(message, phoneList, eventId, eventDate) {
  const id = new mongoose.Types.ObjectId(`${eventId}`);

  try {
    const response = await axios.post(
      `${BASE_URL}/gateway/devices/${DEVICE_ID}/send-bulk-sms`,
      {
        messageTemplate: 'everybodyleave',
        messages: [
          {
            recipients: phoneList,
            message: message,
          },
        ],
      },
      {
        headers: {
          'x-api-key': API_KEY,
        },
      }
    );
    const result = await response.data;

    const log = await SmsLog.findOneAndUpdate(
      { event: id },
      { $addToSet: { recipients: phoneList }, $set: { eventDate: eventDate }, $set: { smsId: result.data.smsBatchId } },
      { new: true, upsert: true }
    );
    await log;
    console.log('Updated call log ', log);

    await Event.updateOne({ id }, { $set: { status: 'closed' } }, { new: true });
    console.log('event is now closed');

    console.log('textbee final reminder bulk sms sent: ', result);
    return result;
  } catch (error) {
    console.log('Failed to send bulk sms reminders:  ', error);
  }
}

async function textBeeFinalSms(message, recipient, eventId, eventDate) {
  const id = new mongoose.Types.ObjectId(`${eventId}`);
  try {
    const response = await axios.post(
      `${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`,
      {
        recipients: [recipient],
        message: message,
      },
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
      {
        headers: {
          'x-api-key': API_KEY,
        },
      }
    );
    const result = await response.data;
    console.log("sent final sms: ", result)
    const fieldPath = `log.${recipient}`;
    const log = await SmsLog.findOneAndUpdate(
      { event: id },
      {
        $addToSet: { recipients: recipient },
        $set: { [fieldPath]: 1  },
        $setOnInsert: { 
          eventDate: eventDate,
          smsId: result.data.smsBatchId,
        },
      },
      { new: true, upsert: true }
    );
    await log;
    console.log('Updated call log ', log);

    await Event.updateOne({ id }, { $set: { status: 'closed' } }, { new: true });
    console.log('event is now closed');

    console.log('textbee final reminder bulk sms sent: ', result);
    return result;
  } catch (error) {
    console.log('Failed to send bulk sms reminders:  ', error);
  }
}

async function textBeeReceiveSms() {
  const response = await axios.get(`https://api.textbee.dev/api/v1/gateway/devices/${DEVICE_ID}/get-received-sms`, {
    headers: {
      'x-api-key': API_KEY,
    },
  });
  const messages = await response.data;
  return messages;
}

async function updateSmsLogResponse(eventId, sender, response) {
  const fieldPath = `log.${sender}`;
  const id = new mongoose.Types.ObjectId(`${eventId}`);
  try {
    const log = await SmsLog.updateOne(
      { event: id },
      {
        $set: { [fieldPath]: response },
      },
      { new: true, upsert: true }
    );
    console.log('updated response in sms log: ', log);
    return log;
  } catch (err) {
    console.log('Failed to update response in sms log: '.err);
  }
}

async function findDateFromSmsLog(phone, receivedAt) {
  const dateSubstr = dayjs(receivedAt).format('YYYY-MM-DD');
  console.log('receivedAt: ', dateSubstr);
  const agg = [
    {
      $match: {
        recipients: phone,
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
    //only return event with date that contains the receivedAt date ** Not working
    // {
    // $match: {
    //   $expr: {
    //     $regexMatch: {
    //       input: '$eventInfo.date',
    //       regex: `${dateSubstr}`, // The substring to search for
    //       options: "i"    // Case-insensitive option
    //     }
    //   }
    // }
    // }
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

async function textBeeInitialSms(profileName, phone, dateScheduled, intention, logins) {
  const message =
    logins === 1
      ? `Congratulations ${profileName}! You have scheduled your first leave for ${dateScheduled}. Your intention for the leave is ${intention}  You will receive 4 nudge reminders on the day of your scheduled leave.  You response is required on the final reminder text. Thank you!`
      : intention
      ? `Hello ${profileName}! You have scheduled an EbL leave for ${dateScheduled}. You have set an intention for ${intention}.`
      : `Hello ${profileName}! You have scheduled an EbL leave for ${dateScheduled}`;
  const response = await axios.post(
    `${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`,
    {
      recipients: [phone],
      message: message,
    },
    {
      headers: {
        'x-api-key': API_KEY,
      },
    }
  );
  const result = await response.data;
  console.log('TextBee Initial Sms Sent: ', result);
  return result;
}

async function webhookResponse(sender, message, receivedAt) {
  // const { sender, message, receivedAt } = await payload;
  console.log('receivedAt: ', dayjs(receivedAt).format('YYYY-MM-DD'));
  const event = await findDateFromSmsLog(sender, receivedAt);
  try {
    if (event === undefined || (message !== '1' && message !== '2')) {
      const response = `You have sent a response for an event that does not exist. Please only respond to the followup message you will receive after your scheduled leave ends.`;
      await textBeeSendSms(response, sender);
      console.log('User responded to event that does not exist');
      return { status: 'User responded incorrectly.  Please check date and time to verify the leave.' };
    } else {
      const { _id, date, endsAt } = await event;
      const tooEarly = dayjs(endsAt).subtract(2, 'hour');
      const id = new mongoose.Types.ObjectId(`${_id}`);
      const smsLog = await SmsLog.findOne({ event: id });
      const followUpResponseLimit = followUpMinuteLimit(endsAt, receivedAt);
      if (dayjs(receivedAt).isAfter(endsAt, 'min') && !fifteenMinuteLimit(receivedAt, endsAt)) {
        // await smsLog.log.set(sender, '2');
        await updateSmsLogResponse(id, sender, message);
        const response = `You have replied past the cutoff time.  To receive full credit, you must respond within 15 min.`;
        await textBeeSendSms(response, sender);
        return { status: `User responded late to the followup sms` };
      }

      if (dayjs(receivedAt) < dayjs(tooEarly)) {
        console.log('message sent too early: ', dayjs(receivedAt < dayjs(tooEarly)));
        const response = `You have replied with ${message}.  Thank you for your timely response, however your response is too early.  You may respond to the final reminder which will be sent 15 min prior to your leave.`;
        await textBeeSendSms(response, sender);
        console.log('User responded too early.');
        return { status: 'User responded too early' };
      } else if (message === '1' && followUpMinuteLimit(endsAt, receivedAt)) {
        const response = `Great Job! Thank you for participating`;
        await textBeeSendSms(response, sender);
        console.log(`User responded with ${message}`);
        return { status: `User responded on time with ${message}.` };
      } else if (message === '2' && followUpMinuteLimit(endsAt, receivedAt)) {
        const response = `There's always next time!`;
        await updateSmsLogResponse(id, sender, message);
        // await smsLog.log.set(sender, '2');
        await textBeeSendSms(response, sender);
        console.log(`User responded with ${message}`);
        return {
          status: `User was not able to complete the leave successfully, but responded to the followup on time`,
        };
      } else if (
        (message !== '1' && message !== '2') &&
        (dayjs(receivedAt).isBefore(date, 'min') || dayjs(receivedAt).isAfter(endsAt, 'min'))
      ) {
        console.log('message: ', message);
        // console.log(message !== '1');
        const response = `You're response cannot be accepted, because it is either incorrect or at the wrong time.`;
        await textBeeSendSms(response, sender);
        console.log('User sent incorrect response.');
        return { status: 'User sent incorrect response' };
      }
     await  User.updateOne(
      { phone: sender },
      { 
        $pull: { reminder: id },      
        $push: { archived: id }     
      }
    )   
    }
  } catch (err) {
    console.log('Failed to process user response.  Smslog was not updated. ', err);
    return { status: err };
  }
}
module.exports = {
  textBeeBulkSms,
  textBeeSendSms,
  textBeeReceiveSms,
  webhookResponse,
  textBeeInitialSms,
  textBeeFinalSms,
};

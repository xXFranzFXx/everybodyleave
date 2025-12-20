const axios = require('axios');
const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;
const SmsLog = require('../models/SmsLogModel');
const User = require('../models/UserModel');
const event = require('../models/EventModel');
const SignedUpEvent = require('../models/SignedUpEventModel');
const dayjs = require('dayjs')
const mongoose = require('mongoose');

function fifteenMinuteLimit(reminder, receivedAt) {
  const x = dayjs(reminder);
  const y = dayjs(receivedAt);

  const duration = dayjs.duration(y.diff(x)).asMinutes();
  return duration <= 15;
}
// async function getEventDate (phone, id) {
//   const user = await User.getUser(phone);
//   const userId = new mongoose.Types.ObjectId(`${user._id}`)
//   const event = await SignedUpEvent.getSignedUpEvent(id, userId);
//   const eventDate = event.date
//   return eventDate;

// }
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

    await event.updateOne({ id }, { $set: { status: 'closed' } }, { new: true });
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
    const fieldPath = `log.${recipient}`
    const log = await SmsLog.findOneAndUpdate(
      { event: id },
      {
        $addToSet: { recipients: recipient } ,
        $set: { eventDate: eventDate },
        $set: { smsId: result.data.smsBatchId },
        $set: {[fieldPath]: '' } 
      },
      { new: true, upsert: true }
    );
    await log;
    console.log('Updated call log ', log);

    await event.updateOne({ id }, { $set: { status: 'closed' } }, { new: true });
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
  try {
    const log = await SmsLog.findOneAndUpdate(
      {event: eventId},
      {
        $set: { [fieldPath]: response }
      },
      { new: true, upsert: true }
      );
      console.log("updated response in sms log: ", log);
      return log;
  } catch (err) {
    console.log("Failed to update response in sms log: ". err)
  }
   
}

async function findDateFromSmsLog(phone) {
  const agg = [
    {
      $match: {
        'recipients': phone,
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
  console.log('cursor: ', cursor);
  const eventDetails = await cursor[0];
  return eventDetails;
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
  const eventDetails = await findDateFromSmsLog(sender);
  const { _id, date, endsAt } = await eventDetails;
  const tooEarly = dayjs(endsAt).subtract(2, 'hour');
  const id = new mongoose.Types.ObjectId(`${_id}`);
  const smsLog = SmsLog.findOne({ event: id });

  if (
    (dayjs(receivedAt).isAfter(date, 'min') && dayjs(receivedAt).isBefore(endsAt, 'min')) ||
    (dayjs(receivedAt).isAfter(endsAt, 'min') && !fifteenMinuteLimit(receivedAt, endsAt))
  ) {
    await smsLog.log.set(sender, '2');
    const response = `You must reply prior to the start of your leave.  Failure to reply and late replies negatively effect your progress chart.`;
    await textBeeSendSms(response, sender);
    console.log(`User responded late with ${message}`)
  }

  if (dayjs(receivedAt) < dayjs(tooEarly)) {
    const response = `You have replied with ${message}.  Thank you for your timely response, however your response is too early.  You may respond to the final reminder which will be sent 15 min prior to your leave.`;
    await textBeeSendSms(response, sender);
    console.log("User responded too early.")
  } else if (message === '1' && fifteenMinuteLimit(endsAt, receivedAt)) {
    const response = `Great Job! Thank you for participating`;
    await textBeeSendSms(response, sender);
    console.log(`User responded with ${message}`)
  } else if (message === '2' && fifteenMinuteLimit(endsAt, receivedAt)) {
    const response = `There's always next time!`;
    await textBeeSendSms(response, sender);
    console.log(`User responded with ${message}`)
 }  else if (( (message === '1' || message === '2') && dayjs(receivedAt).isBefore(date, 'min') )) {
    await smsLog.log.set(sender, message);
    const response = `You have replied with ${message}.  Thank you for your timely response.`;
    await textBeeSendSms(response, sender);
    console.log(`User responded on time with ${message}`);
 } else if ( (message !== '1' || message !== '2') && dayjs(receivedAt).isBefore(date, 'min') ) {
    console.log("message: ", message)
    console.log(message !== '1')
    const response = `incorrect response only a response of 1 or 2 is accpeted.`
    // await textBeeSendSms(response, sender);
    console.log("User sent incorrect response.")
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

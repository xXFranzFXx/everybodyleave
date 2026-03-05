const axios = require('axios');
const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;
const SmsLog = require('../models/SmsLogModel');
const User = require('../models/UserModel');
const Event = require('../models/EventModel');
const SignedUpEvent = require('../models/SignedUpEventModel');
const { updateSmsLog, findDateFromSmsLog, createSmsLog } = require('./smsLog');
const dayjs = require('dayjs');

const mongoose = require('mongoose');

function fifteenMinuteLimit(reminder, receivedAt) {
  const x = dayjs(reminder);
  const y = dayjs(receivedAt);
  const duration = x.diff(y, 'minutes');
  return duration <= 15;
}
//time limit to respond after followup sms is 25 min
function followUpMinuteLimit(endsAt, receivedAt) {
  const x = dayjs(endsAt);
  const y = dayjs(receivedAt);
  const duration = y.diff(x, 'minutes');
  return duration <= 25;
}
function pastFollowUpLimit(endsAt, receivedAt) {
  const x = dayjs(endsAt);
  const y = dayjs(receivedAt);
  const duration = y.diff(x, 'minutes');
  return duration > 25;
}

async function getEventTime(phone, id) {
  const user = await User.getUser(phone);
  const userId = new mongoose.Types.ObjectId(`${user._id}`);
  const event = await SignedUpEvent.getSignedUpEvent(id, userId);
  const eventDate = event.date;
  return eventDate;
}
async function textBeeSendSms(message, recipient, userId, eventId, messageType, nudgeTimeUtc) {
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
      }
    );
    const result = await response.data;
    const smsId = result.smsId;
    const user = await User.getUser(recipient);
    
      const data = { eventId, nudgeTimeUtc, messageType, userId };
      const log = await SmsLog.createLog(data);
      await log.save();
            console.log('TextBee Sms Sent: ', result.data);

    
    return await result;
  } catch (err) {
    console.log('Failed to send sms. ', err);
  }
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
async function textBeeFollowUpResponseSms(message, recipient, eventId) {
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
      }
    );
    const result = await response.data;
    const user = await User.getUser(recipient);
    const user_id = user._id;
    const smsLog = await SmsLog.getUserSms(eventId, user_id);
    smsLog.response = 'notRequired';
    smsLog.status = 'complete';
    smsLog.messageType = 'response';
    await smsLog.save();
    return await result;
  } catch (err) {
    console.log('Failed to send sms. ', err);
  }
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
async function textBeeFinalSms(message, recipient, eventId, userId, messageType, eventDate) {
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
    const smsId = result.data.smsId;
    const user = await User.getUser(recipient);
    const user_id = user._id;
    const data = { eventId, eventDate, user_id, messageType, smsId };
    const log = await SmsLog.createLog(data);
    await log.save();

    console.log('sent final sms: ', result);
    console.log('textbee final reminder bulk sms sent: ', result);
    return await result;
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

async function textBeeInitialSms(
  profileName,
  phone,
  mongoId,
  eventId,
  dateScheduled,
  datetime,
  nudgeTimeUtc,
  intention,
  logins
) {
  const userId = new mongoose.Types.ObjectId(`${mongoId}`);

  const message =
    logins === 1
      ? `Congratulations ${profileName}! You have scheduled your first leave for ${dateScheduled}. Your intention for the leave is ${intention}  You will receive 4 nudge reminders on the day of your scheduled leave.  You response is required on the final reminder text. Thank you!`
      : intention
        ? `Hello ${profileName}! You have scheduled an EbL leave for ${dateScheduled}. You have set an intention for ${intention}.`
        : `Hello ${profileName}! You have scheduled an EbL leave for ${dateScheduled}`;
  try {
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
    const smsId = result.data.smsBatchId;
    const messageType = 'confirmation';

    const data = { eventId, datetime, messageType, mongoId, smsId };
    const log = await SmsLog.createLog(data);
    await log.save();
    console.log('sms log created: ', log);
    console.log('TextBee Initial Sms Sent: ', result);
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function webhookResponse(sender, message, receivedAt) {
  const user = await User.getUser(sender);
  const userId = user._id;
  const smsLog = await SmsLog.findByReceivedDate(receivedAt, {
    recipient: new mongoose.Types.ObjectId(`${user._id}`),
    messageType: 'followup',
  });
  console.log('receivedAt: ', dayjs(receivedAt).format('YYYY-MM-DD'));
  console.log('smsLog: ', smsLog);
  if ((message !== '1' && message !== '2') || smsLog === null || smsLog.event === null) {
    const response = `You have sent a response for an event that does not exist, or an event that has not started yet. Please only respond to the followup message you will receive after your scheduled leave ends.`;
    await textBeeFollowUpResponseSms(response, sender);
    console.log('User responded to event that does not exist');
    return { status: 'User responded incorrectly.  Please check date and time to verify the leave.' };
  } else {
    const smsEvent = smsLog.event;
    const eventId = new mongoose.Types.ObjectId(`${smsEvent}`);
    const leaveDate = smsEvent.eventDate;
    const event = await Event.find({ eventId });
    const endsAt = event.endsAt;
    const receivedAfterEnd = dayjs(receivedAt).isAfter(endsAt, 'min');
    const tooEarly = dayjs(endsAt).subtract(2, 'hour');
    const followUpResponseLimit = followUpMinuteLimit(endsAt, receivedAt);
    const pastLimit = pastFollowUpLimit(endsAt, receivedAt);
    try {
      if (message === '2' && receivedAfterEnd && followUpResponseLimit && event !== undefined) {
        const response = `There's always next time!`;
        await updateSmsLog(eventId, sender, 'followup', message);
        await textBeeFollowUpResponseSms(response, sender);
        await User.archiveEvent(userId, eventId);
        console.log(`User responded with ${message}`);
        return {
          status: `User was not able to complete the leave successfully, but responded to the followup on time`,
        };
      } else if (message === '1' && receivedAfterEnd && followUpResponseLimit) {
        const response = `Great Job! Thank you for participating`;
        await updateSmsLog(eventId, sender, 'followup', message);
        await textBeeFollowUpResponseSms(response, sender);
        console.log(`User responded with ${message}`);
        await User.archiveEvent(userId, eventId);

        return { status: `User responded on time with ${message}.` };
      } else if ((message === '1' || message === '2') && pastLimit) {
        console.log('message: ', message);
        // console.log(message !== '1');
        const response = `Sorry, late responses are not accepted.`;
        await textBeeFollowUpResponseSms(response, sender);
        console.log('User sent late response.');
        return { status: 'User sent late response' };
      }
    } catch (err) {
      console.log('Failed to process user response.  Smslog was not updated. ', err);
      return { status: err };
    }
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

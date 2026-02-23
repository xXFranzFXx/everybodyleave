const axios = require('axios');
const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;
const SmsLog = require('../models/SmsLogModel');
const User = require('../models/UserModel');
const Event = require('../models/EventModel');
const SignedUpEvent = require('../models/SignedUpEventModel');
const { updateSmsLog, findDateFromSmsLog, createSmslog } = require('./smsLog');
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

async function getEventTime(phone, id) {
  const user = await User.getUser(phone);
  const userId = new mongoose.Types.ObjectId(`${user._id}`);
  const event = await SignedUpEvent.getSignedUpEvent(id, userId);
  const eventDate = event.date;
  return eventDate;
}
async function textBeeSendSms(message, recipient, eventId, messageType, nudgeTimeUtc ) {
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
  const smsId = result.smsId
  if (response.ok) {
  const eventID = new mongoose.Types.ObjectId(`${eventId}`)
  const data = { eventID, nudgeTimeUtc, messageType, recipient, smsId };
  console.log('TextBee Sms Sent: ', result.data);
  const log = await SmsLog.createLog(data);
  await log.save();
  }
  return await result;
  }catch (err) {
    console.log('Failed to send sms. ', err)
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
async function textBeeFollowUpResponseSms(message, recipient) {
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
  return await result;
  }catch (err) {
    console.log('Failed to send sms. ', err)
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
async function textBeeFinalSms(message, recipient, eventId, messageType, eventDate) {
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
    const smsId = result.smsId;
    const eventID = new mongoose.Types.ObjectId(`${eventId}`)
    if (response.ok) {
      const data = { eventID, eventDate, messageType, recipient, smsId };
      const log = SmsLog.createLog(data);
    }
    console.log("sent final sms: ", result)
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



async function textBeeInitialSms(eventId, profileName, phone, dateScheduled,  date, intention, logins) {
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
  const smsId = result.smsId;
  const messageType = 'confirmation';
  const eventID = new mongoose.Types.ObjectId(`${eventId}`);
  if (response.ok) {
  const data = { eventID, date, messageType, phone, smsId };
  const log = await SmsLog.createLog(data);
  console.log('TextBee Initial Sms Sent: ', result);
  await log.save();

  }
  return result;
 } catch (err) {
  console.log(err)
 }
}

async function webhookResponse(sender, message, receivedAt) {

  const user = await User.getUser(sender);
  const smsLog = await SmsLog.findByReceivedDate(receivedAt, { recipient: new mongoose.Types.ObjectId(`${user._id}`)})
  console.log('receivedAt: ', dayjs(receivedAt).format('YYYY-MM-DD'));
  
  const smsEvent = smsLog.event;
  const eventId = mongoose.Types.ObjectId(`${smsEvent}`)
  const leaveDate = smsEvent.eventDate;
  const event  = await Event.find({ eventId });
  const endsAt = event.endsAt;
  
  const tooEarly = dayjs(endsAt).subtract(2, 'hour');   
  const followUpResponseLimit = followUpMinuteLimit(endsAt, receivedAt);
  try {
    if ( (message !== '1' && message !== '2') || event === undefined ) {
      const response = `You have sent a response for an event that does not exist. Please only respond to the followup message you will receive after your scheduled leave ends.`;
      message, recipient, eventId, messageType, nudgeTimeUtc 
      await textBeeFollowUpResponseSms(response, sender);
      console.log('User responded to event that does not exist');
      return { status: 'User responded incorrectly.  Please check date and time to verify the leave.' };
    } else {
   
     
      if (dayjs(receivedAt).isAfter(endsAt, 'min') && !followUpResponseLimit) {
        // await smsLog.log.set(sender, '2');
        smsLog.response = '2';
        await smsLog.save();
        const response = `You have replied past the cutoff time.  To receive full credit, you must respond within 15 min.`;
        await textBeeFollowUpResponseSms(response, sender);
        return { status: `User responded late to the followup sms` };
      }

      if (dayjs(receivedAt) < dayjs(tooEarly)) {
        console.log('message sent too early: ', dayjs(receivedAt < dayjs(tooEarly)));
        const response = `You have replied with ${message}.  Thank you for your timely response, however your response is too early.  You may respond to the final reminder which will be sent 15 min prior to your leave.`;
        await textBeeFollowUpResponseSms(response, sender);
        console.log('User responded too early.');
        return { status: 'User responded too early' };
      } else if (message === '2' && followUpResponseLimit) {
        const response = `There's always next time!`;
        smsLog.response = '2';
        await smsLog.save();
        await textBeeFollowUpResponseSms(response, sender);
        console.log(`User responded with ${message}`);
        return {
          status: `User was not able to complete the leave successfully, but responded to the followup on time`,
        };
      } else if (message === '1' && followUpResponseLimit) {
        const response = `Great Job! Thank you for participating`;
        smsLog.response = '1';
        await smsLog.save();
        await textBeeFollowUpResponseSms(response, sender);
        console.log(`User responded with ${message}`);
        return { status: `User responded on time with ${message}.` };
      }  else if (
        (message !== '1' && message !== '2') &&
        (dayjs(receivedAt).isBefore(date, 'min') || dayjs(receivedAt).isAfter(endsAt, 'min'))
      ) {
        console.log('message: ', message);
        // console.log(message !== '1');
        const response = `You're response cannot be accepted, because it is either incorrect or at the wrong time.`;
        await textBeeFollowUpResponseSms(response, sender);
        console.log('User sent incorrect response.');
        return { status: 'User sent incorrect response' };
      }
     await  User.updateOne(
      { phone: sender },
      { 
        $pull: { reminder: eventId },      
        $push: { archived: eventId }     
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

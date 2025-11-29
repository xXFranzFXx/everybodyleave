const axios = require('axios');
const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;
const SmsLog = require('../models/SmsLogModel');
const User = require('../models/UserModel')
const event = require('../models/EventModel');
const SignedUpEvent = require('../models/SignedUpEventModel')
const mongoose = require('mongoose'); 

function fifteenMinuteLimit (reminder, receivedAt) {
    const x = dayjs(reminder)
    const y = dayjs(receivedAt)

    const duration = dayjs.duration(y.diff(x)).asMinutes();
    return duration <= 15 
  }
// async function getEventDate (phone, id) {
//   const user = await User.getUser(phone);
//   const userId = new mongoose.Types.ObjectId(`${user._id}`)
//   const event = await SignedUpEvent.getSignedUpEvent(id, userId);
//   const eventDate = event.date
//   return eventDate;

// }
async function textBeeSendSms(message, recipient) {
   const response = await axios.post(`${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`, {
      recipient: recipient,
          message: message,
          }, {
          headers: {
              'x-api-key': API_KEY
          }
      });
      const result = await response.data;
      return result;
}
async function textBeeBulkSms(message, phoneList, eventId, eventDate) {
  const id = new mongoose.Types.ObjectId(`${eventId}`)
 
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
        {  $addToSet: { recipients: phoneList },
           $set: { eventDate: eventDate },
           $set: { smsId: result.data.smsBatchId }
         },
        { new: true, upsert: true },
      )
        await log;
      console.log("Updated call log ", log);

      await event.updateOne({ id }, { $set: { status: 'closed'}}, {new: true} );
      console.log("event is now closed");
    
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
async function updateSmsLog(phone) {
  const log = await SmsLog.findOneAndUpdate({})
}
async function findDateFromSmsLog(phone) {
  const agg = [
  {
    $match: {
      'log.phone': phone
    }
  }, {
    $lookup: {
      from: 'events', 
      localField: 'event', 
      foreignField: '_id', 
      as: 'eventInfo'
    }
  }, {
    $project: {
      _id: 1,
      date: "$eventInfo.date",
      endsAt: "$eventInfo.endsAt"
    }
  }
];
 const cursor = await SmsLog.aggregate(agg);
 console.log('cursor: ', cursor);
 const eventDetails = await cursor[0]
 return eventDetails

}

async function textBeeInitialSms (profileName, phone, dateScheduled, intention, logins) {
 const message = logins === 1 ? 
        `Congratulations ${profileName}! You have scheduled your first leave for ${dateScheduled}. Your intention for the leave is ${intention}  You will receive 4 nudge reminders on the day of your scheduled leave.  You response is required on the final reminder text. Thank you!`:
        `Hello ${profileName}! You have scheduled an EbL leave for ${dateScheduled}. You have set an intention for ${intention}.`
    const response = await axios.post(`${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`, {
    recipients: [phone],
        message: message,
        }, {
        headers: {
            'x-api-key': API_KEY
        }
    });

    const result = await response.data;
    return result;

}
async function webhookResponse(payload) {
   const { sender, message, receivedAt } = payload;
   const { eventDetails } = await findDateFromSmsLog(sender);
   const {  _id, date, endsAt } = await eventDetails;
   const id = new mongoose.Types.ObjectId(`${_id}`)
   const smsLog =  SmsLog.findOne({ event: id });
   if ((message === "1" || message === "2") && dayjs(receivedAt).isBefore(date, 'min')) {
      await smsLog.log.set(sender, message);
      const response = `You have replied with ${message}.  Thank you for your timely response.`
      await textBeeSendSms(sender, response);
   } else if (message === "1"  && fifteenMinuteLimit(endsAt, receivedAt)){
      const response = `Great Job! Thank you for participating`
      await textBeeSendSms(sender, response);
   } else if (message === "2"  && fifteenMinuteLimit(endsAt, receivedAt)){
      const response = `There's always next time!`
       await textBeeSendSms(sender, response);
   } else if ((dayjs(receivedAt).isAfter(date, 'min') && dayjs(receivedAt).isBefore(endsAt, 'min')) 
    || (dayjs(receivedAt).isAfter(endsAt, 'min') && !fifteenMinuteLimit(receivedAt, endsAt))){
    await smsLog.log.set(sender, "2");
    const response = `You must reply prior to the start of your leave.  Failure to reply and late replies negatively effect your progress chart.`
    await textBeeSendSms(sender, response);
   }
}
module.exports = { textBeeBulkSms, textBeeSendSms, textBeeReceiveSms, webhookResponse, textBeeInitialSms };

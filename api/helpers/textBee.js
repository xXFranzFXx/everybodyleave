const axios = require('axios');
const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;
const SmsLog = require('../models/SmsLogModel');
const event = require('../models/EventModel');
const mongoose = require('mongoose'); 

function fifteenMinuteLimit (reminder, receivedAt) {
    const x = dayjs(reminder)
    const y = dayjs(receivedAt)

    const duration = dayjs.duration(y.diff(x)).asMinutes();
    return duration <= 15 
  }
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
async function textBeeBulkSms(message, phoneList, eventId) {
  const id = new mongoose.Types.ObjectId(`${eventId}`)
  const logData = [];
  phoneList.forEach(phone => {
    // let data = { phone: phone, response: 2 };
    logData = [ ...logData, { phone: phone, response: 2 } ];
  })
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
    if (response.ok) {
      const log = await SmsLog.findOneAndUpdate(
        { event: id },
        { $addToSet: { log: logData } },
        { new: true, upsert: true },
      )
      console.log("Updated call log ", log);

      await event.updateOne({ id }, {status: 'closed'});
      console.log("event is now closed");
    }
    console.log('textbee: ', result);
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

async function findDateFromSmsLog(phone) {
  const agg = [
  {
    $match: {
      'log.phone': phone
    }
  }, {
    $lookup: {
      'from': 'events', 
      'localField': 'event', 
      'foreignField': '_id', 
      'as': 'eventInfo'
    }
  }, {
    $project: {
      _id: 1,
      "date": "$eventInfo.date"
    }
  }
];
 const cursor = await SmsLog.aggregate(agg);
 console.log('cursor: ', cursor);
 const eventDetails = await cursor[0]
 return eventDetails

}
async function webhookResponse(payload) {
   const { sender, message, receivedAt } = payload;
   const { eventDetails } = await findDateFromSmsLog(sender);
   const eventDate = await eventDetails.date;
   const id = new mongoose.Types.ObjectId(`${eventDetails._id}`)
   const smsLog =  SmsLog.findOne({ event: id });
   if (dayjs(receivedAt).isBefore(eventDate, hour)) {
      await smsLog.log.set(sender, message);
      const response = `You have replied with ${message}.  Thank you for your timely response.`
      await textBeeSendSms(sender, response);
   } else {
    await smsLog.log.set(sender, "2");
    const response = `You must reply prior to the start of your leave.  Failure to reply and late replies count as a no show.`
    await textBeeSendSms(sender, response);
   }
}
module.exports = { textBeeBulkSms, textBeeReceiveSms, webhookResponse };

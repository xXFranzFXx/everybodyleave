
const httpSmsPhone = process.env.HTTPSMS_PHONE;
const BASE_URL = 'https://api.httpsms.com/v1/messages/send';
const axios = require('axios');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
const headers = {
        'x-api-key': process.env.HTTPSMS_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
//sends scheduled sms 
async function sendScheduledSms(recipient, text, date) { 
  try {
      const response = await axios.post(`${BASE_URL}`, {
        headers: { headers },
        body: JSON.stringify({
          "content": text,
          "encrypted": false,
          "from": `${httpSmsPhone}`,
          "to": recipient,
          "send_at": date
        })
    });
     const data = await response.data;
     return data;
  } catch (err) {
    console.log("failed to send scheduled sms reminder. ", err);
  }
}

async function sendSms(recipient, text) { 
  try {
      const response = await axios.post(`${BASE_URL}`, {
        headers: { headers },
        body: JSON.stringify({
          "content": text,
          "encrypted": false,
          "from": `${httpSmsPhone}`,
          "to": recipient
        })
    });
     const data = await response.data;
     return data;
  } catch (err) {
    console.log("failed to send sms reminder. ", err);
  }


}


//dateScheduled is formatted date
async function sendFirstSms(name, phone, intention, dateScheduled) {
  const message = `Hello ${name}! You have just scheduled your first leave on ${dateScheduled} for an hour focused on ${intention}.`
  try {
    const { message } = await sendSms(phone, text);
    return message
  } catch (err) {
    console.log('Failed to send sms', err);
  }
} 
 //sends bulk sms by csv
 // const data = [
    //   { FromPhoneNumber: phone, ToPhoneNumber: recipient, Content: message, SendTime(optional): date},
    // ];
async function sendBulkSmsCSV  (name, phone, intention, datetime, timezone) {
    const csvData = await createCsvObj(name, phone, intention, datetime, timezone);
    const { formData } = convertToCsv(csvData);
    try {
      const res = await axios.post(`${BASE_URL}`, { // Replace with your server endpoint
        headers: { headers },
        body: formData,
      });
      const response = await res.data;
      if (res.ok) {
         console.log('CSV uploaded successfully!');
        return response; 
      } else {
        console.error('Failed to upload CSV:', res.statusText);
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
    }
  };

  function convertToCsv (data) {
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));
    for (const row of data) {
      const values = headers.map(header => row[header]);
      csvRows.push(values.join(','));
    }
     const csvString = csvRows.join('\n');
     const blob = new Blob([csvString], { type: 'text/csv' });

    // Create a FormData object
    const formData = new FormData();
    formData.append('file', blob, 'bulksms.csv'); // 'file' is the field name on the server, 'data.csv' is the filename
    return formData;
  };

  function range (start, end, step) {
    const length = Math.ceil((end - start) / step); // Calculate length, ensuring inclusivity for the end value
    return Array.from({ length }, (_, i) => start + (i * step));
};

//if timezone is honolulu, and the reminder is at 7am, send nudge night before at 9pm
//otherwise set nudge times starting at 9am and for every other hour until 2 hours prior to reminder time
  function getNudgeReminders(datetime, timezone) {   
    let nudgeTimes = [];
    let nudgeReminders = [];
    const reminderHour = dayjs(datetime).get('hour');
    const firstNudge = reminderHour - 4;
    if(timezone === 'America/Honolulu' && reminderHour === 17) {
        nudgeReminders.push(dayjs(datetime).subtract(10, 'hour'));
        return nudgeReminders;
    } else {
        nudgeTimes = range(firstNudge, reminderHour, 2)
        nudgeReminders = nudgeTimes.map(time => dayjs(datetime).hour(time));
        return nudgeReminders;
    }
  };

  function nudgeReminderContent(name, intention, datetime, timezone) {
    const { nudgeReminders } = getNudgeReminders(datetime, timezone);
         if(timezone === 'America/Honolulu' && nudgeReminders.length === 1) {        
          return `Good Evening ${name}! You have scheduled a reminder for tomorrow.  Your intention is to focus on ${intention}.`
         } else {
         `Hello ${name}! This is just a quick reminder that you have scheduled an event to focus on ${intention}.`
         }
  }

  async function createCsvObj(name, phone, intention, datetime, timezone) {
    const data = [];
    const { nudgeReminders } = getNudgeReminders(datetime, timezone);
    data = await nudgeReminders.map(nudgeDate => {
        let sendAt = dayjs.utc(nudgeDate).tz(timezone);
        const dataRow = {
            FromPhoneNumber: httpSmsPhone, 
            ToPhoneNumber: phone, 
            Content: nudgeReminderContent(name, intention, datetime, timezone), 
            SendTime: sendAt
        }
        return dataRow;
    });
    return data;
  }
/**
 * 
 to send nudgreminders for a single reminder date, send bulk scheduled message via CSV
 ex: 
 const data = createCsvObj(name, phone, intention, datetime, timezone)
 sendBulkSmsCSV(data)
 */

module.exports = { sendScheduledSms, sendBulkSmsCSV, createCsvObj, sendSms, sendFirstSms }
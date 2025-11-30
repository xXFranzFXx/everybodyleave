
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
const options = {
  'headers' : {
        'x-api-key': process.env.HTTPSMS_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
}
axios.defaults.headers.common['X-API-Key'] = process.env.HTTPSMS_API_KEY;
//sends scheduled sms 
async function sendScheduledSms(recipient, text, date) { 
   const body = {
          "content": text,
          "encrypted": false,
          "from": `${httpSmsPhone}`,
          "to": recipient
      }
  try {
      const response = await axios.post(`${BASE_URL}`, body)
  
     const data = await response.data;
     console.log(data);
     return data;
  } catch (err) {
    console.log("failed to send scheduled sms reminder. ", err);
  }
}

async function sendSms(recipient, text) { 
  try {
      const body = {
          "content": text,
          "encrypted": false,
          "from": `${httpSmsPhone}`,
          "to": recipient
      }
      const response = await axios.post(`${BASE_URL}`, body)
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

  async function convertToCsv (data) {
    const headers = Object.keys(data[0]);
    let csvRows = [];
    csvRows.push(headers.join(','));
    for (const row of data) {
      const values = headers.map(header => row[header]);
      csvRows.push(values.join(','));
    }
     const csvString = csvRows.join('\n');
     console.log("csvString: ", csvString)
     const blob = new Blob([csvString], { type: 'text/csv' });

    // Create a FormData object
    let formData = new FormData();
    formData.append('file', blob, 'bulksms.csv'); // 'file' is the field name on the server, 'data.csv' is the filename
    return formData;
  };

  function range (start, end, step) {
    const length = Math.ceil((end - start) / step); // Calculate length, ensuring inclusivity for the end value
    return Array.from({ length }, (_, i) => start + (i * step));
};

//if timezone is honolulu, and the reminder is at 7am, send nudge night before at 9pm
//otherwise set nudge times starting at 9am and for every other hour until 2 hours prior to reminder time
  async function getNudgeReminders(datetime, timezone) {   
    let nudgeTimes = [];
    let nudgeReminders = [];
    const reminderHour = dayjs(datetime).get('hour');
    const firstNudge = dayjs(datetime).subtract(4, 'hour');
    const firstNudgeHour = dayjs(firstNudge).get('hour');
    console.log("reminderHour: ", reminderHour)
    console.log("firstNudgeHour: ", firstNudgeHour)
    if(timezone === 'America/Honolulu' && reminderHour === 17 || reminderHour === 18) {
        nudgeReminders.push(dayjs(datetime).subtract(10, 'hour'));
    } else {
        nudgeTimes = range(firstNudgeHour, reminderHour, 2)
        nudgeReminders = nudgeTimes.map(time => dayjs(datetime).hour(time).toDate());
        
    }
    console.log("nudgeReminders: ", nudgeReminders)
      return nudgeReminders;
  };

  async function nudgeReminderContent(name, intention, datetime, timezone) {
    const  nudgeReminders  = await getNudgeReminders(datetime, timezone);
         if(timezone == 'America/Honolulu' && nudgeReminders.length == 1) {        
          return `Good Evening ${name}! You have scheduled a reminder for tomorrow.  Your intention is to focus on ${intention}.`
         } else {
         return `Hello ${name}! This is just a quick reminder that you have scheduled an event to focus on ${intention}.`
         }
  }

  async function createCsvObj(name, phone, intention, datetime, timezone) {
    let data = [];
    let dataRow = {}
    const nudgeReminders = await getNudgeReminders(datetime, timezone);
    // nudgeReminders.forEach((nudgeDate, index) => {
      for(let i=0; i < nudgeReminders?.length; i++) {

        let sendAt = dayjs.utc(nudgeReminders[i]).tz(timezone).toDate();
        dataRow = {
            FromPhoneNumber: httpSmsPhone, 
            ToPhoneNumber: phone, 
            Content: await nudgeReminderContent(name, intention, datetime, timezone), 
            SendTime: sendAt
        }
        data.push(dataRow);
        dataRow = {}
    // });
  }
  console.log("dataRows: ", data)
    return data;
  }
  async function sendBulkSmsCSV  (name, phone, intention, datetime, timezone) {
    const csvData = await createCsvObj(name, phone, intention, datetime, timezone);
    const formData  = await convertToCsv(csvData);
    // try {
      await axios({
          method: "post",
          url: 'https://api.httpsms.com/v1/messages/bulk-send',
          data: formData,
          headers: { 
            'x-api-key': process.env.HTTPSMS_API_KEY,
            'Content-Type': 'multipart/form-data' 
          },
      })
        .then(function (response) {
          //handle success
          // console.log(response);
          if (response.ok) {
            console.log('CSV uploaded successfully!');
            return response.data; 
          }
        })
        .catch(function (error) {
          //handle error
          console.error('Failed to upload CSV:', error)
      });
    //   const res = await axios.post(`${BASE_URL}`, formData);
    //   const response = await res.data;
    //   if (res.ok) {
    //      console.log('CSV uploaded successfully!');
    //     return response; 
    //   } else {
    //     console.error('Failed to upload CSV:', res.statusText);
    //   }
    // } catch (error) {
    //   console.error('Error uploading CSV:', error);
    // }
  };

/**
 * 
 to send nudgreminders for a single reminder date, send bulk scheduled message via CSV
 ex: 
 const data = createCsvObj(name, phone, intention, datetime, timezone)
 sendBulkSmsCSV(data)
 */

module.exports = { sendScheduledSms, sendBulkSmsCSV, createCsvObj, sendSms, sendFirstSms }

const httpSmsPhone = process.env.HTTPSMS_PHONE;
const BASE_URL = 'https://api.httpsms.com/v1/messages/send';
const FormData = require('form-data')
const axios = require('axios');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const { createCsvObj, convertToCsv } = require('./nudgeReminders');
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

  async function sendBulkSmsCSV  (name, phone, intention, datetime, timezone) {
    const csvData = await createCsvObj(name, phone, intention, datetime, timezone);
    const formData  = await convertToCsv(csvData);

function getHeaders(form) {
    return new Promise((resolve, reject) => {
        form.getLength((err, length) => {
            if(err) { reject(err); }
            let headers = Object.assign({'x-api-key': process.env.HTTPSMS_API_KEY}, form.getHeaders());
            resolve(headers);
         });
    });
}

getHeaders(formData)
.then((headers) => {
    return axios.post('https://api.httpsms.com/v1/bulk-messages', formData, {headers:headers})
})
.then((response)=>{
    console.log(response.data)
})
.catch(e=>{console.log(e)})
    // try {
      // await axios.post('https://api.httpsms.com/v1/bulk-messages', formData, {
      //     headers: { 
      //       'x-api-key': process.env.HTTPSMS_API_KEY,
      //       'Content-Type': 'multipart/form-data' 
      //     },
      // })
      //   .then(function (response) {
      //     //handle success
      //     // console.log(response);
      //     if (response.ok) {
      //       console.log('CSV uploaded successfully!');
      //       return response.data; 
      //     }
      //   })
      //   .catch(function (error) {
      //     //handle error
      //     console.error('Failed to upload CSV:', error)
      // });
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

module.exports = { sendScheduledSms, sendBulkSmsCSV, sendSms, sendFirstSms }
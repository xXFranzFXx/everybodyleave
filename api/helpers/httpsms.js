const httpSmsPhone = process.env.HTTPSMS_PHONE;
const BASE_URL = 'https://api.httpsms.com/v1/messages/send';
// const FormData = require('form-data');
const axios = require('axios');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { createCsvObj, convertToCsv, convertToXlsx, createCsvfile, convertCsvToXlsx } = require('./nudgeReminders');
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
const options = {
  headers: {
    'x-api-key': process.env.HTTPSMS_API_KEY,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};
axios.defaults.headers.common['X-API-Key'] = process.env.HTTPSMS_API_KEY;
//sends scheduled sms
async function sendScheduledSms(recipient,  name, intention, datetime, timezone) {
  const nudgeReminders = await getNudgeReminders(datetime, timezone);
  for (let i = 0; i < nudgeReminders?.length; i++) {
    try {
      sendAt = dayjs.utc(nudgeReminders[i]).tz(timezone).format('YYYY-MM-DDTHH:MM:ss');
      content = await nudgeReminderContent(name, intention, datetime, timezone);
      const body = {
        FromPhoneNumber: `${httpSmsPhone}`,
        ToPhoneNumber: recipient,
        Content: content,
        SendTime: sendAt,
      };

      const response = await axios.post(`${BASE_URL}`, body);

      const data = await response.data;
      console.log(data);
      return data;
    } catch (err) {
      console.log('failed to send scheduled sms reminder. ', err);
    }
  }
}

async function sendSms(recipient, text) {
  try {
    const body = {
      content: text,
      encrypted: false,
      from: `${httpSmsPhone}`,
      to: recipient,
    };
    const response = await axios.post(`${BASE_URL}`, body);
    const data = await response.data;
    return data;
  } catch (err) {
    console.log('failed to send sms reminder. ', err);
  }
}

//dateScheduled is formatted date
async function sendFirstSms(name, phone, intention, dateScheduled) {
  const message = `Hello ${name}! You have just scheduled your first leave on ${dateScheduled} for an hour focused on ${intention}.`;
  try {
    const { message } = await sendSms(phone, text);
    return message;
  } catch (err) {
    console.log('Failed to send sms', err);
  }
}
//sends bulk sms by csv
// const data = [
//   { FromPhoneNumber: phone, ToPhoneNumber: recipient, Content: message, SendTime(optional): date},
// ];

function getHeaders(form) {
  return new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (err) {
        reject(err);
      }
      let headers = Object.assign({ 'x-api-key': process.env.HTTPSMS_API_KEY }, form.getHeaders());
      resolve(headers);
    });
  });
}

async function sendBulkSmsCSV(name, phone, intention, datetime, timezone) {
  const csvData = await createCsvObj(name, phone, intention, datetime, timezone);
  const csvString = await convertToCsv(csvData);
  const formData = await createCsvfile(csvString);
  getHeaders(formData)
    .then((headers) => {
      return axios.post('https://api.httpsms.com/v1/bulk-messages', formData, { headers: headers });
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((e) => {
      console.log(e);
    });
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
}
async function sendBulkSmsXlsx(name, phone, intention, datetime, timezone) {
  const jsonData = await createCsvObj(name, phone, intention, datetime, timezone);
  const csvString = await convertToCsv(jsonData);
  const formData = await convertCsvToXlsx(csvString);
  // const  headers = {
  //   'x-api-key': process.env.HTTPSMS_API_KEY,
  //   'Accept': 'application/json',
  //   'Content-Type': 'multipart/form-data',
  // }
  //  try {
  //       const response = await fetch('https://api.httpsms.com/v1/bulk-messages', {
  //           method: 'POST',
  //           headers:{
  //               'x-api-key': process.env.HTTPSMS_API_KEY,
  //               'Accept': 'application/json',
  //               'Content-Type': 'multipart/form-data',
  //           },
  //           body: formData // The browser sets the correct headers and encoding automatically
  //       });

  //       if (!response.ok) {
  //           throw new Error('Network response was not ok: ' + response.statusText);
  //       }

  //       const result = await response.json(); // Assuming the server responds with JSON
  //       // statusMessage.textContent = 'Upload successful!';
  //       console.log('Success:', result);

  //   } catch (error) {
  //       // statusMessage.textContent = 'Upload failed: ' + error.message;
  //       console.error('Error:', error);
  //   }
  getHeaders(formData)
    .then((headers) => {
      return axios.post('https://api.httpsms.com/v1/bulk-messages', formData, { headers: headers });
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((e) => {
      console.log(e);
    });
  //  try {
  // await axios.post('https://api.httpsms.com/v1/bulk-messages', formData, {
  //     headers: {
  //       'x-api-key': process.env.HTTPSMS_API_KEY,
  //       'Content-Type': 'multipart/form-data'
  //     },
  // })
  //   .then(function (response) {
  //     //handle success
  //     console.log(response);
  //     if (response.ok) {
  //       console.log('Xlsx uploaded successfully!');
  //       return response.data;
  //     }
  //   })
  //   .catch(function (error) {
  //     //handle error
  //     console.error('Failed to upload Xlsx:', error)
  // });
}

/**
 * 
 to send nudgreminders for a single reminder date, send bulk scheduled message via CSV
 ex: 
 const data = createCsvObj(name, phone, intention, datetime, timezone) 
 sendBulkSmsCSV(data)
 */

module.exports = { sendScheduledSms, sendBulkSmsCSV, sendSms, sendFirstSms, sendBulkSmsXlsx };

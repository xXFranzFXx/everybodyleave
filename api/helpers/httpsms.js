const HttpSms = require('httpsms');
const client = new HttpSms(process.env.HTTPSMS_API_KEY)
const BASE_URL = 'https://api.httpsms.com/v1'
const axios = require('axios');


//sends scheduled sms 
async function sendScheduledSms(recipient, text, date) { 
    await client.messages.postSend({
        content: text,
        from: '+19132387124',
        to: recipient,
        send_at: date
    })
    .then((message) => {
        console.log(message.id);
        return message;
    })
    .catch((err) => {
        console.error(err);
    });
}

 //sends bulk sms by csv
 // const data = [
    //   { FromPhoneNumber: phone, ToPhoneNumber: recipient, Content: message, SendTime(optional): date},
    // ];
async function sendBulkSmsCSV  (data) {
   
    const { formData } = convertToCsv(data);
    try {
      const response = await axios.post(`${BASE_URL}/bulk-messages`, { // Replace with your server endpoint
        headers: {
        'x-api-key': process.env.HTTPSMS_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: formData,
      });

      if (response.ok) {
         console.log('CSV uploaded successfully!');
        return response.data;    
      } else {
        console.error('Failed to upload CSV:', response.statusText);
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
module.exports = { sendScheduledSms, sendBulkSmsCSV }
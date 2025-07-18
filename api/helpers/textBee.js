const axios = require('axios');
const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;

async function textBeeSms(message, phone) {
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
async function textBeeBulkSms(message, phoneList) {
    const response = await axios.post(`${BASE_URL}/gateway/devices/${DEVICE_ID}/send-bulk-sms`, {
        messageTemplate: "everybodyleave",
        messages: [
            {
                recipients: phoneList,
                message: message,
            }
        ]
        }, {
        headers: {
            'x-api-key': API_KEY
        }
    });
    const result = await response.data;
    console.log("textbee: ", result)
    return result;
}

async function textBeeReceiveSms() {
    const response = await axios.get(`https://api.textbee.dev/api/v1/gateway/devices/${DEVICE_ID}/get-received-sms`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      const messages = await response.data;
      return messages;
}

module.exports = { textBeeSms, textBeeBulkSms, textBeeReceiveSms };
const axios = require('axios');
const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;

async function textBeeSms(smsMsg, phone) {
    const response = await axios.post(`${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`, {
    recipients: [phone],
        message: smsMsg
        }, {
        headers: {
            'x-api-key': API_KEY
        }
    })
    const result = await response.data;
    return result;
}

module.exports = { textBeeSms };
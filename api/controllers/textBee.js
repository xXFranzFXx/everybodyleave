const axios = require('axios');
const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;

exports.textBeeSms = async (req, res) => {
    const { phone, dateScheduled } = req.body; 
    const message = `You have scheduled an EBL reminder on ${dateScheduled}.`
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

exports.textBeeSmsCancel = async (req, res) => {
    const { phone, dateScheduled } = req.body; 
    const message = `You have cancelled your EBL reminder on ${dateScheduled}.`
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
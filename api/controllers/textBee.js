const axios = require('axios');
const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;

exports.textBeeSms = async (req, res) => {
    const { profileName, phone, dateScheduled } = req.body; 
    const message = `You have scheduled an EbL reminder for ${dateScheduled}.`
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

exports.textBeeBulkSms = async (req, res) => {
    const { phone, dateScheduled } = req.body; 
    const message = `This is your scheduled reminder from EbL. Please reply with 1 if you are still attending the event. Respond with 2 if you aren't before the event begins.  Late responses will not be accepted.  A late response or failure to respond will count against your progress level.`
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
    const {profileName, phone, dateScheduled } = req.body; 
    const message = `You have cancelled your EbL reminder for ${dateScheduled}.`
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
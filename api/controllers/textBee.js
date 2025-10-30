const axios = require('axios');
const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;

//sends confirmation sms
exports.textBeeSms = async (req, res) => {
    const { profileName, logins, phone, dateScheduled, intention } = req.body; 
    const message = logins === 1 ? 
        `Congratulations ${profileName}! You have scheduled your first leave for ${dateScheduled}. Your intention for the leave is ${intention}  You will receive 4 nudge reminders on the day of your scheduled leave.  You response is required on the final reminder text. Thank you!`:
        `This is your EbL reminder about your leave scheduled for ${dateScheduled}. You have set an intention for ${intention}.`
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
    const message = `You have cancelled your EbL leave scheduled for ${dateScheduled}.`
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
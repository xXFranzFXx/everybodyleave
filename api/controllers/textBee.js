const axios = require('axios');
const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;
const SmsLog = require('../models/SmsLogModel');
const { textBeeInitialSms } = require('../helpers/textBee')

//sends confirmation sms
exports.textBeeSms = async (req, res) => {
    const { profileName, phone, dateScheduled, intention, logins } = req.body; 
    await textBeeInitialSms(profileName, phone, dateScheduled, intention, logins);
}

exports.textBeeBulkSms = async (req, res) => {
    const { phone, dateScheduled } = req.body; 
    const message = `This is your scheduled reminder from EbL. Your leave will begin in 15 minutes.`
    let smsLogObj = {
        phone: "",
        response: "",
    }
    phone.forEach((user, index) => { smsLogObj[index].phone = user });
    const response = await axios.post(`${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`, {
    recipients: [phone],
        message: message,
        }, {
        headers: {
            'x-api-key': API_KEY
        }
    });
    const result = await response.data;
        await SmsLog.findOneAndUpdate(
            { date: dateScheduled },
            { 
                $addToSet: { log:  { $each: smsLogObj }}
            },
            { new: true, upsert: true })
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
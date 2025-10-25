const mongoose = require('mongoose');
const smsResponseModel = require('./SmsResponseModel')
const httpSmsPhone = process.env.HTTPSMS_PHONE;

/**
 * For httpSMS
 */
const HttpSmsSchema = mongoose.Schema({
    FromPhoneNumber: {
        type: String,
        default: `${httpSmsPhone}`
    },
    ToPhoneNumber: {
        type: String,
        required: true
    },
    Content: {
        type: String,
        required: true
    },
    SendTime: {
        type: Date,
        required: true
    },
    SmsType: { 
        type: String,
        default: 'nudge' //or 'reminder'
    },
    httpsSmsId: {
        type: String
    }

});

module.exports = mongoose.model('httpSms', HttpSmsSchema);
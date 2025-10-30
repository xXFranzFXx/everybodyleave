const mongoose = require('mongoose');
const httpSmsPhone = process.env.HTTPSMS_PHONE;
const baseOptions = {
	discriminatorKey: "smstype",
  	collection: "sms",
};
/**
 * For httpSMS
 */
const SmsSchema = mongoose.Schema({
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

}, baseOptions);

module.exports = mongoose.model('Sms', SmsSchema);
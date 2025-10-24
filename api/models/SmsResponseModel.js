const mongoose = require('mongoose');
const smsModel = require('./SmsModel');

/**
 * For httpSMS
 */
const SmsResponseSchema = mongoose.Schema({
        response: { type: Number }
    },{ timestamps: true }
    );

smsModel.discriminator('SmsResponse', SmsResponseSchema);
module.exports = mongoose.model('SmsResponse');
const mongoose = require('mongoose');
const userModel = require('./UserModel');

const SmsRecipientSchema = mongoose.Schema({
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        phone: String,
        smsId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'SmsLog'
        },
        eventDate: Date,
   
            status: { 
                type: String, 
                enum: ['pending', 'complete',  'canceled'], 
                default: 'pending' 
            },
            response: {
                type: String,
                enum: ['pending', '0', '1', '2'],
                default: ['pending']
                }
      
        }

    );

SmsRecipientSchema.index({ parentId: 1, eventDate: 1, smsId: 1, phone: 1 });
SmsRecipientSchema.static('getRecipient', function(mongoId, date, receivedAt, filters={}) {
    return this.findOne({
       ...filters,
        parentId: mongoId,
        "history.eventDate": { 
            $gte: date, 
            $lt: receivedAt 
        }
    })
})
userModel.discriminator('SmsRecipient', SmsRecipientSchema);
module.exports = mongoose.model('SmsRecipient');
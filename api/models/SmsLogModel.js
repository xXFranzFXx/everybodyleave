const mongoose = require('mongoose');
/**
 * For textBee
 */
const SmsLogSchema = mongoose.Schema({
   event: {
     type: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
   },
   status: {
    type: String,
    default: 'open'
   },
   log: [{
    phone: String,
    response: {
        type: Number,
        default: 2
    }
   }]},{ timestamps: true }
   );

module.exports = mongoose.model('smsLog', SmsLogSchema);
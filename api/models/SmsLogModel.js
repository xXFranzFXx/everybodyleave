const mongoose = require('mongoose');
/**
 * For textBee
 */
const SmsLogSchema = mongoose.Schema({
   event: {
     type: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
   },
   user: [{
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
   }]},{ timestamps: true }
   );

module.exports = mongoose.model('smsLog', SmsLogSchema);
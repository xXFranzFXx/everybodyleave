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
   log: {
    type: Map,
    of: String
   }},{ timestamps: true }
   );

module.exports = mongoose.model('SmsLog', SmsLogSchema);
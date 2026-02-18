const mongoose = require('mongoose');
/**
 * For textBee
 */
const SmsLogSchema = mongoose.Schema({
  event: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event'
  }],
  eventDate: {
    type: Date,
    default: Date.now
  },
  smsId: {
    type: String,
    index: true 
  },
  recipients: [String], 
  log: {
    type: Map,
    of: String
  }
}, { timestamps: true });

  SmsLogSchema.static('getSmsLog', function(id, phone, filters={}){
    return this.findOne({
      ...filters,
      $and: [
        { event: id },
        { recipients: { $in: [ phone ] } }
      ]
    })
  })
module.exports = mongoose.model('SmsLog', SmsLogSchema);
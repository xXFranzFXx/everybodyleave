const mongoose = require('mongoose');

/**
 * For textBee
 */
const SmsLogSchema = mongoose.Schema({
  event: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event',
  }],
  eventDate: {
    type: Date,
    default: Date.now
  },
  smsId: {
    type: String
  },
  recipients: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SmsRecipient'
  }], 
  log: [{
    type: String
  }]
  // log: {
  //   type: Map,
  //   of: String
  // }
}, { timestamps: true });

  SmsLogSchema.static('getSmsLog', function(id, phone, filters={}){
    return this.findOne({
      ...filters,
      $and: [
        { event: id },
        { log: { $in: [ phone ] } }
      ]
    })
  })
// Quick lookups for API callbacks
SmsLogSchema.index({ smsId: 1 }, { unique: true, sparse: true });

// Efficiently find logs for a specific event, sorted by date
SmsLogSchema.index({ event: 1, eventDate: -1 });

// Efficiently find logs for a specific recipient
SmsLogSchema.index({ recipients: 1 });

module.exports = mongoose.model('SmsLog', SmsLogSchema);
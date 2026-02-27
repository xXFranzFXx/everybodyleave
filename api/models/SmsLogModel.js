const mongoose = require('mongoose');
const dayjs = require('dayjs');
/**
 * For textBee
 */
const SmsLogSchema = mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    eventDate: {
      type: Date,
    },
    messageType: {
      type: String,
      enum: ['confirmation', 'cancellation', 'nudge', 'final', 'followup', 'response'],
      default: 'nudge',
    },
    recipient: {
       type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'complete'],
      default: 'pending'
    },
    response : {
      type: String,
      enum: ['awaiting', 'notRequired', 'noResponse', '1', '2'],
      default: 'notRequired'
    },
    smsId: {
      type: String,
    },
  },
  { timestamps: true }
);

// Quick lookups for API callbacks
SmsLogSchema.index({ smsId: 1 }, { unique: true, sparse: true });

// Efficiently find logs for a specific event, sorted by date
SmsLogSchema.index({ event: 1, eventDate: -1 });

// Efficiently find logs for a specific recipient
SmsLogSchema.index({ recipient: 1 });

// Partial TTL Index: 
// Expire after 90 days ONLY if hasResponse is false
SmsLogSchema.index(
  { createdAt: 1 }, 
  { 
    expireAfterSeconds: 60 * 60 * 24 * 30, // 30 days
    partialFilterExpression: { messageType: { $in: ['confirmation', 'cancellation', 'nudge', 'final'] }  } 
  }
);

SmsLogSchema.pre('save', function () {
  if (this.messageType === 'confirmation' || this.messageType === 'cancellation' || this.messageType === 'nudge') {
    this.status = 'complete';
    this.response = 'notRequired';
  } else if (this.messageType === 'followup') {
    this.response = 'awaiting';
  } else if (this.response === 'noResponse' || this.response === '1' || this.response === '2') {
    this.status = 'complete';
  } else {
    this.status = 'pending',
    this.response = 'awaiting'
  }
  ;
})

SmsLogSchema.pre('findOneAndUpdate', function() {
  const update = this.getUpdate();
  if (update.messageType) {
  // If messageType is being updated, set the priority accordingly
  if ((update.messageType === 'confirmation' || update.messageType === 'cancellation' || update.messageType === 'nudge') && update.status === 'complete') {
    update.response = 'notRequired';
  } else if (update.response === 'noResponse' || update.response === '1' || update.response === '2') {
    update.status = 'complete';
  }
  }
  
});

SmsLogSchema.static('getUserSms', function (id, userId, filters = {}) {
   const user_id = new mongoose.Types.ObjectId(`${userId}`);
   const event_id = new mongoose.Types.ObjectId(`${id}`);
  return this.findOne({
    ...filters,
    $and: [{ event: event_id }, { recipient: user_id }],
  }).sort({ updatedAt: 1 });
});

SmsLogSchema.static('createLog', async function (data) {
  const { eventId, eventDate, messageType, mongoId, smsId="" } = data
  
  const log =  new this({
    event: new mongoose.Types.ObjectId(`${eventId}`),
    eventDate: eventDate,
    messageType: messageType,
    recipient: new mongoose.Types.ObjectId(`${mongoId}`),
    smsId: smsId
  })
  return await log;
});

SmsLogSchema.static('findByReceivedDate', async function(receivedAt, filters={}) {
  const dateSubstr = dayjs(receivedAt).format('YYYY-MM-DD');
  return await this.findOne({
    ...filters,
    $expr: {
    $eq: [
      { $dateToString: { format: "%Y-%m-%d", date: "$eventDate" } },
      dateSubstr
    ]
    }
  })
})

module.exports = mongoose.model('SmsLog', SmsLogSchema);

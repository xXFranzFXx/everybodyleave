const eventModel = require('./EventModel');
const mongoose = require('mongoose');

const SignedUpEventSchema = mongoose.Schema({
  usersAttending: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  count: {
    type: Number,
    default: 0,
  },
  archived: {
    type: Boolean,
    default: false,
  },
});

SignedUpEventSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 15, // 30 days
    partialFilterExpression: { usersAttending: { $eq: [] } },
  }
);

SignedUpEventSchema.static('getSignedUpEventByDate', function (datetime, mongoId, filters = {}) {
  return this.findOne({
    ...filters,
    $and: [{ date: datetime }, { usersAttending: { $in: [mongoId] } }],
  });
});

SignedUpEventSchema.static('closeEvent', function (eventId, filters = {}) {
  const event_id = new mongoose.Types.ObjectId(`${eventId}`);
  return this.findOneAndUpdate(
    {
      ...filters,
      _id: event_id,
    },
    {
      $set: { status: 'closed' },
    },
    { new: true, upsert: true }
  );
});
eventModel.discriminator('SignedUpEvent', SignedUpEventSchema);
module.exports = mongoose.model('SignedUpEvent');

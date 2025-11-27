const eventModel = require('./EventModel');
const mongoose =  require('mongoose');
const smsResponseModel = require('./SmsResponseModel');


const SignedUpEventSchema = mongoose.Schema({
    usersAttending:[{
         type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    }],
    count: {
        type: Number,
        default: 0
    },
    archived: {
        type: Boolean,
        default: false
    }
})
SignedUpEventSchema.static('getSignedUpEvent', function(eventId, mongoId, filters = {}) {
  return this.findOne({
    ...filters,
    $and: [
      { _id: eventId }, 
      { usersAttending: { $in: [ mongoId ] }}
      ],
  });
});
eventModel.discriminator('SignedUpEvent', SignedUpEventSchema);
module.exports = mongoose.model('SignedUpEvent');
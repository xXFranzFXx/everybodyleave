const eventModel = require('./EventModel');
const mongoose =  require('mongoose');

const SignedUpEventSchema = mongoose.Schema({
    timezone: String,
    endsAt: {
        type: Date,
        required: true,
    },
    usersAttending:[{
         type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    }]
})
eventModel.discriminator('SignedUpEvent', SignedUpEventSchema);
module.exports = mongoose.model('SignedUpEvent');
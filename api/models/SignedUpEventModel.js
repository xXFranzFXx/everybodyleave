const Event = require('./EventModel');
const mongoose =  require('mongoose');

const SignedUpEventSchema = mongoose.Schema({
    _id: String,
    date: {
        type: Date,
        required: true
    },
    users:[{
         type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    }]
})
module.exports = Event.discriminator('SignedUpEvent', SignedUpEventSchema);
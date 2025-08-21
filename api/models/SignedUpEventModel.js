const eventModel = require('./EventModel');
const mongoose =  require('mongoose');

const SignedUpEventSchema = mongoose.Schema({
   
    
    usersAttending:[{
         type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    }],
    count: {
        type: Number,
        default: 0
    }
})
eventModel.discriminator('SignedUpEvent', SignedUpEventSchema);
module.exports = mongoose.model('SignedUpEvent');
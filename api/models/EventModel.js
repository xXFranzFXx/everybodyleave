const mongoose = require('mongoose');


const EventSchema = mongoose.Schema({
    _id: String,
    date: {
        type: Date,
        required: true,
        unique: true
    },
    timezones: {
       type: Map,
       of: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    },
    users: [{
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}]

});

module.exports = mongoose.model('Event', EventSchema);
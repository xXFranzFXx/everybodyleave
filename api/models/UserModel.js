const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: true
    },
    phone: { 
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    reminder: [{
       type: mongoose.Schema.Types.ObjectId, 
       ref: 'Event'
    }],
    archived: [{
       type: mongoose.Schema.Types.ObjectId, 
       ref: 'Event'
    }],
    calendarEvents: [{
       type: mongoose.Schema.Types.ObjectId, 
       ref: 'CalendarReminder'
    }],
    role: {
        type: String,
        default: 'basic'
    },
    //for use with httpSMS
    events: [{
        event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event'},
        reminderDate: {type: Date},
        nudges:[{ type: Date }],
        intention: {type: String},
        response: {type: Number}
    }],
    credit: {
        type: Number,
        default: 3,
    }
});
UserSchema.static('getUser', function(phoneNumber, filters={}) {
    return this.findOne({
        ...filters,
        phone: phoneNumber 
    })
})
module.exports = mongoose.model('User', UserSchema);
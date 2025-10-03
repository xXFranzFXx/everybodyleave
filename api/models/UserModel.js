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
       type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}]
    }],
    archived: [{
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}]
    }],
    calendarEvents: [{
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'CalendarReminder'}]
    }],
    role: {
        type: String,
        default: 'basic'
    },
    credit: {
        type: Number,
        default: 3,
    }
});

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');
const baseOptions = {
	discriminatorKey: "type",
  	collection: "users",
};
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
    credit: {
        type: Number,
        default: 3,
    }
}, baseOptions);

UserSchema.static('getUser', function(phoneNumber, filters={}) {
    return this.findOne({
        ...filters,
        phone: phoneNumber 
    })
})
module.exports = mongoose.model('User', UserSchema);
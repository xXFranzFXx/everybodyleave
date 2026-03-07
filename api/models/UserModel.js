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
    completed: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {
        count: {
            type: Number,
            default: 0
        },
        events: [{
            type: mongoose.Schema.Types.ObjectId
        }]
    }
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

UserSchema.static('archiveEvent', function(userId, eventId){
    const id = new mongoose.Types.ObjectId(userId)
    const eventID = new mongoose.Types.ObjectId(eventId)
    return this.findByIdAndUpdate(
        { id },
         { 
        $pull: { reminder: eventID },      
        $push: { archived: eventID }     
      }
    )
})
module.exports = mongoose.model('User', UserSchema);
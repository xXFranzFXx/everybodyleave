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
    reminder: {
       type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}]
    },
    optOut: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}]
    },
    role: {
        type: String,
        default: 'basic'
    },
});

module.exports = mongoose.model('User', UserSchema);
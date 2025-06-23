const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        trim: true,
        required: false,
        unique: true,
        lowercase: true
    },
    phone: { 
        type: String,
        trim: true,
        required: false,
    },
    reminder: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'basic'
    },
});

module.exports = mongoose.model('User', UserSchema);
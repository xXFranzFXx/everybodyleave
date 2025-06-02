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
        required: true
    },
    role: {
        type: String,
        default: 'subscriber'
    },
});

module.exports = mongoose.model('User', UserSchema);
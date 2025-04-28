const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id: String,
    email: { 
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: { 
        type: String,
        trim: true,
        required: true,
    },
    reminder: String,
    role: {
        type: String,
        default: 'subscriber'
    },
});

module.exports = mongoose.model('User', UserSchema);
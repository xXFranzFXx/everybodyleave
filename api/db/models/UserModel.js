const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id: String,
    email: String,
    phone: String,
    reminder: String
});

module.exports = mongoose.model('User', UserSchema);
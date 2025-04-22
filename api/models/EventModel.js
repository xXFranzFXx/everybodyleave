const mongoose = require('mongoose');
const User = require('./UserModel');

const EventSchema = mongoose.Schema({
    _id: String,
    date: Date,
    time: String,
    user: [User]
})

module.exports = mongoose.model('Events',EventSchema)
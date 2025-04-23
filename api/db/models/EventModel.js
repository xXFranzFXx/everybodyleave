const mongoose = require('mongoose');
const Users = require('./UserModel');

const EventSchema = mongoose.Schema({
    _id: String,
    date: Date,
    time: String,
    users: [{type: Schema.Types.ObjectId, ref: 'Users'}]
});

module.exports = mongoose.model('Events',EventSchema);
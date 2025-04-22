const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    _id: String,
    email: String,
    phone: String
})

module.exports = mongoose.model('User', UserSchema)
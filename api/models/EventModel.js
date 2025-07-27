const mongoose = require('mongoose');
const baseOptions = {
	discriminatorKey: "type",
  	collection: "events",
};

const EventSchema = mongoose.Schema({
    _id: String,
    date: {
        type: Date,
        required: true,
        unique: true
    }, 
    status: {
        type: String,
        default: 'open'
    }

}, baseOptions);

module.exports = mongoose.model('Event', EventSchema);
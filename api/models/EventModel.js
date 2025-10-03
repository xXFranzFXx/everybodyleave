const mongoose = require('mongoose');
const baseOptions = {
	discriminatorKey: "type",
  	collection: "events",
};

const EventSchema = mongoose.Schema({
    date: {
        type: Date
    }, 
     endsAt: {
        type: Date
    },
    status: {
        type: String,
        default: 'open'
    }

}, baseOptions);

// EventSchema.path('date').index({ 
//   unique: true, 
//   partialFilterExpression: {
//     '__type': 'Event'
//   }
// });
module.exports = mongoose.model('Event', EventSchema);
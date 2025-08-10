const mongoose = require('mongoose');
const eventModel = require('./EventModel');

const CalendarReminderSchema = new mongoose.Schema({
   intention : {
      type: String
   },
   user: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
   },
   type: {
      type: String,
      enum: ['past', 'upcoming']
   }
   
});

eventModel.discriminator('CalendarReminder', CalendarReminderSchema);
module.exports = mongoose.model('CalendarReminder');
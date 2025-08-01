const mongoose = require('mongoose');
const eventModel = require('./EventModel');

const CalendarReminderSchema = new mongoose.Schema({
   intention : {
      type: String
   },
   user: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
   }
   
});

eventModel.discriminator('CalendarReminder', CalendarReminderSchema);
module.exports = mongoose.model('CalendarReminder');
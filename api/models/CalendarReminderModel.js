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
   },
   day: {
      type: String, 
   },
   month: {
      type: String
   },
   year: {
      type: String
   }, 
   completed: {
      type: Boolean,
      default: false
   },
   color: {
      type: String,
      default: 'black'
   }
   
});

module.exports = mongoose.model('CalendarReminder', CalendarReminderSchema);
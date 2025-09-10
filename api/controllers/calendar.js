const Event = require('../models/EventModel');
const User = require('../models/UserModel');
const CalendarReminder = require('../models/CalendarReminderModel');
const mongoose = require('mongoose');
const dayjs =  require('dayjs');

exports.saveCalendarReminder = async (req, res) => {
 
  const { 
    datetime,
    phone,
    mongoId,    
    intention,
    time,
    day,
    month,
    year,
    status,
    completed,
    receiveText,
    color } = req.body;
  const session = await mongoose.startSession();
//   const start = new Date(dateTime);
//   const endTime = start.setHours(start.getHours() + 1, 0, 0, 0);
  try {
    session.startTransaction();
    // const tz = `timezones.` + timezone;
    const id = new mongoose.Types.ObjectId(`${mongoId}`);
  
      const event = await CalendarReminder.findOneAndUpdate(
        { date: datetime },
        {
          $set: { 
            user: mongoId,
            intention: intention,
            day: day,
            month: month,
            year: year,
            time: time,
            receiveText: receiveText,
            status: status,
            completed: completed,
            color: color
           },
        },
        { new: true, upsert: true },
        { session }
      );
      const calendarReminderId =  new mongoose.Types.ObjectId(`${event._id}`);
      console.log("calendarReminderId: ", calendarReminderId)
      await User.updateOne({ phone: phone }, { $addToSet: { "calendarEvents": calendarReminderId } }, { new: true, upsert: true }, { session });
      
      await session.commitTransaction();
      req.io.emit('created calendar reminder', { calendar: event });
      console.log('Transaction successful: ', event );
      return res.status(200).json({ event });
  } catch (error) {
    if (error)
    await session.abortTransaction();
    res.status(401).json({ error: 'Error saving calendar reminder' });
    throw error;
  } finally {
    session.endSession();
  }
};

exports.getCalendarReminders = async (req, res) => {
    const { phone } = req.body;
      try {
        const agg = [
          {
    $match: {
      phone: phone
    }
  }, {
    $lookup: {
      from: 'calendarreminders', 
      localField: 'calendarEvents', 
      foreignField: '_id', 
      as: 'calendarreminders'
    }
  }, {
    $project: {
      'calendarreminders': 1, 
      '_id': 0
    }
  }
        ];
    
        const cursor = await User.aggregate(agg);
        console.log('successfully fetched calendar reminders: ', cursor);
        const result = await cursor[0].calendarreminders;
        req.io.emit('fetched calendar reminders', cursor);
        return res.status(200).json({ result });
      } catch (error) {
        console.log('Error getting calendar reminders: ', error);
        res.status(401).json({ error: error.message });
        throw error;
      }
}
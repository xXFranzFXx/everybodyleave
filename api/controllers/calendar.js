const Event = require('../models/EventModel');
const User = require('../models/UserModel');
const CalendarReminder = require('../models/CalendarReminderModel');
const mongoose = require('mongoose');
const dayjs =  require('dayjs');

exports.saveCalendarReminder = async (req, res) => {
 
  const { 
    phone,
    mongoId,  
    datetime,  
    intention,
    time,
    day,
    month,
    year,
    status,
    completed,
    color } = req.body;
  const session = await mongoose.startSession();
  const start = new Date(datetime);
  const endTime = start.setHours(start.getHours() + 1, 0, 0, 0);
  try {
    session.startTransaction();
    const tz = `timezones.` + timezone;
    const id = new mongoose.Types.ObjectId(`${mongoId}`);
  
      const event = await CalendarReminder.findOneAndUpdate(
        { datetime },
        {
          $set: { 
            user: mongoId,
            intention: intention,
            day: day,
            month: month,
            year: year,
            time: time,
            status: status,
            completed: completed,
            color: color
           },
        },
        { new: true, upsert: true },
        { session }
      );
      await User.updateOne(
        { phone: phone }, 
        { $addToSet: { calendar: event },
        }, { new: true }, { session });

      await session.commitTransaction();
      req.io.emit('created calendar reminder', { calendar: event });
      console.log('Transaction successful: ', event);
      return res.status(200).json({ event });
  } catch (error) {
    await session.abortTransaction();
    res.status(401).json({ error: 'Error saving calendar reminder' });
    throw error;
  } finally {
    session.endSession();
  }
};
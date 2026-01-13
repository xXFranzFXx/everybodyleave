const { inngest } = require('../inngest/reminders');
const SignedUpEvent = require('../models/SignedUpEventModel');
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const { getNudgeReminders, nudgeReminderContent, nudgeReminderTimestamps } = require('../helpers/nudgeReminders');
//use these methods to trigger inngest functions
exports.cancelLeave = async (req, res) => {
  const { mongoId, phone, datetime } = req.body;
  const userId = new mongoose.Types.ObjectId(`${mongoId}`);
  const signedUpEvent = await SignedUpEvent.getSignedUpEventByDate(dayjs(datetime).toDate(), userId);
  const eventId = new mongoose.Types.ObjectId(`${signedUpEvent._id}`);
  try {
    await inngest.send({
      name: 'reminders/delete.leave',
      data: {
        userId: userId,
        eventId: eventId,
      },
    });
    res.json({ message: 'Leave cancelled' });
  } catch (err) {
    res.json({ message: 'error sending cancel event: ', err });
  }
};

exports.createLeave = async (req, res) => {
  const { mongoId, phone, dateScheduled, timezone, profileName, intention, logins, nudgeTimeUtc } = req.body;
  const userId = new mongoose.Types.ObjectId(`${mongoId}`);
  const signedUpEvent = await SignedUpEvent.getSignedUpEventByDate(nudgeTimeUtc, userId);
  console.log('signedUpEvent: ', signedUpEvent);
  const eventId = new mongoose.Types.ObjectId(`${signedUpEvent._id}`);
  console.log('original datetime: ', dateScheduled);
 
  const nudgeReminderTs = await getNudgeReminders(nudgeTimeUtc, timezone);
  const nudgeMessage = await nudgeReminderContent(profileName, intention, dateScheduled, timezone);
  console.log("nudge message is: ", nudgeMessage);
  try {
    await inngest.send({
      name: 'reminders/create.leave',
      data: {
        userId,
        phone,
        dateScheduled,
        timezone,
        profileName,
        logins,
        intention,
        eventId,
        nudgeTimeUtc,
        nudgeReminderTs,
        nudgeMessage,
      },
    });
    res.json({ message: 'Leave created' });
  } catch (err) {
    res.json({ message: 'error sending create leave event: ', err });
  }
};

exports.nudgeTexts = async (req, res) => {
  const { name, phone, intention, dateScheduled, timezone, nudgeTimeUtc } = req.body;
  const nudgeReminderTs = await getNudgeReminders(nudgeTimeUtc, timezone);
  const nudgeMessage = await nudgeReminderContent(name, intention, dateScheduled, timezone);
    try {
      await inngest.send({
        name: 'notifications/reminder.scheduled',
        data: {
          name,
          phone,
          intention,
          dateScheduled,
          nudgeReminderTs,
          nudgeMessage
        },
        // ts: timestamp, //this will schedule the function
      });
      res.json({ message: 'nudge texts created' });
    } catch (err) {
      res.json({ message: 'error creating nudge texts: ', err });
  }
};

//TODO: add routes

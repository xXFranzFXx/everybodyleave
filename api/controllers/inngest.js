const { inngest } = require('../inngest/reminders');
const SignedUpEvent = require('../models/SignedUpEventModel');
const mongoose = require('mongoose')
const dayjs = require('dayjs')
//use these methods to trigger inngest functions
exports.cancelLeave = async (req, res) => {
    const { mongoId, phone, datetime } = req.body;
    const userId = new mongoose.Types.ObjectId(`${mongoId}`);
    const signedUpEvent = await SignedUpEvent.getSignedUpEventByDate(datetime, userId);
    const eventId = new mongoose.Types.ObjectId(`${signedUpEvent._id}`);
    try {
    await inngest.send({
    name: "reminders/delete.leave",
    data: {
      userId: userId,
      eventId: eventId
    },
  })
    res.json({ message: 'Leave cancelled' });
    } catch (err){ 
       res.json({ message: "error sending cancel event: ", err}) ;
    }
};

exports.createLeave = async (req, res) => {
    const { mongoId, phone, datetime, timezone, profileName, intention, logins } = req.body;
    const userId = new mongoose.Types.ObjectId(`${mongoId}`);
    const signedUpEvent = await SignedUpEvent.getSignedUpEventByDate(datetime, userId);
    const eventId = new mongoose.Types.ObjectId(`${signedUpEvent._id}`);   
    const message = `This is your scheduled reminder from EbL. Please reply with 1 if you are still attending the event. Respond with 2 if you aren't. Please respond before the event begins.  Late responses will not be accepted.  A late response or failure to respond will count against your progress level.`
   try {
    await inngest.send({
        name: "reminders/create.leave",
        data: {
            mongoId,
            phone,
            datetime,
            timezone,
            profileName,
            logins, 
            intention,
            eventId,
            message
        },
    })
     res.json({ message: 'Leave created' });
   } catch(err) {
       res.json({ message: "error sending create leave event: ", err}) ;
   } 
};


exports.nudgeTexts = async (req, res) => {
    const { name, phone, intention, dateScheduled, sendAt } = req.body;
   try {
    await inngest.send({
    name: "notifications/reminder.scheduled",
    data: {
        name,
        phone,
        intention,
        dateScheduled
    },
    ts: dayjs(sendAt).unix() //this will schedule the function
    });
      res.json({ message: 'nudge texts created' });
   } catch (err){
    res.json({ message: "error creating nudge texts: ", err })
   }
}


//TODO: add routes
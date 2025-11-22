const { inngest } = require('../inngest/reminders');
const dayjs = require('dayjs')
//use these methods to trigger inngest functions
exports.cancelLeave = async (req, res, next) => {
    const { mongoId, phone, datetime } = req.body;

    await inngest.send({
    name: "reminders/delete.leave",
    data: {
      mongoId,
      datetime,
      phone,
    },
  }).catch(err => next(err));
  res.json({ message: 'Leave cancelled' });
};

exports.createLeave = async (req, res, next) => {
    const { mongoId, phone, datetime, timezone } = req.body;
    await inngest.send({
        name: "reminders/create.leave",
        data: {
            mongoId,
            phone,
            datetime,
            timezone
        },
    }).catch(err => next(err));
  res.json({ message: 'Leave created' });
};


exports.nudgeTexts = async (req, res, next) => {
    const { name, phone, intention, dateScheduled, sendAt } = req.body;
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
}
const { inngest } = require('../inngest/reminders');

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
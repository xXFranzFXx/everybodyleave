const { inngest } = require('../inngest/reminders');

exports.cancelLeave = async (req, res, next) => {
    await inngest.send({
    name: "reminders/delete.leave",
    data: {
      mongoId: req.body.mongoId,
      eventId: req.body.eventId
    },
  }).catch(err => next(err));
  res.json({ message: 'Leave cancelled' });
}
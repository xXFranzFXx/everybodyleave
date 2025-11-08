const Sms = require('../models/SmsModel');
const mongoose = require('mongoose');
const { expressjwt: jwt } = require("express-jwt");
const { sendScheduledSms } = require('../helpers/httpsms')

const dayjs =  require('dayjs');


exports.httpSmsWebhook = async (req, res) => {
  // Verify auth token
  if (process.env.WEBHOOK_SECRET) {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const claims = jwt.verify(token, process.env.WEBHOOK_SECRET);
  
    } catch (error) {
      console.error("Invalid Authorization token", error);
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  const event = req.body;
  console.info(
    `httpsms.com webhook event received with type [${request.header("X-Event-Type")}]`,
  );
  console.info(`decoded [${event.type}] with id [${event.id}`);
  console.debug(JSON.stringify(event.data, null, 2));

  res.status(200).json({ status: "success" });
};


exports.scheduleInitailSms = async (req, res) => {
    const { timezone, phone, datetime, intention, name } = req.body;
    const time = dayjs(datetime).hour(15).minute(0).second(0).millisecond(0)
    const text = `Hello ${name}! You have scheduled a leave today for the intention of ${intention}.  Please respond with 1 to confirm or 2 if you wish to cancel.`
    try {
        const sms = await sendScheduledSms(phone, text, time);
        return res.status(200).json({ sms })
    } catch (err) {
        console.log("error scheduling first sms. ", err );
        res.status(401).json({ err });
    }
   
}

exports.nudgeTexts = async (req, res) => {
    const { timezone, phone, datetime, intention, name } = req.body;


}
const Sms = require('../models/SmsModel');
const mongoose = require('mongoose');
const { sendScheduledSms, sendBulkSmsCSV } = require('../helpers/httpsms')

const dayjs =  require('dayjs');


exports.httpSmsWebhook =  async (req, res) => {
  // Verify auth token
  if (process.env.WEBHOOK_SECRET) {
    try {
      // const token = await req.header("Authorization").replace("Bearer ", "");
      // const { header, payload } = await jwt.decode(token, {complete: true})
      // const claims = await jwt.verify(token, process.env.WEBHOOK_SECRET);
      console.log("JWT token verified: ", req.auth)
  
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


exports.scheduleInitialSms = async (req, res) => {
    const { timezone, phone, dateScheduled, intention, profileName } = req.body;
    const hour = dayjs(dateScheduled).hour()
    const date = dayjs(dateScheduled).hour(15).minute(0).second(0).millisecond(0)
    const text = `Hello ${profileName}! You have scheduled a leave today at ${hour} for the intention of ${intention}.  Please respond with 1 to confirm or 2 if you wish to cancel.`
    try {
        const sms = await sendScheduledSms(phone, text, date);
        console.log("Scheduled initial sms, ", sms)
        return res.status(200).json({ sms })
    } catch (err) {
        console.log("error scheduling first sms. ", err );
        res.status(401).json({ err });
    }
   
}

exports.nudgeTexts = async (req, res) => {
    const { name, phone, intention, datetime, timezone } = req.body;
    try {
      const nudgeTexts = await sendBulkSmsCSV(name, phone, intention, datetime, timezone)
      return res.status(200).json({ nudgeTexts })
    } catch (err) {
        console.log("error creating nudgeTexts. ", err );
        res.status(401).json({ err });
    }


}
const Sms = require('../models/SmsModel');
const mongoose = require('mongoose');
const { expressjwt: jwt } = require("express-jwt");

const dayjs =  require('dayjs');


exports.httpsmsWebhook = async (req, res) => {
  // Verify auth token
  if (process.env.HTTPSMS_WEBHOOK_SIGNING_KEY) {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const claims = jwt.verify(token, process.env.HTTPSMS_WEBHOOK_SIGNING_KEY);
  
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

exports.nudgeTexts = async (req, res) => {
    const { timezone, phone, datetime, intention, name } = req.body;


}
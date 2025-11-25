const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt')
const { expressjwt: jwt } = require("express-jwt");

const { httpSmsWebhook, nudgeTexts, scheduleInitialSms } = require('../controllers/httpSms');

router.post('/httpSms/webhooks', jwt({ 
    secret: process.env.WEBHOOK_SECRET, algorithms: ['HS256'],
  }), httpSmsWebhook);
router.post('/httpSms/nudgeTexts', checkJwt, nudgeTexts);
router.post('/httpSms/initialSms', checkJwt, scheduleInitialSms)
module.exports = router;

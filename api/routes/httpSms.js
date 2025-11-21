const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt')

const { httpSmsWebhook, nudgeTexts, scheduleInitialSms } = require('../controllers/httpSms');

router.post('/httpSms/webhooks', httpSmsWebhook);
router.post('/httpSms/nudgeTexts', checkJwt, nudgeTexts);
router.post('/httpSms/initialSms', checkJwt, scheduleInitialSms)
module.exports = router;

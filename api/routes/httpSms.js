const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt')

const { httpSmsWebhook, nudgeTexts } = require('../controllers/httpSms');

router.post('/httpSms/webhooks', httpSmsWebhook);
router.post('/httpSms/nudgeTexts', checkJwt, nudgeTexts);

module.exports = router;

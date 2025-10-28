const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt')

const { httpSmsWebHook, nudgeTexts } = require('../controllers/httpSms');

router.post('/httpSms/webhooks', httpSmsWebHook);
router.post('/httpSms/nudgeTexts', checkJwt, nudgeTexts);

module.exports = router;

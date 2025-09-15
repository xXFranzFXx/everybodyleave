const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt')
const { textBeeSms, textBeeSmsCancel } = require('../controllers/textBee');

router.post('/textBee/verificationSMS', checkJwt, textBeeSms);
router.post('/textBee/cancellationSMS', checkJwt, textBeeSmsCancel);

module.exports =  router; 
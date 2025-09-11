const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt')
const { textBeeSms } = require('../controllers/textBee');

router.post('/textBee/verificationSMS', checkJwt, textBeeSms);

module.exports =  router; 
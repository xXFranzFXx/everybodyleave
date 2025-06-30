const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt')
const { saveReminder, cancelReminder } = require('../controllers/events')

router.post('/events/save', saveReminder);
router.put('/events/cancel', checkJwt, cancelReminder);

module.exports = router ;
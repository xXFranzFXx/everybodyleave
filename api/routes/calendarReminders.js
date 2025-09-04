const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt')

const { 
    saveCalendarReminder, 
} = require('../controllers/calendar')

router.post('/calendarReminders/save', checkJwt, saveCalendarReminder);

module.exports = router;
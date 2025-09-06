const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt')

const { 
    saveCalendarReminder, 
    getCalendarReminders,
} = require('../controllers/calendar')

router.post('/calendarReminders/saveReminder', checkJwt, saveCalendarReminder);
router.get('/calendarReminders/getReminders', checkJwt, getCalendarReminders)
module.exports = router;
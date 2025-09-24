const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt')

const { 
    saveCalendarReminder, 
    getCalendarReminders,
    deleteCalendarReminder
} = require('../controllers/calendar')

router.post('/calendarReminders/saveReminder', checkJwt, saveCalendarReminder);
router.get('/calendarReminders/getReminders', checkJwt, getCalendarReminders);
router.put('/calendarReminders/deleteReminder', checkJwt, deleteCalendarReminder)

module.exports = router;
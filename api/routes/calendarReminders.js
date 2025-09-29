const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt')

const { 
    saveCalendarReminder, 
    getCalendarReminders,
    deleteCalendarReminder,
    updateCalendarReminder
} = require('../controllers/calendar')

router.post('/calendarReminders/saveReminder', checkJwt, saveCalendarReminder);
router.get('/calendarReminders/getReminders', checkJwt, getCalendarReminders);
router.put('/calendarReminders/deleteReminder', checkJwt, deleteCalendarReminder);
router.put('/calendarReminders/updateReminder', checkJwt, updateCalendarReminder);


module.exports = router;
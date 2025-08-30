const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt')
const { 
    saveReminder, 
    cancelReminder, 
    getAllDates, 
    getAllOpenDates,
    getDateRange, 
    getLatestTime, 
    saveToBucket, 
    removeReminder, 
    getReminders 
} = require('../controllers/events')

router.post('/events/save', checkJwt, saveReminder);//old
router.post('/events/saveBucket', checkJwt, saveToBucket);
router.put('/events/cancel', checkJwt, cancelReminder); //old
router.put('/events/remove', checkJwt, removeReminder);
router.get('/events/allDates', getAllDates);
router.get('/events/dateRange', getDateRange);
router.get('/events/latestTime', getLatestTime);
router.get('/events/getReminders', checkJwt, getReminders);
router.get('/events/allOpenDates', getAllOpenDates);
module.exports = router ;
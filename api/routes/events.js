const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt')
const { saveReminder, cancelReminder, getAllDates, getDateRange, getLatestTime } = require('../controllers/events')

router.post('/events/save', checkJwt, saveReminder);
router.put('/events/cancel', checkJwt, cancelReminder);
router.get('/events/allDates', getAllDates);
router.get('/events/dateRange', getDateRange);
router.get('/events/latestTime', getLatestTime);

module.exports = router ;
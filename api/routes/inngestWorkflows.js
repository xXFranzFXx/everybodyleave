const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt')
const { cancelLeave, createLeave, nudgTexts, subscriptionToken } = require('../controllers/inngest');

router.post('/inngestWorkflows/createLeave', checkJwt, createLeave)
router.post('/inngestWorkflows/cancelLeave', checkJwt, cancelLeave)
router.post('inngestWorkflows/realtime/token', checkJwt, subscriptionToken)
module.exports = router;

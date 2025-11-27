const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt')
const { cancelLeave, createLeave, nudgTexts } = require('../controllers/inngest');

router.post('/inngestWorkflows/createLeave', checkJwt, createLeave)
module.exports = router;

const express = require('express');
const router = express.Router();

// import controller
const { postSignIn, scheduleReminder } = require('../controllers/user');
const { checkJwt } =  require('../jwt/checkJwt');

router.get('/user/:id', checkJwt, postSignIn);
router.put('/user/updateUser', checkJwt, scheduleReminder);

module.exports = router ;




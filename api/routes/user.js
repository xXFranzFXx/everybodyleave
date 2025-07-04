const express = require('express');
const router = express.Router();

// import controller
const { postSignIn, scheduledReminders } = require('../controllers/user');
const { checkJwt } =  require('../jwt/checkJwt');

router.get('/user/:id', checkJwt, postSignIn);
router.put('/user/updateUser', checkJwt, scheduledReminders);

module.exports = router ;




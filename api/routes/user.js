const express = require('express');
const router = express.Router();

// import controller
const { postSignIn, scheduledReminders, getProgress } = require('../controllers/user');
const { checkJwt } =  require('../jwt/checkJwt');

// router.get('/user/:id', checkJwt, postSignIn);
router.put('/user/updateUser', checkJwt, scheduledReminders);
router.get('/user/progress', checkJwt, getProgress);


module.exports = router ;




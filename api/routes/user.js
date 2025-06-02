const express = require('express');
const router = express.Router();

// import controller
const { postSignIn, update } = require('../controllers/user');


module.exports = router;

const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt');
const { createOrder, captureOrder } = require('../controllers/paypal');

router.post('/payments/createOrder', checkJwt, createOrder);
router.post('/payments/captureOrder', checkJwt, captureOrder);

module.exports = router;
const express = require('express');
const router = express.Router();
const { checkJwt } = require('../jwt/checkJwt');
const { createPaypalOrder, capturePaypalOrder } = require('../controllers/paypal');

router.post('/payments/createOrder', checkJwt, createPaypalOrder);
router.get('/payments/captureOrder', checkJwt, capturePaypalOrder);
// router.post('/payments/createOrder',  createOrder);
// router.post('/payments/captureOrder',  captureOrder);

module.exports = router;
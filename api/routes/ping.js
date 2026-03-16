const express = require('express');
const router = express.Router();
const { healthCheck } = require('../controllers/ping')

router.get('/healthcheck', healthCheck);

module.exports = router;
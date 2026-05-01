const express = require('express');
const { initiateStkPush, paymentCallback } = require('../controllers/paymentController');

const router = express.Router();

router.post('/stkpush', initiateStkPush);
router.post('/callback', paymentCallback);

module.exports = router;

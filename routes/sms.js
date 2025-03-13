const express = require('express');
const router = express.Router();

const { smsWebhook, sendSms } = require('../controllers/sms');

router.post('/sms', smsWebhook);

router.post('/send', sendSms);

module.exports = router;
const express = require('express');
const { createCheckout, cancelSubscription, getStatus, webhook } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-checkout', protect, createCheckout);
router.post('/cancel', protect, cancelSubscription);
router.get('/status', protect, getStatus);
router.post('/mock-subscribe', protect, require('../controllers/subscriptionController').mockSubscribe);
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

module.exports = router;

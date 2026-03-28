const asyncHandler = require('express-async-handler');
const Subscription = require('../models/Subscription');

const subscriptionGuard = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.findOne({
    userId: req.user.id,
    status: 'active',
  });

  if (!subscription) {
    res.status(403);
    throw new Error('Active subscription required');
  }

  next();
});

module.exports = { subscriptionGuard };

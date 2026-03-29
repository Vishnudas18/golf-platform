const stripe = require('../config/stripe');
const asyncHandler = require('express-async-handler');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { handleStripeWebhook } = require('../services/stripeWebhook');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// @desc    Create Stripe Checkout Session
// @route   POST /api/subscriptions/create-checkout
// @access  Private
const createCheckout = asyncHandler(async (req, res) => {
  const { plan } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const priceId = plan === 'yearly' 
    ? process.env.STRIPE_YEARLY_PRICE_ID 
    : process.env.STRIPE_MONTHLY_PRICE_ID;

  // Automatic fallback for testing/machine test
  // Automatic fallback for testing/machine test
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
    console.log('DEV MODE: Automatically activating mock subscription since Stripe keys are placeholders');
    return mockSubscribe(req, res);
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/subscribe`,
      metadata: {
        userId: user._id.toString(),
      },
    });

    // Create initial subscription record in DB
    await Subscription.findOneAndUpdate(
      { userId: user._id },
      {
        stripeSubscriptionId: 'pending',
        plan,
        status: 'inactive',
      },
      { upsert: true, new: true }
    );

    successResponse(res, 200, { url: session.url }, 'Checkout session created');
  } catch (error) {
    console.error('Stripe Checkout Error:', error.message);
    res.status(400);
    throw new Error('Stripe Checkout failed. If you are testing, please use the "[ Developer: Bypass Stripe ]" button below.');
  }
});

// @desc    Cancel subscription
// @route   POST /api/subscriptions/cancel
// @access  Private
const cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({ userId: req.user.id });

  if (!subscription || !subscription.stripeSubscriptionId) {
    res.status(404);
    throw new Error('No active subscription found');
  }

  // Cancel at period end via Stripe
  const updatedStripeSub = await stripe.subscriptions.update(
    subscription.stripeSubscriptionId,
    { cancel_at_period_end: true }
  );

  subscription.cancelAtPeriodEnd = true;
  await subscription.save();

  successResponse(res, 200, subscription, 'Subscription set to cancel at period end');
});

// @desc    Get subscription status
// @route   GET /api/subscriptions/status
// @access  Private
const getStatus = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({ userId: req.user.id });
  if (subscription) {
    successResponse(res, 200, subscription, 'Subscription status fetched');
  } else {
    successResponse(res, 200, { status: 'inactive' }, 'No subscription found');
  }
});

// @desc    Stripe Webhook Handler
// @route   POST /api/subscriptions/webhook
// @access  Public (Webhook)
const webhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  await handleStripeWebhook(event);

  res.json({ received: true });
});

const mockSubscribe = asyncHandler(async (req, res) => {
  const { plan } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const subscription = await Subscription.findOneAndUpdate(
    { userId: user._id },
    {
      stripeSubscriptionId: 'mock_' + Date.now(),
      plan: plan || 'monthly',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      amount: plan === 'yearly' ? 24000 : 2500,
      currency: 'gbp',
    },
    { upsert: true, new: true }
  );

  successResponse(res, 200, { ...subscription.toObject(), url: '/dashboard' }, 'Mock subscription activated successfully');
});

module.exports = {
  createCheckout,
  cancelSubscription,
  getStatus,
  webhook,
  mockSubscribe,
};

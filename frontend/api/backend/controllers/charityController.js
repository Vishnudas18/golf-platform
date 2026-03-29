const Charity = require('../models/Charity');
const Donation = require('../models/Donation');
const stripe = require('../config/stripe');
const asyncHandler = require('express-async-handler');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// @desc    Get all active charities
// @route   GET /api/charities
// @access  Public
const getAllCharities = asyncHandler(async (req, res) => {
  const { search, featured } = req.query;
  const query = { isActive: true };

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  if (featured === 'true') {
    query.isFeatured = true;
  }

  const charities = await Charity.find(query);
  successResponse(res, 200, charities, 'Charities fetched successfully');
});

// @desc    Get charity by slug
// @route   GET /api/charities/:slug
// @access  Public
const getCharityBySlug = asyncHandler(async (req, res) => {
  const charity = await Charity.findOne({ slug: req.params.slug, isActive: true });

  if (!charity) {
    res.status(404);
    throw new Error('Charity not found');
  }

  successResponse(res, 200, charity, 'Charity details fetched successfully');
});

// @desc    Make independent donation
// @route   POST /api/charities/:id/donate
// @access  Private
const makeDonation = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const charityId = req.params.id;

  const charity = await Charity.findById(charityId);
  if (!charity) {
    res.status(404);
    throw new Error('Charity not found');
  }

  // MOCK MODE: If Stripe key is placeholder, bypass real Stripe call
  let clientSecret = 'mock_secret_' + Math.random().toString(36).substr(2, 9);
  let paymentIntentId = 'pi_mock_' + Math.random().toString(36).substr(2, 9);

  if (process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder') {
    try {
      // Create real Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // amount in pence
        currency: 'gbp',
        metadata: {
          userId: req.user.id,
          charityId,
          type: 'independent',
        },
      });
      clientSecret = paymentIntent.client_secret;
      paymentIntentId = paymentIntent.id;
    } catch (stripeError) {
      console.error('Stripe Error:', stripeError.message);
      res.status(400);
      throw new Error('Payment processing failed. Please check Stripe configuration.');
    }
  } else {
    console.warn('DEV MODE: Using mock payment since Stripe key is placeholder');
  }

  // Create Donation record
  const donation = await Donation.create({
    userId: req.user.id,
    charityId,
    amount,
    type: 'independent',
    stripePaymentIntentId: paymentIntentId,
  });

  // Update charity total
  charity.totalReceived += amount;
  await charity.save();

  successResponse(res, 200, {
    clientSecret,
    donationId: donation._id,
  }, 'Payment intent created (Mock Mode active)');
});

module.exports = {
  getAllCharities,
  getCharityBySlug,
  makeDonation,
};

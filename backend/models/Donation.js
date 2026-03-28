const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  charityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charity',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['subscription_share', 'independent'],
    required: true,
  },
  stripePaymentIntentId: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Donation', donationSchema);

const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  stripeSubscriptionId: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    enum: ['monthly', 'yearly'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'lapsed', 'cancelled'],
    default: 'inactive',
  },
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false,
  },
  amount: Number,
  currency: {
    type: String,
    default: 'gbp',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Subscription', subscriptionSchema);

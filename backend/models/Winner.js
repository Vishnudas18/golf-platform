const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  drawId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Draw',
    required: true,
  },
  matchType: {
    type: String,
    enum: ['fiveMatch', 'fourMatch', 'threeMatch'],
    required: true,
  },
  prizeAmount: Number,
  proofUrl: String, // Cloudinary URL
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
  adminNote: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Winner', winnerSchema);

const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },
  drawnNumbers: [{
    type: Number,
  }],
  drawType: {
    type: String,
    enum: ['random', 'weighted'],
  },
  status: {
    type: String,
    enum: ['draft', 'simulated', 'published'],
    default: 'draft',
  },
  prizePool: {
    total: { type: Number, default: 0 },
    jackpot: { type: Number, default: 0 },
    fourMatchPool: { type: Number, default: 0 },
    threeMatchPool: { type: Number, default: 0 },
  },
  results: {
    fiveMatch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    fourMatch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    threeMatch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  jackpotRolledOver: {
    type: Boolean,
    default: false,
  },
  rolledOverAmount: {
    type: Number,
    default: 0,
  },
  publishedAt: Date,
}, {
  timestamps: true,
});

// Compound unique index for month and year
drawSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Draw', drawSchema);

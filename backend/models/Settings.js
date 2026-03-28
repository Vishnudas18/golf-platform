const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  drawLogic: {
    type: String,
    enum: ['random', 'weighted'],
    default: 'random',
  },
  jackpotPercentage: {
    type: Number,
    default: 50,
  },
  fourMatchPercentage: {
    type: Number,
    default: 30,
  },
  threeMatchPercentage: {
    type: Number,
    default: 20,
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);

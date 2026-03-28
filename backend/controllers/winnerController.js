const Winner = require('../models/Winner');
const Draw = require('../models/Draw');
const asyncHandler = require('express-async-handler');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// @desc    Upload winning proof
// @route   POST /api/winners/:id/upload-proof
// @access  Private
const uploadProof = asyncHandler(async (req, res) => {
  const winner = await Winner.findById(req.params.id);

  if (!winner) {
    res.status(404);
    throw new Error('Winner record not found');
  }

  if (winner.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to upload proof for this record');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a proof image');
  }

  // Upload to Cloudinary
  const folder = 'golfgives/proofs';
  const proofUrl = await uploadToCloudinary(req.file.path, folder);

  winner.proofUrl = proofUrl;
  winner.verificationStatus = 'pending';
  await winner.save();

  successResponse(res, 200, winner, 'Proof uploaded successfully, pending verification');
});

// @desc    Get my winnings
// @route   GET /api/winners/me
// @access  Private
const getMyWinnings = asyncHandler(async (req, res) => {
  const winnings = await Winner.find({ userId: req.user.id })
    .populate('drawId', 'month year drawnNumbers')
    .sort({ createdAt: -1 });

  successResponse(res, 200, winnings, 'Winnings fetched successfully');
});

module.exports = {
  uploadProof,
  getMyWinnings,
};

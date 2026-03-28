const Draw = require('../models/Draw');
const asyncHandler = require('express-async-handler');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// @desc    Get all published draws
// @route   GET /api/draws
// @access  Public
const getAllDraws = asyncHandler(async (req, res) => {
  const draws = await Draw.find({ status: 'published' })
    .sort({ year: -1, month: -1 });
  successResponse(res, 200, draws, 'Draws fetched successfully');
});

// @desc    Get latest published draw
// @route   GET /api/draws/latest
// @access  Public
const getLatestDraw = asyncHandler(async (req, res) => {
  const draw = await Draw.findOne({ status: 'published' })
    .sort({ year: -1, month: -1 });
  successResponse(res, 200, draw, 'Latest draw fetched successfully');
});

// @desc    Get draw by ID
// @route   GET /api/draws/:id
// @access  Public
const getDrawById = asyncHandler(async (req, res) => {
  const draw = await Draw.findById(req.params.id)
    .populate('results.fiveMatch', 'name')
    .populate('results.fourMatch', 'name')
    .populate('results.threeMatch', 'name');

  if (!draw) {
    res.status(404);
    throw new Error('Draw not found');
  }

  successResponse(res, 200, draw, 'Draw details fetched successfully');
});

module.exports = {
  getAllDraws,
  getLatestDraw,
  getDrawById,
};

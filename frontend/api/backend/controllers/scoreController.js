const Score = require('../models/Score');
const asyncHandler = require('express-async-handler');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// @desc    Get user scores
// @route   GET /api/scores
// @access  Private/Subscriber
const getScores = asyncHandler(async (req, res) => {
  const scoreDoc = await Score.findOne({ userId: req.user.id });
  if (scoreDoc) {
    const sortedScores = scoreDoc.scores.sort((a, b) => b.date - a.date);
    successResponse(res, 200, sortedScores, 'Scores fetched successfully');
  } else {
    successResponse(res, 200, [], 'No scores found');
  }
});

// @desc    Add new score
// @route   POST /api/scores
// @access  Private/Subscriber
const addScore = asyncHandler(async (req, res) => {
  const { value, date } = req.body;

  if (value < 1 || value > 45) {
    res.status(400);
    throw new Error('Score must be between 1 and 45');
  }

  if (new Date(date) > new Date()) {
    res.status(400);
    throw new Error('Date cannot be in the future');
  }

  let scoreDoc = await Score.findOne({ userId: req.user.id });

  if (!scoreDoc) {
    scoreDoc = new Score({
      userId: req.user.id,
      scores: [],
    });
  }

  // Rolling 5-score logic
  scoreDoc.scores.unshift({ value, date });
  if (scoreDoc.scores.length > 5) {
    scoreDoc.scores = scoreDoc.scores.slice(0, 5);
  }

  scoreDoc.updatedAt = Date.now();
  await scoreDoc.save();

  successResponse(res, 201, scoreDoc.scores, 'Score added successfully');
});

// @desc    Edit score
// @route   PUT /api/scores/:id
// @access  Private/Subscriber
const editScore = asyncHandler(async (req, res) => {
  const { value, date } = req.body;
  const scoreId = req.params.id;

  if (value < 1 || value > 45) {
    res.status(400);
    throw new Error('Score must be between 1 and 45');
  }

  const scoreDoc = await Score.findOne({ userId: req.user.id });

  if (!scoreDoc) {
    res.status(404);
    throw new Error('Scores not found');
  }

  const scoreIndex = scoreDoc.scores.findIndex(s => s._id.toString() === scoreId);

  if (scoreIndex === -1) {
    res.status(404);
    throw new Error('Score entry not found');
  }

  scoreDoc.scores[scoreIndex].value = value;
  scoreDoc.scores[scoreIndex].date = date;
  scoreDoc.updatedAt = Date.now();

  await scoreDoc.save();

  successResponse(res, 200, scoreDoc.scores, 'Score updated successfully');
});

// @desc    Delete score
// @route   DELETE /api/scores/:id
// @access  Private/Subscriber
const deleteScore = asyncHandler(async (req, res) => {
  const scoreId = req.params.id;
  const scoreDoc = await Score.findOne({ userId: req.user.id });

  if (!scoreDoc) {
    res.status(404);
    throw new Error('Scores not found');
  }

  scoreDoc.scores = scoreDoc.scores.filter(s => s._id.toString() !== scoreId);
  scoreDoc.updatedAt = Date.now();

  await scoreDoc.save();

  successResponse(res, 200, scoreDoc.scores, 'Score deleted successfully');
});

module.exports = {
  getScores,
  addScore,
  editScore,
  deleteScore,
};

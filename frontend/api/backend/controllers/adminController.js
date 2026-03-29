const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Draw = require('../models/Draw');
const Charity = require('../models/Charity');
const Winner = require('../models/Winner');
const Donation = require('../models/Donation');
const Score = require('../models/Score');
const Settings = require('../models/Settings');
const asyncHandler = require('express-async-handler');
const { runRandomDraw, runWeightedDraw } = require('../services/drawEngine');
const { calculatePool } = require('../services/prizePool');
const { sendDrawResultEmail, sendWinnerEmail } = require('../services/emailService');
const { matchUserScores } = require('../utils/matchScores');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// --- User Management ---

// @desc    Get all users with subscription status
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find().skip(skip).limit(limit).select('-refreshToken');
  const count = await User.countDocuments();

  // Populate subscription status for each user
  const usersWithSub = await Promise.all(users.map(async (user) => {
    const sub = await Subscription.findOne({ userId: user._id });
    return {
      ...user._doc,
      subscriptionStatus: sub ? sub.status : 'inactive',
    };
  }));

  successResponse(res, 200, {
    users: usersWithSub,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    totalUsers: count,
  }, 'Users fetched successfully');
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, role, charityId, charityPercent } = req.body;
  user.name = name || user.name;
  user.role = role || user.role;
  user.charityId = charityId || user.charityId;
  user.charityPercent = charityPercent || user.charityPercent;

  await user.save();
  successResponse(res, 200, user, 'User updated successfully');
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();
  successResponse(res, 200, null, 'User deleted successfully');
});

// --- Draw Management ---

// @desc    Simulate Draw
// @route   POST /api/admin/draws/simulate
// @access  Admin
const simulateDraw = asyncHandler(async (req, res) => {
  let { drawType } = req.body; // 'random' or 'weighted'
  
  // If no type provided, use global settings
  if (!drawType) {
    const settings = await Settings.findOne();
    drawType = settings ? settings.drawLogic : 'random';
  }

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  let drawnNumbers;
  if (drawType === 'weighted') {
    // Fetch all active subscriber scores
    const activeSubs = await Subscription.find({ status: 'active' }).select('userId');
    const userIds = activeSubs.map(s => s.userId);
    
    // Flatten all scores
    const scoreDocs = await Score.find({ userId: { $in: userIds } });
    const allScores = scoreDocs.flatMap(doc => doc.scores.map(s => s.value));
    
    drawnNumbers = runWeightedDraw(allScores);
  } else {
    drawnNumbers = runRandomDraw();
  }

  // Calculate prize pool
  const activeSubscriberCount = await Subscription.countDocuments({ status: 'active' });
  const avgAmount = 25; // Default average, could be dynamic
  
  // Find last unpublished jackpot rollover
  const lastDraw = await Draw.findOne({ status: 'published' }).sort({ createdAt: -1 });
  const rolledOverAmount = lastDraw && lastDraw.jackpotRolledOver ? lastDraw.rolledOverAmount : 0;
  
  const pool = calculatePool(activeSubscriberCount, avgAmount, rolledOverAmount);

  // Match all user scores
  const activeSubs = await Subscription.find({ status: 'active' });
  const results = {
    fiveMatch: [],
    fourMatch: [],
    threeMatch: [],
  };

  for (const sub of activeSubs) {
    const scoreDoc = await Score.findOne({ userId: sub.userId });
    if (scoreDoc) {
      const matchTier = matchUserScores(scoreDoc.scores, drawnNumbers);
      if (matchTier) {
        results[matchTier].push(sub.userId);
      }
    }
  }

  // Save as draft/simulated
  const existingDraw = await Draw.findOneAndUpdate(
    { month, year },
    {
      drawnNumbers,
      drawType,
      status: 'simulated',
      prizePool: pool,
      results,
      rolledOverAmount,
    },
    { upsert: true, new: true }
  );

  successResponse(res, 200, {
    draw: existingDraw,
    activeSubscribers: activeSubscriberCount,
  }, 'Draw simulated successfully');
});

// @desc    Publish Draw
// @route   POST /api/admin/draws/:id/publish
// @access  Admin
const publishDraw = asyncHandler(async (req, res) => {
  const draw = await Draw.findById(req.params.id);
  if (!draw || draw.status !== 'simulated') {
    res.status(400);
    throw new Error('Simulated draw not found');
  }

  draw.status = 'published';
  draw.publishedAt = Date.now();

  // Create Winner records
  const createWinners = async (userIds, matchType, totalPool) => {
    if (userIds.length === 0) return;
    const amountPerWinner = totalPool / userIds.length;
    for (const userId of userIds) {
      const winner = await Winner.create({
        userId,
        drawId: draw._id,
        matchType,
        prizeAmount: amountPerWinner,
      });
      const user = await User.findById(userId);
      await sendWinnerEmail(user, amountPerWinner);
    }
  };

  await createWinners(draw.results.fiveMatch, 'fiveMatch', draw.prizePool.jackpot);
  await createWinners(draw.results.fourMatch, 'fourMatch', draw.prizePool.fourMatchPool);
  await createWinners(draw.results.threeMatch, 'threeMatch', draw.prizePool.threeMatchPool);

  // Jackpot rollover check
  if (draw.results.fiveMatch.length === 0) {
    draw.jackpotRolledOver = true;
    draw.rolledOverAmount = draw.prizePool.jackpot;
  } else {
    draw.jackpotRolledOver = false;
    draw.rolledOverAmount = 0;
  }

  await draw.save();

  // Send general draw results email to all subscribers?
  // (Optional: Implement in background)

  successResponse(res, 200, draw, 'Draw published and winners notified');
});

// --- Charity Management ---

// @desc    Add Charity
// @route   POST /api/admin/charities
// @access  Admin
const addCharity = asyncHandler(async (req, res) => {
  const { name, description, website } = req.body;
  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  let logoUrl = '';
  if (req.file) {
    logoUrl = req.file.path; // Multer-Cloudinary
  }

  const charity = await Charity.create({
    name,
    slug,
    description,
    website,
    logo: logoUrl,
  });

  successResponse(res, 201, charity, 'Charity added successfully');
});

// @desc    Update Charity
// @route   PUT /api/admin/charities/:id
// @access  Admin
const updateCharity = asyncHandler(async (req, res) => {
  const charity = await Charity.findById(req.params.id);
  if (!charity) {
    res.status(404);
    throw new Error('Charity not found');
  }

  const { name, description, website, isActive, isFeatured } = req.body;
  charity.name = name || charity.name;
  charity.description = description || charity.description;
  charity.website = website || charity.website;
  charity.isActive = isActive !== undefined ? isActive : charity.isActive;
  charity.isFeatured = isFeatured !== undefined ? isFeatured : charity.isFeatured;

  if (req.file) {
    charity.logo = req.file.path;
  }

  await charity.save();
  successResponse(res, 200, charity, 'Charity updated successfully');
});

// --- Analytics ---

// @desc    Get Admin Analytics
// @route   GET /api/admin/analytics
// @access  Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeSubscribers = await Subscription.countDocuments({ status: 'active' });
  const totalCharityDonations = await Donation.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
  
  const draws = await Draw.find({ status: 'published' });
  const totalPrizePool = draws.reduce((acc, draw) => acc + (draw.prizePool ? draw.prizePool.total : 0), 0);

  successResponse(res, 200, {
    totalUsers,
    activeSubscribers,
    totalPrizePool,
    totalCharityDonations: totalCharityDonations.length > 0 ? totalCharityDonations[0].total : 0,
    totalDraws: draws.length,
    recentWinners: await Winner.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name').populate('drawId', 'month year'),
  }, 'Analytics fetched successfully');
});

// @desc    Edit user score
// @route   PUT /api/admin/users/:userId/scores
// @access  Admin
const editUserScore = asyncHandler(async (req, res) => {
  const { scores } = req.body; // Array of 5 numbers
  if (!scores || scores.length !== 5) {
    res.status(400);
    throw new Error('Please provide exactly 5 numbers');
  }

  const scoreDoc = await Score.findOneAndUpdate(
    { userId: req.params.userId },
    { scores: scores.map(v => ({ value: v })) },
    { upsert: true, new: true }
  );

  successResponse(res, 200, scoreDoc, 'User scores updated successfully');
});

// --- Winners Management ---

// @desc    Get all winners
// @route   GET /api/admin/winners
// @access  Admin
const getAllWinners = asyncHandler(async (req, res) => {
  const winners = await Winner.find()
    .populate('userId', 'name email')
    .populate('drawId', 'month year drawnNumbers')
    .sort({ createdAt: -1 });

  successResponse(res, 200, winners, 'Winners fetched successfully');
});

// @desc    Verify winner
// @route   PATCH /api/admin/winners/:id/verify
// @access  Admin
const verifyWinner = asyncHandler(async (req, res) => {
  const { verificationStatus } = req.body; // 'verified', 'rejected'
  const winner = await Winner.findById(req.params.id);

  if (!winner) {
    res.status(404);
    throw new Error('Winner record not found');
  }

  winner.verificationStatus = verificationStatus;
  if (verificationStatus === 'verified') {
    winner.verifiedAt = Date.now();
  }

  await winner.save();
  successResponse(res, 200, winner, `Winner ${verificationStatus} successfully`);
});

// @desc    Mark payout as completed
// @route   PATCH /api/admin/winners/:id/payout
// @access  Admin
const markPayout = asyncHandler(async (req, res) => {
  const winner = await Winner.findById(req.params.id);

  if (!winner) {
    res.status(404);
    throw new Error('Winner record not found');
  }

  if (winner.verificationStatus !== 'verified') {
    res.status(400);
    throw new Error('Winner must be verified before marking payout');
  }

  winner.paymentStatus = 'paid';
  winner.paidAt = Date.now();

  await winner.save();
  successResponse(res, 200, winner, 'Payout marked as completed');
});

// --- Charity Management (Extra) ---

// @desc    Delete Charity
// @route   DELETE /api/admin/charities/:id
// @access  Admin
const deleteCharity = asyncHandler(async (req, res) => {
  const charity = await Charity.findById(req.params.id);
  if (!charity) {
    res.status(404);
    throw new Error('Charity not found');
  }

  await charity.deleteOne();
  successResponse(res, 200, null, 'Charity deleted successfully');
});

// --- Draw Settings ---

// @desc    Get Draw Settings
// @route   GET /api/admin/settings
// @access  Admin
const getDrawSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({ drawLogic: 'random' });
  }
  successResponse(res, 200, settings, 'Settings fetched successfully');
});

// @desc    Update Draw Settings
// @route   PUT /api/admin/settings
// @access  Admin
const updateDrawSettings = asyncHandler(async (req, res) => {
  const { drawLogic, jackpotPercentage, fourMatchPercentage, threeMatchPercentage } = req.body;
  
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
  }

  settings.drawLogic = drawLogic || settings.drawLogic;
  settings.jackpotPercentage = jackpotPercentage || settings.jackpotPercentage;
  settings.fourMatchPercentage = fourMatchPercentage || settings.fourMatchPercentage;
  settings.threeMatchPercentage = threeMatchPercentage || settings.threeMatchPercentage;
  settings.lastUpdatedBy = req.user._id;

  await settings.save();
  successResponse(res, 200, settings, 'Settings updated successfully');
});

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  editUserScore,
  simulateDraw,
  publishDraw,
  addCharity,
  updateCharity,
  deleteCharity,
  getAllWinners,
  verifyWinner,
  markPayout,
  getAnalytics,
  getDrawSettings,
  updateDrawSettings,
};

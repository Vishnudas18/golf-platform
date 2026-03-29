const express = require('express');
const {
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
  updateDrawSettings
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminGuard } = require('../middleware/adminGuard');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Apply protection and admin check to all admin routes
router.use(protect);
router.use(adminGuard);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/scores', editUserScore);

// Draw Management
router.post('/draws/simulate', simulateDraw);
router.post('/draws/:id/publish', publishDraw);

// Charity Management
router.post('/charities', upload.single('logo'), addCharity);
router.put('/charities/:id', upload.single('logo'), updateCharity);
router.delete('/charities/:id', deleteCharity);

// Winners Management
router.get('/winners', getAllWinners);
router.patch('/winners/:id/verify', verifyWinner);
router.patch('/winners/:id/payout', markPayout);

// Analytics & Settings
router.get('/analytics', getAnalytics);
router.get('/settings', getDrawSettings);
router.put('/settings', updateDrawSettings);

module.exports = router;

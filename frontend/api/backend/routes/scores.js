const express = require('express');
const { getScores, addScore, editScore, deleteScore } = require('../controllers/scoreController');
const { protect } = require('../middleware/authMiddleware');
const { subscriptionGuard } = require('../middleware/subscriptionGuard');

const router = express.Router();

router.use(protect);
router.get('/', getScores);

router.use(subscriptionGuard);
router.post('/', addScore);
router.put('/:id', editScore);
router.delete('/:id', deleteScore);

module.exports = router;

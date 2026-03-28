const express = require('express');
const { getAllCharities, getCharityBySlug, makeDonation } = require('../controllers/charityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllCharities);
router.get('/:slug', getCharityBySlug);
router.post('/:id/donate', protect, makeDonation);

module.exports = router;

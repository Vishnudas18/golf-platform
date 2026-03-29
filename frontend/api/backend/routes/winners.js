const express = require('express');
const { uploadProof, getMyWinnings } = require('../controllers/winnerController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/:id/upload-proof', protect, upload.single('proof'), uploadProof);
router.get('/me', protect, getMyWinnings);

module.exports = router;

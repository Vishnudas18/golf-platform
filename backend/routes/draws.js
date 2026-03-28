const express = require('express');
const { getAllDraws, getLatestDraw, getDrawById } = require('../controllers/drawController');

const router = express.Router();

router.get('/', getAllDraws);
router.get('/latest', getLatestDraw);
router.get('/:id', getDrawById);

module.exports = router;

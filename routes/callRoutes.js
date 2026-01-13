const express = require('express');
const {
  getAllCalls,
  getCallStats,
  createCall
} = require('../controllers/callController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, getCallStats);
router.get('/', protect, getAllCalls);
router.post('/', protect, createCall);

module.exports = router;

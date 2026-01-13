const express = require('express');
const {
  getAllChats,
  getChatByPhone,
  sendMessage,
  markAsRead
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getAllChats);
router.get('/:phone', protect, getChatByPhone);
router.post('/', protect, sendMessage);
router.put('/read/:phone', protect, markAsRead);

module.exports = router;

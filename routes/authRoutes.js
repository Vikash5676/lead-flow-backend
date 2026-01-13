const express = require('express');
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { testAuth, testDatabase } = require('../middleware/testMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/test-auth', testAuth);
router.get('/test-db', protect, testDatabase);

module.exports = router;

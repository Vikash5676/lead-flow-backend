const express = require('express');
const {
  getPendingUsers,
  getAllUsers,
  approveUser,
  rejectUser,
  toggleUserStatus,
  updateUserRole
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/pending', protect, authorize('super_admin'), getPendingUsers);
router.get('/users', protect, authorize('super_admin'), getAllUsers);
router.post('/approve', protect, authorize('super_admin'), approveUser);
router.delete('/reject/:userId', protect, authorize('super_admin'), rejectUser);
router.put('/toggle/:userId', protect, authorize('super_admin'), toggleUserStatus);
router.put('/role/:userId', protect, authorize('super_admin'), updateUserRole);

module.exports = router;

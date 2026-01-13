const express = require('express');
const {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLeadStats
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, getLeadStats);
router.get('/', protect, getAllLeads);
router.get('/:id', protect, getLeadById);
router.post('/', protect, createLead);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);

module.exports = router;

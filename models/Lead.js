const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a lead name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    enum: ['whatsapp', 'call'],
    required: [true, 'Please provide a source']
  },
  status: {
    type: String,
    enum: ['hot', 'warm', 'cold'],
    default: 'warm'
  },
  notes: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastContact: {
    type: Date
  }
}, {
  timestamps: true
});

leadSchema.index({ phone: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ name: 'text', email: 'text', phone: 'text' });

module.exports = mongoose.model('Lead', leadSchema);

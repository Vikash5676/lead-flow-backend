const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true
  },
  contactName: {
    type: String,
    trim: true
  },
  direction: {
    type: String,
    enum: ['incoming', 'outgoing'],
    required: [true, 'Please provide direction']
  },
  duration: {
    type: Number,
    default: 0
  },
  cost: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['completed', 'missed', 'failed'],
    default: 'completed'
  },
  notes: {
    type: String,
    trim: true
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

callSchema.index({ phoneNumber: 1, createdAt: -1 });
callSchema.index({ status: 1 });
callSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Call', callSchema);

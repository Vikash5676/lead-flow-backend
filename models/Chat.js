const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true
  },
  contactName: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    trim: true
  },
  direction: {
    type: String,
    enum: ['incoming', 'outgoing'],
    required: [true, 'Please provide direction']
  },
  read: {
    type: Boolean,
    default: false
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  }
}, {
  timestamps: true
});

chatMessageSchema.index({ phoneNumber: 1, createdAt: -1 });
chatMessageSchema.index({ phoneNumber: 1, read: 1 });

module.exports = mongoose.model('Chat', chatMessageSchema);

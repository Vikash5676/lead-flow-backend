const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['super_admin', 'authorized_user', 'pending_user'],
    default: 'pending_user'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'disabled'],
    default: 'pending'
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

/**
 * User Model Schema
 * Represents users in the wellness platform
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password_hash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password_hash;
  return user;
};

module.exports = mongoose.model('User', userSchema);
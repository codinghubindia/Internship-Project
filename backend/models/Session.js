const mongoose = require('mongoose');

/**
 * Session Model Schema
 * Represents wellness sessions (yoga, meditation, etc.)
 */
const sessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Session title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  json_file_url: {
    type: String,
    required: [true, 'JSON file URL is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the updated_at field before saving
sessionSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Index for better query performance
sessionSchema.index({ user_id: 1, status: 1 });
sessionSchema.index({ status: 1, created_at: -1 });

module.exports = mongoose.model('Session', sessionSchema);
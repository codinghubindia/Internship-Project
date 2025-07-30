const { validationResult } = require('express-validator');
const Session = require('../models/Session');

/**
 * Get all published sessions
 * GET /api/sessions
 */
const getPublishedSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' })
      .populate('user_id', 'email')
      .sort({ created_at: -1 });

    res.json({ sessions });
  } catch (error) {
    console.error('Get published sessions error:', error);
    res.status(500).json({
      message: 'Server error fetching sessions'
    });
  }
};

/**
 * Get user's sessions (both drafts and published)
 * GET /api/sessions/my-sessions
 */
const getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user._id })
      .sort({ updated_at: -1 });

    res.json({ sessions });
  } catch (error) {
    console.error('Get user sessions error:', error);
    res.status(500).json({
      message: 'Server error fetching your sessions'
    });
  }
};

/**
 * Get single session by ID
 * GET /api/sessions/my-sessions/:id
 */
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        message: 'Session not found'
      });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get session by ID error:', error);
    res.status(500).json({
      message: 'Server error fetching session'
    });
  }
};

/**
 * Save session as draft (create or update)
 * POST /api/sessions/my-sessions/save-draft
 */
const saveDraft = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, tags, json_file_url, sessionId } = req.body;

    let session;

    if (sessionId) {
      // Update existing session
      session = await Session.findOneAndUpdate(
        { _id: sessionId, user_id: req.user._id },
        {
          title,
          tags: tags || [],
          json_file_url,
          updated_at: Date.now()
        },
        { new: true, runValidators: true }
      );

      if (!session) {
        return res.status(404).json({
          message: 'Session not found'
        });
      }
    } else {
      // Create new session
      session = new Session({
        user_id: req.user._id,
        title,
        tags: tags || [],
        json_file_url,
        status: 'draft'
      });

      await session.save();
    }

    res.json({
      message: 'Draft saved successfully',
      session
    });
  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({
      message: 'Server error saving draft'
    });
  }
};

/**
 * Publish session
 * POST /api/sessions/my-sessions/publish
 */
const publishSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        message: 'Session ID is required'
      });
    }

    const session = await Session.findOneAndUpdate(
      { _id: sessionId, user_id: req.user._id },
      { 
        status: 'published',
        updated_at: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({
        message: 'Session not found'
      });
    }

    res.json({
      message: 'Session published successfully',
      session
    });
  } catch (error) {
    console.error('Publish session error:', error);
    res.status(500).json({
      message: 'Server error publishing session'
    });
  }
};

module.exports = {
  getPublishedSessions,
  getUserSessions,
  getSessionById,
  saveDraft,
  publishSession
};
const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getPublishedSessions,
  getUserSessions,
  getSessionById,
  saveDraft,
  publishSession
} = require('../controllers/sessionController');

const router = express.Router();

/**
 * Session Routes - All routes are protected with auth middleware
 */

// Validation middleware for session data
const sessionValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be between 1-200 characters'),
  body('json_file_url')
    .trim()
    .notEmpty()
    .withMessage('JSON file URL is required')
    .isURL()
    .withMessage('JSON file URL must be a valid URL'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

// GET /api/sessions - Get all published sessions
router.get('/sessions', auth, getPublishedSessions);

// GET /api/sessions/my-sessions - Get user's sessions
router.get('/my-sessions', auth, getUserSessions);

// GET /api/sessions/my-sessions/:id - Get single session by ID
router.get('/my-sessions/:id', auth, getSessionById);

// POST /api/sessions/my-sessions/save-draft - Save session as draft
router.post('/my-sessions/save-draft', auth, sessionValidation, saveDraft);

// POST /api/sessions/my-sessions/publish - Publish session
router.post('/my-sessions/publish', auth, publishSession);

module.exports = router;
import express from 'express';
import path from 'path';
import multer from 'multer';
import {
  getCurrentUser,
  updateCurrentUser,
  uploadResume,
  getUserInterviews,
  getInterviewById,
  getScoreSummary,
  getUserFeedback,
  getRecommendations,
  deleteAccount,
  uploadAvatar
} from './user.controller.js';
import { authenticateJWT } from '../../shared/middleware/authMiddleware.js';
import { validateRequest } from '../../shared/middleware/validation.middleware.js';
import { catchAsync } from '../../shared/errors/catchAsync.js';
import { updateUserSchema } from './user.validation.js';

const userRouter = express.Router();

// configure multer memory storage for resume uploads (uploaded to S3)
const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error('Only PDF/DOC/DOCX files are allowed'));
    }
    cb(null, true);
  }
});

// configure multer memory storage for image uploads
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error('Only JPG/JPEG/PNG/WEBP files are allowed'));
    }
    cb(null, true);
  }
});

/**
 * @route GET /api/users/me
 * @desc Get current authenticated user's profile
 * @access Private - Requires JWT authentication
 */
userRouter.get('/me', authenticateJWT, catchAsync(getCurrentUser));

/**
 * @route PUT /api/users/me
 * @desc Update current user's profile
 * @access Private - Requires JWT authentication
 * @body {name, bio, location, experienceYears, skills, education, picture}
 */
userRouter.put('/me', authenticateJWT, validateRequest(updateUserSchema), catchAsync(updateCurrentUser));

/**
 * @route POST /api/users/me/resume
 * @desc Upload or update user's resume
 * @access Private - Requires JWT authentication
 * @body {file} - Resume file (multipart/form-data)
 */
userRouter.post('/me/resume', authenticateJWT, resumeUpload.single('file'), catchAsync(uploadResume));

/**
 * @route POST /api/users/me/avatar
 * @desc Upload user's profile picture
 * @access Private - Requires JWT authentication
 * @body {file} - Image file (multipart/form-data)
 */
userRouter.post('/me/avatar', authenticateJWT, imageUpload.single('file'), catchAsync(uploadAvatar));

/**
 * @route GET /api/users/me/interviews
 * @desc Get all interviews for current user
 * @access Private - Requires JWT authentication
 */
userRouter.get('/me/interviews', authenticateJWT, catchAsync(getUserInterviews));

/**
 * @route GET /api/users/me/interviews/:id
 * @desc Get specific interview details
 * @access Private - Requires JWT authentication
 */
userRouter.get('/me/interviews/:id', authenticateJWT, catchAsync(getInterviewById));

/**
 * @route GET /api/users/me/score-summary
 * @desc Get user's score summary and statistics
 * @access Private - Requires JWT authentication
 */
userRouter.get('/me/score-summary', authenticateJWT, catchAsync(getScoreSummary));

/**
 * @route GET /api/users/me/feedback
 * @desc Get all feedback for user's interviews
 * @access Private - Requires JWT authentication
 */
userRouter.get('/me/feedback', authenticateJWT, catchAsync(getUserFeedback));

/**
 * @route GET /api/users/me/recommendations
 * @desc Get personalized recommendations based on performance
 * @access Private - Requires JWT authentication
 */
userRouter.get('/me/recommendations', authenticateJWT, catchAsync(getRecommendations));

/**
 * @route DELETE /api/users/me
 * @desc Delete complete user account footprint
 * @access Private - Requires JWT authentication
 */
userRouter.delete('/me', authenticateJWT, catchAsync(deleteAccount));

export default userRouter;

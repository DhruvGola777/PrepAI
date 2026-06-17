import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateJWT } from '../../shared/middleware/authMiddleware.js';
import { validateRequest } from '../../shared/middleware/validation.middleware.js';
import { catchAsync } from '../../shared/errors/catchAsync.js';
import {
  analyzeResume,
  startInterview,
  generateQuestion,
  submitAnswer,
  submitVoiceAnswer,
  generateFeedback
} from './ai.controller.js';
import {
  analyzeResumeSchema,
  startInterviewSchema,
  submitAnswerSchema,
  submitVoiceAnswerSchema,
  generateFeedbackSchema
} from './ai.validation.js';

const aiRouter = express.Router();

// Configure multer for audio uploads
const audioUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB (Whisper limit)
  fileFilter: (req, file, cb) => {
    const allowed = ['.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.wav', '.webm'];
    if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error('Unsupported audio format'));
    }
    cb(null, true);
  }
});

aiRouter.use(authenticateJWT);

/**
 * @route POST /api/ai/analyze-resume
 * @desc Analyze a specific resume
 * @access Private
 */
aiRouter.post('/analyze-resume', validateRequest(analyzeResumeSchema), catchAsync(analyzeResume));

/**
 * @route POST /api/ai/start-interview
 * @desc Start a new AI interview session
 * @access Private
 */
aiRouter.post('/start-interview', validateRequest(startInterviewSchema), catchAsync(startInterview));

/**
 * @route GET /api/ai/interviews/:interviewId/questions
 * @desc Generate next interview question
 * @access Private
 */
aiRouter.get('/interviews/:interviewId/questions', catchAsync(generateQuestion));

/**
 * @route POST /api/ai/interviews/:interviewId/answers
 * @desc Submit an answer and get real-time evaluation
 * @access Private
 */
aiRouter.post('/interviews/:interviewId/answers', validateRequest(submitAnswerSchema), catchAsync(submitAnswer));

/**
 * @route POST /api/ai/interviews/:interviewId/voice-answer
 * @desc Submit a voice answer, transcribe it, and get evaluation
 * @access Private
 */
aiRouter.post('/interviews/:interviewId/voice-answer', audioUpload.single('audio'), validateRequest(submitVoiceAnswerSchema), catchAsync(submitVoiceAnswer));

/**
 * @route GET /api/ai/interviews/:interviewId/feedback
 * @desc Complete interview and generate final feedback
 * @access Private
 */
aiRouter.get('/interviews/:interviewId/feedback', validateRequest(generateFeedbackSchema), catchAsync(generateFeedback));

export default aiRouter;

import express from 'express';
import * as feedbackController from './feedback.controller.js';
import { authenticateJWT } from '../../shared/middleware/authMiddleware.js';
import { validateRequest } from '../../shared/middleware/validation.middleware.js';
import { getFeedbackSchema, getInterviewFeedbackSchema } from './feedback.validation.js';

const router = express.Router();

// All feedback routes are private
router.use(authenticateJWT);

/**
 * @route GET /api/feedback
 * @desc Get all feedbacks for the authenticated user
 * @access Private
 */
router.get('/', feedbackController.getUserFeedbacks);

/**
 * @route GET /api/feedback/interview/:interviewId
 * @desc Get feedback for a specific interview
 * @access Private
 */
router.get('/interview/:interviewId', validateRequest(getInterviewFeedbackSchema), feedbackController.getInterviewFeedback);

/**
 * @route GET /api/feedback/:id
 * @desc Get feedback by ID
 * @access Private
 */
router.get('/:id', validateRequest(getFeedbackSchema), feedbackController.getFeedback);

/**
 * @route DELETE /api/feedback/:id
 * @desc Delete feedback
 * @access Private
 */
router.delete('/:id', validateRequest(getFeedbackSchema), feedbackController.deleteFeedback);

export default router;

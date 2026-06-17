import * as feedbackService from './feedback.service.js';
import { catchAsync } from '../../shared/errors/catchAsync.js';

/**
 * Get feedback for a specific interview.
 * @route GET /api/feedback/interview/:interviewId
 * @access Private
 */
export const getInterviewFeedback = catchAsync(async (req, res) => {
  const { interviewId } = req.params;
  const userId = req.user.id;
  const feedback = await feedbackService.getFeedbackByInterview(userId, interviewId);
  
  res.status(200).json({
    success: true,
    message: 'Interview feedback retrieved successfully',
    data: feedback
  });
});

/**
 * Get all feedbacks for the authenticated user.
 * @route GET /api/feedback
 * @access Private
 */
export const getUserFeedbacks = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const feedbacks = await feedbackService.getUserFeedbacks(userId);
  
  res.status(200).json({
    success: true,
    message: 'User feedbacks retrieved successfully',
    count: feedbacks.length,
    data: feedbacks
  });
});

/**
 * Get feedback by ID.
 * @route GET /api/feedback/:id
 * @access Private
 */
export const getFeedback = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const feedback = await feedbackService.getFeedbackById(userId, id);
  
  res.status(200).json({
    success: true,
    message: 'Feedback details retrieved successfully',
    data: feedback
  });
});

/**
 * Delete feedback.
 * @route DELETE /api/feedback/:id
 * @access Private
 */
export const deleteFeedback = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  await feedbackService.deleteFeedback(userId, id);
  
  res.status(200).json({
    success: true,
    message: 'Feedback deleted successfully'
  });
});

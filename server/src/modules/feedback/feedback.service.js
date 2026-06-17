import Feedback from './feedback.model.js';
import UserProfile from '../user/user.model.js';
import NotFoundError from '../../shared/errors/NotFoundError.js';

const getProfileByAuthId = async (authUserId) => {
  const profile = await UserProfile.findOne({ authId: authUserId });
  if (!profile) {
    throw new NotFoundError('User profile not found');
  }
  return profile;
};

/**
 * Get feedback for a specific interview.
 * @param {String} authUserId - The authenticated user's ID.
 * @param {String} interviewId - The ID of the interview.
 * @returns {Object} - The feedback object.
 */
export const getFeedbackByInterview = async (authUserId, interviewId) => {
  const profile = await getProfileByAuthId(authUserId);
  const feedback = await Feedback.findOne({ interviewId, userId: profile._id }).lean();
  
  if (!feedback) {
    throw new NotFoundError('Feedback not found for this interview');
  }
  
  return feedback;
};

/**
 * Get all feedbacks for the authenticated user.
 * @param {String} authUserId - The authenticated user's ID.
 * @returns {Array} - List of feedback objects.
 */
export const getUserFeedbacks = async (authUserId) => {
  const profile = await getProfileByAuthId(authUserId);
  return Feedback.find({ userId: profile._id })
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Get feedback by ID.
 * @param {String} authUserId - The authenticated user's ID.
 * @param {String} feedbackId - The ID of the feedback.
 * @returns {Object} - The feedback object.
 */
export const getFeedbackById = async (authUserId, feedbackId) => {
  const profile = await getProfileByAuthId(authUserId);
  const feedback = await Feedback.findOne({ _id: feedbackId, userId: profile._id }).lean();
  
  if (!feedback) {
    throw new NotFoundError('Feedback not found');
  }
  
  return feedback;
};

/**
 * Delete feedback.
 * @param {String} authUserId - The authenticated user's ID.
 * @param {String} feedbackId - The ID of the feedback.
 */
export const deleteFeedback = async (authUserId, feedbackId) => {
  const profile = await getProfileByAuthId(authUserId);
  const feedback = await Feedback.findOneAndDelete({ _id: feedbackId, userId: profile._id });
  
  if (!feedback) {
    throw new NotFoundError('Feedback not found');
  }
  
  return feedback;
};

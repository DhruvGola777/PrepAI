import {
  findUserById,
  createUserProfile,
  updateUser,
  addResumeEntry,
  getUserWithStats,
  getUserInterviewsData,
  getInterviewData,
  getUserScoreSummary,
  getUserFeedbackData,
  getUserRecommendations as getUserRecommendationsService,
  deleteUserAccount,
  uploadBufferToCloudinary
} from './user.service.js';
import NotFoundError from '../../shared/errors/NotFoundError.js';
import ForbiddenError from '../../shared/errors/ForbiddenError.js';
import BadRequestError from '../../shared/errors/BadRequestError.js';

/**
 * Get current authenticated user's profile
 * @GET /users/me
 * @access Private
 */
export const getCurrentUser = async (req, res) => {
  const userId = req.user.id;
  
  const user = await findUserById(userId);
  
  if (!user) {
    // fallback: create a profile for this auth user if we have basic info
    if (req.user && req.user.email) {
      await createUserProfile({ authId: req.user.id, email: req.user.email, name: req.user.name, picture: req.user.picture });
      const created = await findUserById(userId);
      if (created) {
        return res.status(200).json({ success: true, message: 'User profile retrieved successfully', data: created });
      }
    }

    throw new NotFoundError('User not found');
  }

  if (user && !user.picture && req.user.picture) {
    user.picture = req.user.picture;
    await updateUser(user._id, { picture: req.user.picture });
  }

  res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: user
  });
};

/**
 * Update current user's profile
 * @PUT /users/me
 * @access Private
 * @body {name, bio, location, experienceYears, skills, education, picture}
 */
export const updateCurrentUser = async (req, res) => {
  const userId = req.user.id;
  const updateData = req.body;

  const updatedUser = await updateUser(userId, updateData);

  if (!updatedUser) {
    throw new NotFoundError('User not found');
  }

  res.status(200).json({
    success: true,
    message: 'User profile updated successfully',
    data: updatedUser
  });
};

/**
 * Upload or update user's resume
 * @POST /users/me/resume
 * @access Private
 * @body {file} - Resume file (multipart/form-data)
 */
export const uploadResume = async (req, res) => {

  const userId = req.user.id;
  
  if (!req.file) {
    throw new BadRequestError('No file uploaded');
  }
  // upload file buffer to S3 and persist resume metadata
  const resumeEntry = await addResumeEntry(userId, req.file);

  if (!resumeEntry) {
    throw new NotFoundError('User profile not found');
  }

  res.status(201).json({
    success: true,
    message: 'Resume uploaded successfully',
    data: resumeEntry
  });
};

/**
 * Upload user's avatar/profile picture
 * @POST /users/me/avatar
 * @access Private
 * @body {file} - Image file (multipart/form-data)
 */
export const uploadAvatar = async (req, res) => {
  const userId = req.user.id;
  
  if (!req.file) {
    throw new BadRequestError('No file uploaded');
  }

  // upload file buffer to Cloudinary
  const folder = `avatars/${userId}`;
  const publicId = `${Date.now()}-avatar`;

  const result = await uploadBufferToCloudinary(req.file.buffer, {
    folder,
    public_id: publicId,
    resource_type: 'image',
    overwrite: true
  });

  if (!result || !result.secure_url) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  // Update user profile with new picture URL
  const updatedUser = await updateUser(userId, { picture: result.secure_url });

  if (!updatedUser) {
    throw new NotFoundError('User profile not found');
  }

  res.status(200).json({
    success: true,
    message: 'Avatar uploaded successfully',
    data: { picture: result.secure_url }
  });
};

/**
 * Get all interviews for current user
 * @GET /users/me/interviews
 * @access Private
 */
export const getUserInterviews = async (req, res) => {
  const userId = req.user.id;

  const interviews = await getUserInterviewsData(userId);

  res.status(200).json({
    success: true,
    message: 'User interviews retrieved successfully',
    count: interviews.length,
    data: interviews
  });
};

/**
 * Get specific interview details
 * @GET /users/me/interviews/:id
 * @access Private
 */
export const getInterviewById = async (req, res) => {
  const userId = req.user.id;
  const { id: interviewId } = req.params;

  const interview = await getInterviewData(userId, interviewId);

  if (!interview) {
    throw new NotFoundError('Interview not found');
  }

  res.status(200).json({
    success: true,
    message: 'Interview details retrieved successfully',
    data: interview
  });
};

/**
 * Get user's score summary and statistics
 * @GET /users/me/score-summary
 * @access Private
 */
export const getScoreSummary = async (req, res) => {
  const userId = req.user.id;

  const scoreSummary = await getUserScoreSummary(userId);

  if (!scoreSummary) {
    throw new NotFoundError('User not found');
  }

  res.status(200).json({
    success: true,
    message: 'Score summary retrieved successfully',
    data: scoreSummary
  });
};

/**
 * Get all feedback for user's interviews
 * @GET /users/me/feedback
 * @access Private
 */
export const getUserFeedback = async (req, res) => {
  const userId = req.user.id;

  const feedback = await getUserFeedbackData(userId);

  res.status(200).json({
    success: true,
    message: 'User feedback retrieved successfully',
    count: feedback.length,
    data: feedback
  });
};

/**
 * Get personalized recommendations based on performance
 * @GET /users/me/recommendations
 * @access Private
 */
export const getRecommendations = async (req, res) => {
  const userId = req.user.id;

  const recommendations = await getUserRecommendationsService(userId);

  res.status(200).json({
    success: true,
    message: 'Personalized recommendations retrieved successfully',
    data: recommendations
  });
};

/**
 * Delete complete user account footprint
 * @DELETE /users/me
 * @access Private
 */
export const deleteAccount = async (req, res) => {
  const userId = req.user.id;

  const success = await deleteUserAccount(userId);

  if (!success) {
    throw new NotFoundError('User not found or already deleted');
  }

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
};

import UserProfile from './user.model.js';
import Interview from '../interview/interview.model.js';
import Feedback from '../feedback/feedback.model.js';
import User from '../auth/auth.model.js';
import AIAnalysis from '../ai/ai.model.js';
import path from 'path';
import cloudinary from '../../shared/utils/cloudinary.js';
import streamifier from 'streamifier';
import { env } from '../../config/env.js';

export const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * Find user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile
 */
export const findUserById = async (userId) => {
  // Try to find by profile _id first, then fallback to authId (supports using auth user id)
  let user = await UserProfile.findById(userId)
    .select('-__v')
    .populate('authId', 'email createdAt')
    .lean();

  if (!user) {
    user = await UserProfile.findOne({ authId: userId })
      .select('-__v')
      .populate('authId', 'email createdAt')
      .lean();
  }

  return user;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user profile
 */
export const updateUser = async (userId, updateData) => {
  // Filter allowed fields to prevent unauthorized updates
  const allowedFields = ['name', 'bio', 'location', 'experienceYears', 'skills', 'education', 'picture', 'settings'];
  const filteredData = {};

  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredData[key] = updateData[key];
    }
  });

  return await UserProfile.findOneAndUpdate(
    { $or: [{ _id: userId }, { authId: userId }] },
    filteredData,
    { new: true, runValidators: true }
  )
    .select('-__v')
    .populate('authId', 'email createdAt')
    .lean();
};

/**
 * Get user with statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile with statistics
 */
export const getUserWithStats = async (userId) => {
  let user = await UserProfile.findById(userId)
    .select('-__v')
    .populate('authId', 'email createdAt')
    .lean();

  if (!user) {
    user = await UserProfile.findOne({ authId: userId })
      .select('-__v')
      .populate('authId', 'email createdAt')
      .lean();
  }

  if (!user) return null;

  // Fetch actual interview count and score from Interview model
  const interviews = await Interview.find({ userId: user._id }).select('score').lean();
  const scores = interviews.map(i => i.score).filter(s => s !== undefined && s !== null);

  return {
    ...user,
    stats: {
      totalResumes: user.resumes ? user.resumes.length : 0,
      totalInterviews: interviews.length,
      completedInterviews: interviews.filter(i => i.score !== undefined && i.score !== null).length,
      averageScore: scores.length > 0
        ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(2)
        : null
    }
  };
};

/**
 * Get user's interviews
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of interviews
 */
export const getUserInterviewsData = async (userId) => {
  const profile = await UserProfile.findById(userId) || await UserProfile.findOne({ authId: userId });
  if (!profile) return [];

  const interviews = await Interview.find({ userId: profile._id })
    .select('-__v')
    .sort({ createdAt: -1 })
    .lean();

  return interviews || [];
};

/**
 * Get specific interview data
 * @param {string} userId - User ID
 * @param {string} interviewId - Interview ID
 * @returns {Promise<Object>} Interview details
 */
export const getInterviewData = async (userId, interviewId) => {
  const profile = await UserProfile.findById(userId) || await UserProfile.findOne({ authId: userId });
  if (!profile) return null;

  const interview = await Interview.findOne({ _id: interviewId, userId: profile._id })
    .select('-__v')
    .populate('feedbackRef')
    .lean();

  return interview || null;
};

/**
 * Get user's score summary
 * @param {string} userId - User ID (auth user id or profile id)
 * @returns {Promise<Object>} Score summary statistics
 */
export const getUserScoreSummary = async (userId) => {
  const profile = await UserProfile.findById(userId) || await UserProfile.findOne({ authId: userId });
  if (!profile) return null;

  const interviews = await Interview.find({ userId: profile._id })
    .select('score createdAt')
    .lean();

  if (!interviews || interviews.length === 0) {
    return {
      totalInterviews: 0,
      completedInterviews: 0,
      averageScore: null,
      highestScore: null,
      lowestScore: null,
      currentStreak: 0
    };
  }

  const scores = interviews.map(i => i.score).filter(s => s !== undefined && s !== null);

  // Calculate streak based on createdAt dates
  const dates = interviews.map(i => i.createdAt).filter(d => d);
  let currentStreak = 0;

  if (dates.length > 0) {
    const uniqueDays = [...new Set(dates.map(d => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    }))].sort((a, b) => b - a);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    const ONE_DAY = 24 * 60 * 60 * 1000;

    let currentDateToCheck = todayTime;

    // Check if the most recent activity is today or yesterday
    if (uniqueDays[0] === todayTime || uniqueDays[0] === (todayTime - ONE_DAY)) {
      if (uniqueDays[0] === (todayTime - ONE_DAY)) {
        currentDateToCheck = todayTime - ONE_DAY;
      }

      for (const day of uniqueDays) {
        if (day === currentDateToCheck) {
          currentStreak++;
          currentDateToCheck -= ONE_DAY;
        } else {
          break;
        }
      }
    }
  }

  const now = new Date();
  const completedThisMonth = interviews.filter(i => {
    if (!i.createdAt || i.score === undefined || i.score === null) return false;
    const date = new Date(i.createdAt);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  return {
    totalInterviews: interviews.length,
    completedInterviews: scores.length,
    averageScore: scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
      : null,
    highestScore: scores.length > 0 ? Math.max(...scores) : null,
    lowestScore: scores.length > 0 ? Math.min(...scores) : null,
    currentStreak,
    completedThisMonth
  };
};

/**
 * Get user's feedback from interviews
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of feedback
 */
export const getUserFeedbackData = async (userId) => {
  const profile = await UserProfile.findById(userId) || await UserProfile.findOne({ authId: userId });
  if (!profile) return [];

  const feedbacks = await Feedback.find({ userId: profile._id })
    .select('-__v')
    .populate('interviewId', 'title type status')
    .sort({ createdAt: -1 })
    .lean();

  return feedbacks || [];
};

/**
 * Get personalized recommendations for user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Recommendations based on performance
 */
export const getUserRecommendations = async (userId) => {
  const profile = await UserProfile.findById(userId) || await UserProfile.findOne({ authId: userId });
  if (!profile) return [];

  // Sort by newest first and limit to the 5 most recent interviews
  // This prevents the data from growing indefinitely over time
  const feedbacks = await Feedback.find({ userId: profile._id })
    .select('recommendations')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const allRecommendations = [];
  const seenTitles = new Set();

  feedbacks.forEach(feedback => {
    if (feedback.recommendations && Array.isArray(feedback.recommendations)) {
      feedback.recommendations.forEach(rec => {
        if (rec.title && !seenTitles.has(rec.title)) {
          seenTitles.add(rec.title);
          allRecommendations.push(rec);
        }
      });
    }
  });

  // Cap at 10 recommendations so the UI doesn't get cluttered
  return allRecommendations.slice(0, 10);
};

/**
 * Add resume entry to user's profile
 * @param {string} userId
 * @param {Object} fileMeta
 * @returns {Promise<Object>} Newly added resume entry
 */
export const addResumeEntry = async (userId, fileMeta) => {
  const user = await UserProfile.findById(userId) || await UserProfile.findOne({ authId: userId });

  if (!user) return null;
  // If the fileMeta contains a buffer (multer.memoryStorage), upload to S3
  let storagePath = null;
  let filename = fileMeta.originalname || fileMeta.originalName || fileMeta.filename;
  let mimeType = fileMeta.mimetype || fileMeta.mimeType;

  if (fileMeta.buffer) {
    // upload to Cloudinary
    const folder = `resumes/${userId}`;
    const publicId = `${Date.now()}-${path.basename(filename, path.extname(filename))}`;

    const result = await uploadBufferToCloudinary(fileMeta.buffer, {
      folder,
      public_id: publicId,
      resource_type: 'auto',
      overwrite: false
    });

    storagePath = result.secure_url;
    filename = result.public_id + path.extname(result.original_filename || filename) || filename;
  } else {
    storagePath = fileMeta.storagePath || fileMeta.path || null;
  }

  const entry = {
    filename,
    originalName: fileMeta.originalname || fileMeta.originalName,
    mimeType,
    size: fileMeta.size,
    storagePath,
    uploadedAt: fileMeta.uploadedAt || new Date()
  };


  user.resumes = user.resumes || [];
  user.resumes.push(entry);
  user.currentResumeId = user.resumes[user.resumes.length - 1]._id;
  await user.save();

  return user.resumes[user.resumes.length - 1];
};

/**
 * Find user profile by email
 * @param {string} email
 * @returns {Promise<Object|null>} user profile
 */
export const findUserByEmail = async (email) => {
  return await UserProfile.findOne({ email }).select('-__v').lean();
};

/**
 * Create a new user profile
 * @param {Object} userData
 * @returns {Promise<Object>} created user profile
 */
export const createUserProfile = async (userData) => {
  const profile = new UserProfile(userData);
  return await profile.save();
};

/**
 * Get total user profile count
 */
export const getUserCount = async () => {
  return await UserProfile.countDocuments();
};

/**
 * Delete complete user account footprint
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} success
 */
export const deleteUserAccount = async (userId) => {
  const profile = await UserProfile.findById(userId) || await UserProfile.findOne({ authId: userId });
  if (!profile) return false;

  const actualUserId = profile.authId; // The ID in User model
  const profileId = profile._id;

  // Delete Feedbacks
  await Feedback.deleteMany({ userId: profileId });

  // Delete Interviews
  await Interview.deleteMany({ userId: profileId });

  // Note: AIAnalysis might need deletion if linked directly to user, but typically it's linked to Interview
  if (AIAnalysis) {
    // If AIAnalysis has userId field (assuming it does based on standard architecture)
    await AIAnalysis.deleteMany({ userId: profileId }).catch(() => { });
  }

  // Delete User Profile
  await UserProfile.findByIdAndDelete(profileId);

  // Delete Auth User
  await User.findByIdAndDelete(actualUserId);

  return true;
};
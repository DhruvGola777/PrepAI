import UserProfile from './user.model.js';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadBufferToCloudinary = (buffer, options = {}) => {
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
  const allowedFields = ['name', 'bio', 'location', 'experienceYears', 'skills', 'education', 'picture'];
  const filteredData = {};

  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredData[key] = updateData[key];
    }
  });

  return await UserProfile.findByIdAndUpdate(
    userId,
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
  const user = await UserProfile.findById(userId)
    .select('-__v')
    .populate('authId', 'email createdAt')
    .lean();

  if (!user) return null;

  // Add statistics metadata (placeholder for future interview/score aggregation)
  return {
    ...user,
    stats: {
      totalResumes: user.resumes ? user.resumes.length : 0,
      totalInterviews: user.interviews ? user.interviews.length : 0,
      averageScore: user.scores && user.scores.length 
        ? (user.scores.reduce((sum, score) => sum + (score.overall || 0), 0) / user.scores.length).toFixed(2)
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
  // TODO: Implement interview retrieval logic
  // Should fetch interviews from Interview model/collection
  // Return array of interviews for the user
  return [];
};

/**
 * Get specific interview data
 * @param {string} userId - User ID
 * @param {string} interviewId - Interview ID
 * @returns {Promise<Object>} Interview details
 */
export const getInterviewData = async (userId, interviewId) => {
  // TODO: Implement interview retrieval logic
  // Should fetch single interview and verify ownership
  // Return interview with all details (questions, answers, scores, feedback)
  return null;
};

/**
 * Get user's score summary
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Score summary statistics
 */
export const getUserScoreSummary = async (userId) => {
  const user = await UserProfile.findById(userId)
    .select('scores')
    .lean();

  if (!user) return null;

  const scores = user.scores || [];
  
  if (scores.length === 0) {
    return {
      totalInterviews: 0,
      averageScore: null,
      highestScore: null,
      lowestScore: null,
      breakdown: {}
    };
  }

  const overallScores = scores.map(s => s.overall).filter(s => s !== undefined);
  
  return {
    totalInterviews: scores.length,
    averageScore: overallScores.length > 0 
      ? (overallScores.reduce((a, b) => a + b, 0) / overallScores.length).toFixed(2)
      : null,
    highestScore: overallScores.length > 0 ? Math.max(...overallScores) : null,
    lowestScore: overallScores.length > 0 ? Math.min(...overallScores) : null,
    scoresBySource: {
      feedback: scores.filter(s => s.source === 'feedback').length,
      ai: scores.filter(s => s.source === 'ai').length,
      manual: scores.filter(s => s.source === 'manual').length
    }
  };
};

/**
 * Get user's feedback from interviews
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of feedback
 */
export const getUserFeedbackData = async (userId) => {
  // TODO: Implement feedback retrieval logic
  // Should fetch all feedback associated with user's interviews
  // Can be from AI analysis, interviewer notes, or system assessments
  return [];
};

/**
 * Get personalized recommendations for user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Recommendations based on performance
 */
export const getUserRecommendations = async (userId) => {
  // TODO: Implement recommendation logic
  // Should analyze user's scores, feedback, and interview history
  // Generate actionable recommendations for improvement
  // Can include: skills to improve, topics to study, practice areas, etc.
  return {
    skillsToImprove: [],
    topicsToStudy: [],
    practiceAreas: [],
    strengths: [],
    areasForImprovement: []
  };
};

/**
 * Add resume entry to user's profile
 * @param {string} userId
 * @param {Object} fileMeta
 * @returns {Promise<Object>} Newly added resume entry
 */
export const addResumeEntry = async (userId, fileMeta) => {
  const user = await UserProfile.findById(userId);
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
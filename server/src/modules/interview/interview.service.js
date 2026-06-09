import Interview from './interview.model.js';
import UserProfile from '../user/user.model.js';
import NotFoundError from '../../shared/errors/NotFoundError.js';

const getProfileByAuthId = async (authUserId) => {
  const profile = await UserProfile.findOne({ authId: authUserId });
  if (!profile) {
    throw new NotFoundError('User profile not found');
  }
  return profile;
};

export const createInterview = async (authUserId, interviewPayload) => {
  const profile = await getProfileByAuthId(authUserId);
  const interview = new Interview({ ...interviewPayload, userId: profile._id });
  await interview.save();

  profile.interviews.push(interview._id);
  await profile.save();

  return interview;
};

export const getUserInterviews = async (authUserId) => {
  const profile = await getProfileByAuthId(authUserId);
  return Interview.find({ userId: profile._id })
    .sort({ scheduledAt: -1, createdAt: -1 })
    .lean();
};

export const getInterviewById = async (authUserId, interviewId) => {
  const profile = await getProfileByAuthId(authUserId);
  return Interview.findOne({ _id: interviewId, userId: profile._id }).lean();
};

export const updateInterview = async (authUserId, interviewId, updateData) => {
  const profile = await getProfileByAuthId(authUserId);
  const interview = await Interview.findOneAndUpdate(
    { _id: interviewId, userId: profile._id },
    updateData,
    { new: true, runValidators: true }
  ).lean();

  if (!interview) {
    throw new NotFoundError('Interview not found');
  }

  return interview;
};

export const deleteInterview = async (authUserId, interviewId) => {
  const profile = await getProfileByAuthId(authUserId);
  const interview = await Interview.findOneAndDelete({ _id: interviewId, userId: profile._id });

  if (!interview) {
    throw new NotFoundError('Interview not found');
  }

  profile.interviews.pull(interview._id);
  await profile.save();

  return interview;
};

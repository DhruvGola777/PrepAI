import {
  createInterview,
  getUserInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview
} from './interview.service.js';
import NotFoundError from '../../shared/errors/NotFoundError.js';

export const createInterviewEntry = async (req, res) => {
  const interview = await createInterview(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: 'Interview created successfully',
    data: interview
  });
};

export const getInterviews = async (req, res) => {
  const interviews = await getUserInterviews(req.user.id);

  res.status(200).json({
    success: true,
    message: 'User interviews retrieved successfully',
    count: interviews.length,
    data: interviews
  });
};

export const getInterview = async (req, res) => {
  const interview = await getInterviewById(req.user.id, req.params.id);

  if (!interview) {
    throw new NotFoundError('Interview not found');
  }

  res.status(200).json({
    success: true,
    message: 'Interview details retrieved successfully',
    data: interview
  });
};

export const updateInterviewEntry = async (req, res) => {
  const interview = await updateInterview(req.user.id, req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Interview updated successfully',
    data: interview
  });
};

export const deleteInterviewEntry = async (req, res) => {
  await deleteInterview(req.user.id, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Interview deleted successfully'
  });
};

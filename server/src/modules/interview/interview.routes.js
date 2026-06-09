import express from 'express';
import { authenticateJWT } from '../../shared/middleware/authMiddleware.js';
import { validateRequest } from '../../shared/middleware/validation.middleware.js';
import { catchAsync } from '../../shared/errors/catchAsync.js';
import {
  createInterviewEntry,
  getInterviews,
  getInterview,
  updateInterviewEntry,
  deleteInterviewEntry
} from './interview.controller.js';
import { createInterviewSchema, updateInterviewSchema } from './interview.validation.js';

const interviewRouter = express.Router();

interviewRouter.use(authenticateJWT);

/**
 * @route POST /api/interviews
 * @desc Create a new interview entry
 * @access Private - Requires JWT authentication
 * @body {candidateName, candidateEmail, position, scheduledAt, durationMinutes, interviewer{type, provider, model, version, prompt, sessionId, runId, meta}, questions[], outcome}
 */
interviewRouter.post('/', validateRequest(createInterviewSchema), catchAsync(createInterviewEntry));
/**
 * @route GET /api/interviews
 * @desc Get all interviews for the authenticated user
 * @access Private - Requires JWT authentication
 */
interviewRouter.get('/', catchAsync(getInterviews));
/**
 * @route GET /api/interviews/:id
 * @desc Get details of a specific interview by ID
 * @access Private - Requires JWT authentication
 */
interviewRouter.get('/:id', catchAsync(getInterview));
/**
 * @route PUT /api/interviews/:id
 * @desc Update an existing interview entry
 * @access Private - Requires JWT authentication
 * @body {candidateName, candidateEmail, position, scheduledAt, durationMinutes, interviewer{type, provider, model, version, prompt, sessionId, runId, meta}, questions[], outcome}
 */
interviewRouter.put('/:id', validateRequest(updateInterviewSchema), catchAsync(updateInterviewEntry));
/**
 * @route DELETE /api/interviews/:id
 * @desc Delete an existing interview entry
 * @access Private - Requires JWT authentication
 */
interviewRouter.delete('/:id', catchAsync(deleteInterviewEntry));

export default interviewRouter;

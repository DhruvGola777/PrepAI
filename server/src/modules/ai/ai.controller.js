import * as aiService from './ai.service.js';
import BadRequestError from '../../shared/errors/BadRequestError.js';
import NotFoundError from '../../shared/errors/NotFoundError.js';

/**
 * Analyze a user's resume using AI and store the analysis result.
 * @route POST /api/ai/analyze-resume
 * @access Private
 */
export const analyzeResume = async (req, res) => {
  const { resumeId } = req.body;
  const userId = req.user.id;
  const analysis = await aiService.analyzeResumeService(userId, resumeId);
  res.status(200).json({ success: true, data: analysis });
};

/**
 * Start a new interview session.
 * @route POST /api/ai/start-interview
 * @access Private
 */
export const startInterview = async (req, res) => {
  const userId = req.user.id;
  const interview = await aiService.startInterviewService(userId, req.body);
  res.status(201).json({ success: true, data: interview });
};

/**
 * Generate a new interview question based on the user's profile and interview type.
 * @route GET /api/ai/interviews/:interviewId/questions
 * @access Private
 */
export const generateQuestion = async (req, res) => {
  const { interviewId } = req.params;
  const question = await aiService.generateQuestionService(interviewId);
  res.status(200).json({ success: true, data: question });
};

/**
 * Submit an answer to an interview question and evaluate it.
 * @route POST /api/ai/interviews/:interviewId/answers
 * @access Private
 */
export const submitAnswer = async (req, res) => {
  const { interviewId } = req.params;
  const { question, answer } = req.body;
  const evaluation = await aiService.evaluateAnswerService(interviewId, question, answer);
  res.status(200).json({ success: true, data: evaluation });
};

/**
 * Submit a voice answer, transcribe it, and evaluate it.
 * @route POST /api/ai/interviews/:interviewId/voice-answer
 * @access Private
 */
export const submitVoiceAnswer = async (req, res) => {
  const { interviewId } = req.params;
  const { question } = req.body;

  if (!req.file) {
    throw new BadRequestError('No audio file provided');
  }

  // 1. Transcribe
  const transcribedText = await aiService.transcribeAudioService(req.file.buffer, req.file.originalname);

  // 2. Evaluate using existing logic
  const evaluation = await aiService.evaluateAnswerService(interviewId, question, transcribedText);

  res.status(200).json({ 
    success: true, 
    data: {
      transcription: transcribedText,
      evaluation
    } 
  });
};

/**
 * Generate final feedback for an interview session.
 * @route GET /api/ai/interviews/:interviewId/feedback
 * @access Private
 */
export const generateFeedback = async (req, res) => {
  const { interviewId } = req.params;
  const feedback = await aiService.generateFinalFeedbackService(interviewId);
  res.status(200).json({ success: true, data: feedback });
};

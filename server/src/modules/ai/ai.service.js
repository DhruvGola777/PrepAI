import { env } from '../../config/env.js';
import AIAnalysis from './ai.model.js';
import Feedback from '../feedback/feedback.model.js';
import Interview from '../interview/interview.model.js';
import UserProfile from '../user/user.model.js';
import NotFoundError from '../../shared/errors/NotFoundError.js';
import BadRequestError from '../../shared/errors/BadRequestError.js';
import { extractTextFromResume } from '../../shared/utils/resumeParser.js';
import OpenAI from 'openai';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Initialize Groq (OpenAI-compatible)
const groq = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

/**
 * Core function to call Groq with structured output requirements.
 */
async function callAIProvider(prompt, systemPrompt = 'You are a professional technical recruiter and career coach.') {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `IMPORTANT: Return ONLY a valid JSON object. Do not include markdown formatting or backticks. \n\n ${prompt}` }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Groq AI Provider Error:', error);
    throw new Error(`AI service is currently unavailable: ${error.message}`);
  }
}

/**
 * Analyze a user's resume using AI and store the analysis result.
 */
export const analyzeResumeService = async (userId, resumeId) => {
  const profile = await UserProfile.findOne({ authId: userId });
  if (!profile) throw new NotFoundError('User profile not found');

  const resume = profile.resumes.id(resumeId);
  if (!resume) throw new NotFoundError('Resume not found');

  // 1. Extract text from resume
  const resumeText = await extractTextFromResume(resume.storagePath, resume.mimeType);

  // 2. Call AI to analyze resume
  const prompt = `
    Analyze the following resume text and extract key information in JSON format. 
    The JSON must contain these exact keys:
    - "skills" (array of strings)
    - "experience" (summary string)
    - "education" (summary string)
    - "summary" (professional summary string)
    - "suggestedRoles" (array of strings)

    Resume Text:
    ${resumeText}
  `;

  const analysisResult = await callAIProvider(prompt);

  // 3. Create AIAnalysis record
  const analysis = await AIAnalysis.create({
    type: 'resume',
    inputRef: resumeId,
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    result: analysisResult
  });

  // 4. Link analysis to resume
  resume.analysisRef = analysis._id;
  await profile.save();

  return analysis;
};

/**
 * Start a new interview session.
 */
export const startInterviewService = async (userId, interviewData) => {
  const profile = await UserProfile.findOne({ authId: userId });
  if (!profile) throw new NotFoundError('User profile not found');

  const interview = await Interview.create({
    userId: profile._id,
    title: interviewData.position ? `Interview for ${interviewData.position}` : 'General Mock Interview',
    type: interviewData.type || 'mixed',
    status: 'running',
    startedAt: new Date(),
    interviewer: {
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      prompt: `You are a senior technical interviewer interviewing for the position of ${interviewData.position || 'Software Engineer'}.`
    }
  });

  profile.interviews.push(interview._id);
  await profile.save();

  return interview;
};

/**
 * Generate a new interview question based on the user's profile and interview history.
 */
export const generateQuestionService = async (interviewId) => {
  const interview = await Interview.findById(interviewId).populate('userId');
  if (!interview) throw new NotFoundError('Interview not found');

  const profile = await UserProfile.findById(interview.userId);
  
  // 1. Get Resume Context
  let resumeContext = "";
  if (profile.currentResumeId) {
    const resume = profile.resumes.id(profile.currentResumeId);
    if (resume && resume.analysisRef) {
      const analysis = await AIAnalysis.findById(resume.analysisRef);
      resumeContext = `User Resume Context: ${JSON.stringify(analysis.result)}`;
    }
  }

  // 2. Get Conversation History from Transcript
  const history = interview.transcript.map(t => `Q: ${t.question}\nA: ${t.answer}`).join('\n\n');
  const historyContext = history ? `\n\nInterview History:\n${history}` : "";

  const prompt = `
    Generate a single ${interview.type} interview question for the role of ${interview.title}.
    ${resumeContext}
    ${historyContext}

    Instructions:
    - If history exists, you can ask a follow-up question based on the last answer or move to a new relevant topic.
    - Do NOT repeat questions already asked.
    - Return in JSON format: { "question": "..." }
  `;

  const result = await callAIProvider(prompt);
  return result;
};

/**
 * Evaluate a user's answer to an interview question.
 */
export const evaluateAnswerService = async (interviewId, question, answer) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) throw new NotFoundError('Interview not found');

  const prompt = `
    Evaluate the following interview answer.
    Question: ${question}
    Answer: ${answer}

    Return in JSON format:
    {
      "score": 0-100 (as number),
      "feedback": "constructive feedback string",
      "idealAnswer": "A full, detailed, and complete example of the perfect answer (written in the first person as if you are the candidate answering the question). Do NOT write a description of the answer.",
      "starEvaluation": { "situation": "...", "task": "...", "action": "...", "result": "..." }
    }
  `;

  const evaluation = await callAIProvider(prompt);

  // Save to Transcript
  interview.transcript.push({
    question,
    answer,
    score: evaluation.score,
    feedback: evaluation.feedback,
    idealAnswer: evaluation.idealAnswer,
    starEvaluation: evaluation.starEvaluation
  });
  await interview.save();

  return evaluation;
};

/**
 * Transcribe audio buffer to text using Groq's Whisper model.
 */
export const transcribeAudioService = async (buffer, originalname) => {
  const tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${originalname}`);
  
  try {
    // Write buffer to a temp file because openai SDK requires a stream/file object
    await fs.promises.writeFile(tempFilePath, buffer);
    
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-large-v3",
    });

    return transcription.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio. Please try again or use text input.');
  } finally {
    // Clean up temp file
    if (fs.existsSync(tempFilePath)) {
      await fs.promises.unlink(tempFilePath).catch(console.error);
    }
  }
};

/**
 * Generate final feedback for an interview session.
 */
export const generateFinalFeedbackService = async (interviewId) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) throw new NotFoundError('Interview not found');

  const prompt = `
    Based on the interview for ${interview.title}, generate overall feedback.
    Return in JSON format matching this structure:
    {
      "feedbackText": "...",
      "scoreSummary": { "overall": 0-100, "technical": 0-100, "communication": 0-100, "confidence": 0-100, "problemSolving": 0-100 },
      "learningLinks": [ { "title": "...", "url": "..." } ],
      "recommendations": [ { "title": "...", "url": "..." } ],
      "technicalAnalysis": { "missingPoints": [], "weaknesses": [], "strengths": [] }
    }
  `;

  const feedbackData = await callAIProvider(prompt);

  const safeScores = feedbackData?.scoreSummary || { overall: 75, technical: 75, communication: 75, confidence: 75, problemSolving: 75 };
  const safeTechAnalysis = feedbackData?.technicalAnalysis || { missingPoints: [], weaknesses: [], strengths: [] };

  const feedback = await Feedback.create({
    userId: interview.userId,
    interviewId: interview._id,
    feedbackText: feedbackData?.feedbackText || "Overall good performance.",
    scores: safeScores,
    scoreSummary: safeScores,
    behavioralEvaluation: {
      starMethod: {
        score: safeScores.communication || 75,
        feedback: "Derived from overall performance."
      }
    },
    technicalAnalysis: safeTechAnalysis,
    learningLinks: feedbackData?.learningLinks || [],
    recommendations: feedbackData?.recommendations || [],
    improvementSuggestions: safeTechAnalysis.weaknesses || []
  });

  const analysis = await AIAnalysis.create({
    type: 'interview',
    inputRef: interview._id,
    result: feedbackData,
    score: feedback.scores.overall || 75
  });

  // Update UserProfile
  await UserProfile.findByIdAndUpdate(interview.userId, {
    $push: { feedbacks: feedback._id }
  });

  interview.status = 'completed';
  interview.endedAt = new Date();
  interview.feedbackRef = feedback._id;
  interview.analysisRef = analysis._id;
  interview.score = feedback.scores.overall || 75;
  await interview.save();

  return { feedback, analysis };
};

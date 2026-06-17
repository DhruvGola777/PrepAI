import mongoose from 'mongoose';

const LearningLinkSchema = new mongoose.Schema({
  title: { type: String },
  url: { type: String }
}, { _id: false });

const RecommendationSchema = new mongoose.Schema({
  title: { type: String },
  url: { type: String }
}, { _id: false });

const FeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true },
  feedbackText: { type: String },
  
  // Detailed Scores
  scores: {
    overall: { type: Number, min: 0, max: 100 },
    communication: { type: Number, min: 0, max: 100 },
    technical: { type: Number, min: 0, max: 100 },
    confidence: { type: Number, min: 0, max: 100 },
    problemSolving: { type: Number, min: 0, max: 100 }
  },

  scoreSummary: { type: mongoose.Schema.Types.Mixed }, // Kept for backward compatibility

  // Behavioral Evaluation
  behavioralEvaluation: {
    starMethod: {
      score: { type: Number, min: 0, max: 100 },
      feedback: { type: String }
    }
  },

  // Technical Analysis
  technicalAnalysis: {
    idealAnswerComparison: { type: String },
    missingPoints: [{ type: String }],
    weaknesses: [{ type: String }],
    strengths: [{ type: String }]
  },

  learningLinks: [LearningLinkSchema],
  recommendations: [RecommendationSchema],
  
  improvementSuggestions: [{ type: String }],
  
  meta: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', FeedbackSchema);
export default Feedback;

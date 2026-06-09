import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  title: { type: String },
  type: { type: String, enum: ['technical', 'behavioral', 'mixed'], default: 'technical' },
  status: { type: String, enum: ['draft', 'running', 'completed', 'cancelled'], default: 'draft' },

  // execution timestamps
  startedAt: { type: Date },
  endedAt: { type: Date },

  // AI interviewer metadata
  interviewer: {
    provider: { type: String },
    model: { type: String },
    version: { type: String },
    prompt: { type: String },
    sessionId: { type: String }
  },

  // artifacts
  recordingUrl: { type: String },
  transcriptRef: { type: mongoose.Schema.Types.ObjectId, ref: 'AIAnalysis' },
  analysisRef: { type: mongoose.Schema.Types.ObjectId, ref: 'AIAnalysis' },
  feedbackRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
  score: { type: Number }

}, { timestamps: true });

const Interview = mongoose.model('Interview', InterviewSchema);
export default Interview;

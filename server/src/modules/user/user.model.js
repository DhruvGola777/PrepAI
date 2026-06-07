import mongoose from 'mongoose';

const ResumeEntrySchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String },
  mimeType: { type: String },
  size: { type: Number },
  storagePath: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  // reference to AI analysis document (handled by `ai` module)
  analysisRef: { type: mongoose.Schema.Types.ObjectId, ref: 'AIAnalysis' }
}, { timestamps: true });

const ScoreSchema = new mongoose.Schema({
  source: { type: String, enum: ['feedback', 'ai', 'manual'], default: 'feedback' },
  interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' },
  overall: { type: Number },
  breakdown: { type: mongoose.Schema.Types.Mixed },
  meta: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const UserProfileSchema = new mongoose.Schema({
  // link to auth user created in `auth` module
  authId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  // basic profile
  email: { type: String },
  name: { type: String },
  username: { type: String },
  picture: { type: String },
  bio: { type: String },
  location: { type: String },
  role: { type: String },
  experienceYears: { type: Number },
  skills: [{ type: String }],

  // education entries
  education: [{
    institution: { type: String },
    degree: { type: String },
    startYear: { type: Number },
    endYear: { type: Number }
  }],

  // resume history (minimal metadata) — full parsing/analysis stored in `ai` module
  resumes: [ResumeEntrySchema],
  currentResumeId: { type: mongoose.Schema.Types.ObjectId },

  // references to other modules
  interviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interview' }],
  feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
  aiAnalyses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AIAnalysis' }],

  // scored history (can be derived from feedbacks/interviews but convenient to store)
  scores: [ScoreSchema],

  // aggregated fields for quick dashboarding
  aggregated: {
    averageScore: { type: Number, default: 0 },
    lastInterviewAt: { type: Date }
  },

  // user preferences
  preferences: {
    interviewType: { type: String, enum: ['technical', 'behavioral', 'mixed'], default: 'mixed' },
    preferredLanguage: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true }
  },

  // bookmarks, saved questions, learning resources
  savedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AiQuestion' }],
  learningLinks: [{ title: String, url: String }]

}, { timestamps: true });

// Compute aggregates from `scores` array. Services can call this after writes.
UserProfileSchema.methods.updateAggregates = function () {
  if (!this.scores || this.scores.length === 0) {
    this.aggregated.averageScore = 0;
    this.aggregated.lastInterviewAt = undefined;
    return;
  }

  const valid = this.scores.filter(s => typeof s.overall === 'number');
  if (valid.length === 0) {
    this.aggregated.averageScore = 0;
    this.aggregated.lastInterviewAt = undefined;
    return;
  }

  const total = valid.reduce((sum, s) => sum + s.overall, 0);
  this.aggregated.averageScore = total / valid.length;
  const last = valid.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
  this.aggregated.lastInterviewAt = last.createdAt;
};

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
export default UserProfile;

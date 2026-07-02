import mongoose from 'mongoose';

// Minimal resume metadata stored on the profile. Full parsing/analysis stored in `ai` module.
const ResumeEntrySchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String },
  mimeType: { type: String },
  size: { type: Number },
  storagePath: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  analysisRef: { type: mongoose.Schema.Types.ObjectId, ref: 'AIAnalysis' }
}, { timestamps: true });

const UserProfileSchema = new mongoose.Schema({
  authId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  email: { type: String },
  name: { type: String },
  picture: { type: String },
  location: { type: String },
  bio: { type: String },
  experienceYears: { type: Number, default: 0 },
  skills: [{ type: String }],
  education: [{
    institution: String,
    degree: String,
    startYear: Number,
    endYear: Number
  }],

  // minimal resume history
  resumes: [ResumeEntrySchema],
  currentResumeId: { type: mongoose.Schema.Types.ObjectId },

  // references to interviews and feedback (lightweight)
  interviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interview' }],
  feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],

  // preferences
  settings: {
    emailNotifications: { type: Boolean, default: true },
    soundEnabled: { type: Boolean, default: true }
  }

}, { timestamps: true });

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
export default UserProfile;

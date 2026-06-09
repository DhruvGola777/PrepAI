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
  learningLinks: [LearningLinkSchema],
  recommendations: [RecommendationSchema],
  scoreSummary: { type: mongoose.Schema.Types.Mixed },
  meta: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', FeedbackSchema);
export default Feedback;

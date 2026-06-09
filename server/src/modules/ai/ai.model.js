import mongoose from 'mongoose';

const AIAnalysisSchema = new mongoose.Schema({
  type: { type: String, enum: ['resume', 'interview'], required: true },
  inputRef: { type: mongoose.Schema.Types.ObjectId, required: true },
  provider: { type: String },
  model: { type: String },
  result: { type: mongoose.Schema.Types.Mixed },
  score: { type: Number },
  meta: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

const AIAnalysis = mongoose.model('AIAnalysis', AIAnalysisSchema);
export default AIAnalysis;

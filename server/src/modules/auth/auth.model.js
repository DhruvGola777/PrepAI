import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  email: { type: String, required: true, unique: true },
  username: { type: String },
  name: { type: String },
  picture: { type: String },
  password: { type: String },
  provider: { type: String, enum: ['local', 'google'], required: true, default: 'local' },
  refreshToken: { type: String }
}, { timestamps: true });

userSchema.index(
  { googleId: 1 },
  { unique: true, partialFilterExpression: { googleId: { $type: 'string' } } }
);

const User = mongoose.model('User', userSchema);
export default User;

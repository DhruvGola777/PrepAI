import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './auth.model.js';
import { env } from '../../config/env.js';

const SALT_ROUNDS = 12;

export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function registerLocalUser({ email, password, name, username, picture }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(password);
  
  // Generate default avatar if not provided
  const defaultPicture = picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=random`;
  
  const user = new User({
    email,
    name,
    username,
    password: hashedPassword,
    provider: 'local',
    picture: defaultPicture
  });

  await user.save();
  return user;
}

export async function authenticateLocalUser(email, password) {
  const user = await User.findOne({ email, provider: 'local' });
  if (!user || !user.password) {
    return null;
  }

  const isValid = await comparePassword(password, user.password);
  return isValid ? user : null;
}

export function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

export async function saveRefreshToken(userId, refreshToken) {
  await User.findByIdAndUpdate(userId, { refreshToken });
}

export async function getUserByRefreshToken(token) {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) {
      return null;
    }
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function revokeRefreshToken(userId) {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

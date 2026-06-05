import passport from 'passport';
import { generateAccessToken, generateRefreshToken, saveRefreshToken, getUserByRefreshToken, revokeRefreshToken, registerLocalUser, authenticateLocalUser } from './auth.service.js';
import { sendWelcomeEmail } from '../../shared/utils/email.service.js';

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

function setAccessCookie(res, token) {
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
  });
}

function clearRefreshCookie(res) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
}

function clearAccessCookie(res) {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
}

export const register = async (req, res) => {
  let { email, password, name, username } = req.body;

  // Use username as default name if not provided
  if (!name) {
    name = username;
  }

  try {
    const user = await registerLocalUser({ email, password, name, username });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await saveRefreshToken(user._id, refreshToken);
    setRefreshCookie(res, refreshToken);
    setAccessCookie(res, accessToken);

    // Send the welcome email without blocking registration success.
    sendWelcomeEmail(user).catch((err) => {
      console.error('Welcome email failed:', err);
    });

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        picture: user.picture
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.message.includes('Email already exists')) {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

export const localLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await authenticateLocalUser(email, password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await saveRefreshToken(user._id, refreshToken);
  setRefreshCookie(res, refreshToken);
  setAccessCookie(res, accessToken);

  return res.json({
    message: 'Login successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      picture: user.picture
    },
    accessToken,
    refreshToken
  });
};

export const googleCallback = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await saveRefreshToken(user._id, refreshToken);
  setRefreshCookie(res, refreshToken);
  setAccessCookie(res, accessToken);

  return res.json({
    message: 'Login successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      picture: user.picture
    },
    accessToken,
    refreshToken
  });
};

export const refreshToken = async (req, res) => {
  const token = req.body.refreshToken || req.cookies.refreshToken;
  if (!token) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  const user = await getUserByRefreshToken(token);
  if (!user) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const accessToken = generateAccessToken(user);
  setAccessCookie(res, accessToken);
  return res.json({ accessToken });
};

export const logout = async (req, res) => {
  const token = req.body.refreshToken || req.cookies.refreshToken;
  if (!token) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  const user = await getUserByRefreshToken(token);
  if (!user) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  await revokeRefreshToken(user._id);
  clearRefreshCookie(res);
  clearAccessCookie(res);
  return res.json({ message: 'Logged out successfully' });
};

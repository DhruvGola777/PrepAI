import passport from 'passport';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, saveRefreshToken, getUserByRefreshToken, revokeRefreshToken, registerLocalUser, authenticateLocalUser } from './auth.service.js';
import { findUserByEmail, createUserProfile } from '../user/user.service.js';
import { sendWelcomeEmail } from '../../shared/utils/email.service.js';
import { sendPasswordResetEmail } from '../../shared/utils/email.js';
import User from './auth.model.js';
import ConflictError from '../../shared/errors/ConflictError.js';
import UnauthorizedError from '../../shared/errors/UnauthorizedError.js';
import BadRequestError from '../../shared/errors/BadRequestError.js';
import NotFoundError from '../../shared/errors/NotFoundError.js';

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
}

function clearRefreshCookie(res) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  });
}

/**
 * Register a new local user
 * @POST /auth/register
 * @access Public
 * Validation is handled by middleware (registerSchema)
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, name, username } = req.body;
    const displayName = name || username;
    const user = await registerLocalUser({ email, password, name: displayName, username });
    // Ensure a UserProfile exists for the auth user
    const existingProfile = await findUserByEmail(user.email);
    if (!existingProfile) {
      await createUserProfile({ authId: user._id, email: user.email, name: user.name, username: user.username, picture: user.picture });
    }
    
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    await saveRefreshToken(user._id, refreshToken);
    
    setRefreshCookie(res, refreshToken);

    // Send welcome email asynchronously without blocking response
    sendWelcomeEmail(user).catch((err) => {
      console.error('Email service error:', err.message);
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
      refreshToken // Added for easier testing
    });
  } catch (error) {
    console.error('Register error:', error.message);
    if (error.message.includes('Email already exists')) {
      return next(new ConflictError('Email already registered'));
    }
    if (error.message.includes('Username')) {
      return next(new ConflictError('Username already taken'));
    }
    return next(error);
  }
};

/**
 * Local user login with email and password
 * @POST /auth/login
 * @access Public
 * Validation is handled by middleware (loginSchema)
 */
export const localLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authenticateLocalUser(email, password);
    if (!user) {
      // Generic message to prevent user enumeration attacks
      return next(new UnauthorizedError('Invalid email or password'));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    await saveRefreshToken(user._id, refreshToken);
    
    setRefreshCookie(res, refreshToken);

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
      refreshToken // Added for easier testing
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return next(error);
  }
};

/**
 * Handle Google OAuth callback
 * @GET /auth/google/callback
 * @access Public
 * User is attached by Passport authentication
 */
export const googleCallback = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new UnauthorizedError('Authentication failed'));
    }

    // Ensure a UserProfile exists for the auth user (Google)
    const existingProfile = await findUserByEmail(user.email);
    if (!existingProfile) {
      await createUserProfile({ authId: user._id, email: user.email, name: user.name, username: user.username, picture: user.picture });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
  
    await saveRefreshToken(user._id, refreshToken);
    
    setRefreshCookie(res, refreshToken);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${frontendUrl}/oauth-callback?token=${accessToken}`);
  } catch (error) {
    console.error('Google callback error:', error.message);
    return next(error);
  }
};

/**
 * Refresh access token with token rotation
 * CRITICAL: Implements refresh token rotation for security
 * Old refresh token is invalidated when new one is issued
 * @POST /auth/token
 * @access Public
 */
export const refreshToken = async (req, res, next) => {
  try {
    // Prioritize body over cookies for easier Postman testing
    const token = req.body.refreshToken || req.cookies.refreshToken;
    
    if (!token) {
      return next(new UnauthorizedError('Refresh token missing'));
    }

    const user = await getUserByRefreshToken(token);
    if (!user) {
      return next(new UnauthorizedError('Invalid or expired refresh token'));
    }

    const newRefreshToken = generateRefreshToken(user);
    
    await revokeRefreshToken(user._id);
    await saveRefreshToken(user._id, newRefreshToken);
    
    const accessToken = generateAccessToken(user);
    
    setRefreshCookie(res, newRefreshToken);

    return res.json({ 
      accessToken,
      refreshToken: newRefreshToken // Return new token for rotation
    });
  } catch (error) {
    console.error('Refresh token error:', error.message);
    return next(error);
  }
};

/**
 * Logout user by revoking refresh token
 * @POST /auth/logout
 * @access Public
 */
export const logout = async (req, res, next) => {
  try {
    // Prioritize body over cookies for easier Postman testing
    const token = req.body.refreshToken || req.cookies.refreshToken;
    
    if (!token) {
      return next(new BadRequestError('Refresh token is required'));
    }

    const user = await getUserByRefreshToken(token);
    if (!user) {
      // If token is already invalid, we just clear the cookie and succeed
      clearRefreshCookie(res);
      return res.json({ message: 'Logout successful (token already invalid)' });
    }

    await revokeRefreshToken(user._id);
    
    clearRefreshCookie(res);

    return res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error.message);
    return next(error);
  }
};

/**
 * Request password reset email
 * @POST /auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return res.json({ message: 'If that email is registered, a password reset link has been sent.' });
    }

    if (user.provider === 'google') {
      return next(new BadRequestError('Google users cannot reset password via this method.'));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save token hash and expiration (1 hour)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`; // Assuming frontend runs on 5173
    
    await sendPasswordResetEmail(user.email, resetUrl);

    res.json({ message: 'If that email is registered, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    return next(error);
  }
};

/**
 * Reset password using token
 * @POST /auth/reset-password/:token
 * @access Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(new BadRequestError('Password reset token is invalid or has expired.'));
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    return next(error);
  }
};

/**
 * Change password
 * @POST /auth/change-password
 * @access Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new NotFoundError('User not found'));
    }

    if (user.provider === 'google') {
      return next(new BadRequestError('Google users cannot change password.'));
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return next(new UnauthorizedError('Incorrect old password'));
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error.message);
    return next(error);
  }
};

import express from 'express';
import passport from 'passport';
import { googleCallback, refreshToken, logout, register, localLogin, forgotPassword, resetPassword, changePassword } from './auth.controller.js';
import UnauthorizedError from '../../shared/errors/UnauthorizedError.js';
import { authenticateJWT } from '../../shared/middleware/authMiddleware.js';
import { validateRequest } from '../../shared/middleware/validation.middleware.js';
import { catchAsync } from '../../shared/errors/catchAsync.js';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from './auth.validation.js';

const authrouter = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new local user
 * @access Public
 */
authrouter.post('/register', validateRequest(registerSchema), catchAsync(register));

/**
 * @route POST /api/auth/login
 * @desc Local user login with email/password
 * @access Public
 */
authrouter.post('/login', validateRequest(loginSchema), catchAsync(localLogin));

/**
 * @route GET /api/auth/google
 * @desc Initiate Google OAuth2 authentication
 * @access Public
 */
authrouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
}));

/**
 * @route GET /api/auth/google/callback
 * @desc Handle Google OAuth2 callback and generate tokens
 * @access Public
 */
authrouter.get('/google/callback', passport.authenticate('google', {
  session: false,
  failureRedirect: '/api/auth/google/failure'
}), catchAsync(googleCallback));

/**
 * @route GET /api/auth/google/failure
 * @desc Handle Google OAuth2 authentication failure
 * @access Public
 */
authrouter.get('/google/failure', (req, res, next) => {
  next(new UnauthorizedError('Google sign-in failed'));
});

/**
 * @route POST /api/auth/token
 * @desc Refresh access token
 * @access Public
 */
authrouter.post('/token', catchAsync(refreshToken));

/**
 * @route POST /api/auth/logout
 * @desc Logout user and invalidate tokens
 * @access Public
 */
authrouter.post('/logout', catchAsync(logout));

/**
 * @route GET /api/auth/profile
 * @desc Get user profile information
 * @access Private
 */
authrouter.get('/profile', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

/**
 * @route POST /api/auth/forgot-password
 * @desc Request password reset email
 * @access Public
 */
authrouter.post('/forgot-password', validateRequest(forgotPasswordSchema), catchAsync(forgotPassword));

/**
 * @route POST /api/auth/reset-password/:token
 * @desc Reset password using token
 * @access Public
 */
authrouter.post('/reset-password/:token', validateRequest(resetPasswordSchema), catchAsync(resetPassword));

/**
 * @route POST /api/auth/change-password
 * @desc Change user password
 * @access Private
 */
authrouter.post('/change-password', authenticateJWT, validateRequest(changePasswordSchema), catchAsync(changePassword));

export default authrouter;

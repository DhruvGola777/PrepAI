import express from 'express';
import passport from 'passport';
import { googleCallback, refreshToken, logout, register, localLogin } from './auth.controller.js';
import { authenticateJWT } from '../../shared/middleware/authMiddleware.js';
import { validateRequest } from '../../shared/middleware/validation.middleware.js';
import { loginSchema, registerSchema } from './auth.validation.js';

const authrouter = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new local user
 * @access Public
 */
authrouter.post('/register', validateRequest(registerSchema), register);

/**
 * @route POST /api/auth/login
 * @desc Local user login with email/password
 * @access Public
 */
authrouter.post('/login', validateRequest(loginSchema), localLogin);

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
  failureRedirect: '/auth/google/failure'
}), googleCallback);

/**
 * @route GET /api/auth/google/failure
 * @desc Handle Google OAuth2 authentication failure
 * @access Public
 */
authrouter.get('/google/failure', (req, res) => {
  res.status(401).json({ message: 'Google sign-in failed' });
});

/**
 * @route POST /api/auth/token
 * @desc Refresh access token
 * @access Public
 */
authrouter.post('/token', refreshToken);

/**
 * @route POST /api/auth/logout
 * @desc Logout user and invalidate tokens
 * @access Public
 */
authrouter.post('/logout', logout);

/**
 * @route GET /api/auth/profile
 * @desc Get user profile information
 * @access Private
 */
authrouter.get('/profile', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

export default authrouter;

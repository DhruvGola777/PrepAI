import passport from 'passport';
import { generateAccessToken, generateRefreshToken, saveRefreshToken, getUserByRefreshToken, revokeRefreshToken, registerLocalUser, authenticateLocalUser } from './auth.service.js';
import { sendWelcomeEmail } from '../../shared/utils/email.service.js';
import ConflictError from '../../shared/errors/ConflictError.js';
import UnauthorizedError from '../../shared/errors/UnauthorizedError.js';
import BadRequestError from '../../shared/errors/BadRequestError.js';

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
      accessToken
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
      accessToken
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
      accessToken
    });
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
    const token = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!token) {
      return next(new UnauthorizedError('Unauthorized'));
    }

    const user = await getUserByRefreshToken(token);
    if (!user) {
      return next(new UnauthorizedError('Unauthorized'));
    }

    const newRefreshToken = generateRefreshToken(user);
    
    await revokeRefreshToken(user._id);
    await saveRefreshToken(user._id, newRefreshToken);
    
    const accessToken = generateAccessToken(user);
    
    setRefreshCookie(res, newRefreshToken);

    return res.json({ 
      accessToken
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
    const token = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!token) {
      return next(new BadRequestError('Refresh token is required'));
    }

    const user = await getUserByRefreshToken(token);
    if (!user) {
      return next(new UnauthorizedError('Unauthorized'));
    }

    await revokeRefreshToken(user._id);
    
    clearRefreshCookie(res);

    return res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error.message);
    return next(error);
  }
};

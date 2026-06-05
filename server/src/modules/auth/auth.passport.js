import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './auth.model.js';
import { env } from '../../config/env.js';
import { sendWelcomeEmail } from '../../shared/utils/email.service.js';

passport.use(new GoogleStrategy({
  clientID: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  callbackURL: env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;
    const googlePicture = profile.photos?.[0]?.value;

    if (!email) {
      return done(new Error('Google account does not have an email'), null);
    }

    // Try to find existing user by googleId
    let user = await User.findOne({ googleId });
    if (user) {
      // update basic profile fields
      user.email = email || user.email;
      user.name = name || user.name;
      user.picture = googlePicture || user.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}&backgroundColor=random`;
      await user.save();
      return done(null, user);
    }

    // If no user by googleId, check if a user exists with same email
    user = await User.findOne({ email });
    if (user) {
      // link googleId to existing account
      user.googleId = googleId;
      user.provider = 'google';
      user.name = name || user.name;
      user.picture = googlePicture || user.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}&backgroundColor=random`;
      await user.save();
      return done(null, user);
    }

    // No existing user, create a new one
    const username = email ? email.split('@')[0] : undefined;
    const defaultPicture = googlePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=random`;
    const newUser = await User.create({ googleId, email, name, picture: defaultPicture, provider: 'google', username });

    // send welcome email for newly registered Google user
    try {
      await sendWelcomeEmail(newUser);
    } catch (err) {
      console.error('Failed to send welcome email to Google user:', err);
    }

    return done(null, newUser);
  } catch (error) {
    return done(error, null);
  }
}));

export default passport;

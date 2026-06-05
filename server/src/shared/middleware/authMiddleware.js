import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import User from '../../modules/auth/auth.model.js';

export async function authenticateJWT(req, res, next) {
  const authorization = req.headers.authorization || '';
  const token = req.cookies?.accessToken || (authorization.startsWith('Bearer ') ? authorization.split(' ')[1] : null);

  if (!token) {
    return res.status(401).json({ message: 'Access token missing from cookie or Authorization header' });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-refreshToken');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = { id: user._id, email: user.email, name: user.name, picture: user.picture };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

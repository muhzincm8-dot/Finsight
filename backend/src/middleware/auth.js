import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function (req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');

  // Check if not token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'Muhzincmfinsight');
    req.user = decoded.user;

    // Check if user is still active
    const user = await User.findById(req.user.id).select('isActive');
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }
    if (!user.isActive) {
      return res.status(403).json({ msg: 'Account suspended. Please contact support.' });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

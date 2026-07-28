import User from '../models/User.js';

export default async function adminMiddleware(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('role');
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ msg: 'Server error checking admin role' });
  }
}

import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import User from '../models/User.js';

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/users', auth, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/admin/users/:id/toggle-status
// @desc    Toggle user active/inactive status
// @access  Private/Admin
router.patch('/users/:id/toggle-status', auth, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Prevent admin from deactivating themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ msg: 'Cannot change your own status' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ id: user.id, isActive: user.isActive, msg: `User ${user.isActive ? 'activated' : 'suspended'} successfully` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/admin/users/:id/make-admin
// @desc    Promote a user to admin role
// @access  Private/Admin
router.patch('/users/:id/make-admin', auth, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();

    res.json({ id: user.id, role: user.role, msg: `User role updated to ${user.role}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;

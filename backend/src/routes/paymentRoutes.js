import express from 'express';
const router = express.Router();
import crypto from 'crypto';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
const IS_MOCK = RAZORPAY_KEY_ID === 'rzp_test_placeholder';

// @route   POST /api/payment/create-order
// @desc    Create a Razorpay payment order (or mock for dev)
// @access  Private
router.post('/create-order', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (user.hasPaid) {
      return res.status(400).json({ msg: 'You already have lifetime access.' });
    }

    const amount = 49900; // ₹499 in paise

    if (!IS_MOCK) {
      // Real Razorpay flow
      try {
        const { default: Razorpay } = await import('razorpay');
        const razorpay = new Razorpay({
          key_id: RAZORPAY_KEY_ID,
          key_secret: RAZORPAY_KEY_SECRET,
        });

        const order = await razorpay.orders.create({
          amount,
          currency: 'INR',
          receipt: `receipt_${user.id}_${Date.now()}`,
        });

        return res.json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: RAZORPAY_KEY_ID,
          mock: false,
        });
      } catch (rzpErr) {
        console.error('Razorpay error:', rzpErr.message);
        return res.status(500).json({ msg: 'Payment gateway error', error: rzpErr.message });
      }
    }

    // Mock response for development without real keys
    res.json({
      orderId: `order_mock_${Date.now()}`,
      amount,
      currency: 'INR',
      keyId: RAZORPAY_KEY_ID,
      mock: true,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to create payment order', error: err.message });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment and unlock lifetime access
// @access  Private
router.post('/verify', auth, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mock } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // For mock/test mode, skip signature verification
    if (mock || IS_MOCK) {
      user.hasPaid = true;
      user.paymentDate = new Date();
      await user.save();
      return res.json({ msg: 'Payment verified (test mode). Lifetime access granted!', hasPaid: true });
    }

    // Verify Razorpay signature
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ msg: 'Missing payment verification fields.' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ msg: 'Payment verification failed. Invalid signature.' });
    }

    user.hasPaid = true;
    user.paymentDate = new Date();
    await user.save();

    res.json({ msg: 'Payment verified. Lifetime access granted!', hasPaid: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error during payment verification' });
  }
});

export default router;

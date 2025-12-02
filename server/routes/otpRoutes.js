import express from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { otpLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// In-memory OTP store (For demo purposes only)
// In production, use Redis or database
const otpStore = new Map();

// @desc    Send OTP
// @route   POST /api/otp/send-otp
// @access  Public
router.post('/send-otp', otpLimiter, async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP (expires in 5 minutes)
    otpStore.set(phone, {
        otp,
        expires: Date.now() + 5 * 60 * 1000
    });

    console.log('------------------------------------------------');
    console.log(`[OTP Mock] Sending OTP to ${phone}: ${otp}`);
    console.log('------------------------------------------------');

    res.json({
        message: 'OTP sent successfully',
        otp: otp // Returning OTP in response for easy testing
    });
});

// @desc    Verify OTP and Login
// @route   POST /api/otp/verify-otp
// @access  Public
router.post('/verify-otp', otpLimiter, async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ message: 'Phone and OTP are required' });
    }

    const storedData = otpStore.get(phone);

    if (!storedData) {
        return res.status(400).json({ message: 'OTP not found or expired' });
    }

    if (Date.now() > storedData.expires) {
        otpStore.delete(phone);
        return res.status(400).json({ message: 'OTP expired' });
    }

    if (storedData.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP Verified - Find or Create User
    let user = await User.findOne({ phone });

    if (!user) {
        // Check if email exists (optional logic depending on requirements)
        // For now, create a new user with placeholder email if not found
        // In a real app, you might ask for email after OTP verification
        user = await User.create({
            name: 'User',
            email: `${phone}@mobile.login`, // Placeholder
            phone: phone,
            password: Math.random().toString(36).slice(-8) // Random password
        });
    }

    // Clear OTP
    otpStore.delete(phone);

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
    });
});

export default router;

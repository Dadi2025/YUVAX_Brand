import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get user's referral info
// @route   GET /api/referral/my-referral
// @access  Private
router.get('/my-referral', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('referralCode walletBalance referralEarnings');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Count how many users were referred by this user
        const referralCount = await User.countDocuments({ referredBy: user._id });

        res.json({
            referralCode: user.referralCode,
            walletBalance: user.walletBalance,
            referralEarnings: user.referralEarnings,
            totalReferrals: referralCount
        });
    } catch (error) {
        console.error('Get referral info error:', error);
        res.status(500).json({ message: 'Failed to fetch referral information' });
    }
});

// @desc    Apply referral code during signup
// @route   POST /api/referral/apply
// @access  Public (called during registration)
router.post('/apply', async (req, res) => {
    try {
        const { referralCode, newUserId } = req.body;

        if (!referralCode || !newUserId) {
            return res.status(400).json({ message: 'Referral code and user ID required' });
        }

        // Find the referrer by code
        const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });

        if (!referrer) {
            return res.status(404).json({ message: 'Invalid referral code' });
        }

        // Find the new user
        const newUser = await User.findById(newUserId);

        if (!newUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user already has a referrer
        if (newUser.referredBy) {
            return res.status(400).json({ message: 'Referral code already applied' });
        }

        // Prevent self-referral
        if (referrer._id.toString() === newUserId) {
            return res.status(400).json({ message: 'Cannot use your own referral code' });
        }

        // Apply referral
        newUser.referredBy = referrer._id;
        newUser.walletBalance += 100; // New user gets ₹100
        await newUser.save();

        // Reward referrer
        referrer.walletBalance += 500; // Referrer gets ₹500
        referrer.referralEarnings += 500;
        await referrer.save();

        res.json({
            message: 'Referral applied successfully!',
            bonus: 100,
            referrerBonus: 500
        });
    } catch (error) {
        console.error('Apply referral error:', error);
        res.status(500).json({ message: 'Failed to apply referral code' });
    }
});

// @desc    Validate referral code
// @route   GET /api/referral/validate/:code
// @access  Public
router.get('/validate/:code', async (req, res) => {
    try {
        const code = req.params.code.toUpperCase();
        const user = await User.findOne({ referralCode: code }).select('name');

        if (!user) {
            return res.status(404).json({ valid: false, message: 'Invalid referral code' });
        }

        res.json({
            valid: true,
            referrerName: user.name
        });
    } catch (error) {
        console.error('Validate referral error:', error);
        res.status(500).json({ message: 'Failed to validate referral code' });
    }
});

export default router;

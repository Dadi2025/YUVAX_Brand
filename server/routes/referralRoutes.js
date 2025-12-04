import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import loyaltyService from '../utils/loyaltyService.js';

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

        // Calculate Referrer Bonus (Tiered System)
        // 1-4 referrals: ₹200
        // 5-9 referrals: ₹200 + ₹500 bonus (on 5th)
        // 10+ referrals: ₹200 + ₹1000 bonus (on 10th)

        const currentReferrals = await User.countDocuments({ referredBy: referrer._id });
        let bonusAmount = 200; // Base bonus
        let message = 'Referral applied successfully!';

        // Check for milestone bonuses
        if (currentReferrals === 4) { // This is the 5th referral (0-indexed count before this one was 4)
            bonusAmount += 500;
            message += ' Referrer unlocked Silver Tier Bonus!';
        } else if (currentReferrals === 9) { // This is the 10th referral
            bonusAmount += 1000;
            message += ' Referrer unlocked Gold Tier Bonus!';
        }

        referrer.walletBalance += bonusAmount;
        referrer.referralEarnings += bonusAmount;
        await referrer.save();

        // Award Loyalty Points (200 pts)
        try {
            await loyaltyService.awardReferralPoints(referrer._id, newUser._id);
        } catch (err) {
            console.error('Error awarding referral points:', err);
        }

        res.json({
            message,
            bonus: 100,
            referrerBonus: bonusAmount
        });
    } catch (error) {
        console.error('Apply referral error:', error);
        res.status(500).json({ message: 'Failed to apply referral code' });
    }
});

// @desc    Get referral leaderboard
// @route   GET /api/referral/leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
    try {
        // Get top 10 referrers
        const topReferrers = await User.find({ referralEarnings: { $gt: 0 } })
            .sort({ referralEarnings: -1 })
            .limit(10)
            .select('name referralEarnings referralStats');

        // If no stats yet, return mock data for demo purposes
        if (topReferrers.length === 0) {
            return res.json([
                { name: 'Rahul K.', referralEarnings: 9000, referralCount: 45 },
                { name: 'Priya S.', referralEarnings: 7600, referralCount: 38 },
                { name: 'Amit M.', referralEarnings: 6400, referralCount: 32 },
                { name: 'Sneha R.', referralEarnings: 5600, referralCount: 28 },
                { name: 'Vikram J.', referralEarnings: 5000, referralCount: 25 }
            ]);
        }

        // Map to simpler format
        const leaderboard = await Promise.all(topReferrers.map(async (user) => {
            const count = await User.countDocuments({ referredBy: user._id });
            return {
                name: user.name,
                referralEarnings: user.referralEarnings,
                referralCount: count
            };
        }));

        res.json(leaderboard);
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ message: 'Failed to fetch leaderboard' });
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

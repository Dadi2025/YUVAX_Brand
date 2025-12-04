import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import loyaltyService from '../utils/loyaltyService.js';
import PointsTransaction from '../models/PointsTransaction.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get user's loyalty points and tier info
// @route   GET /api/loyalty/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('loyaltyPoints loyaltyTier totalSpent');

        const tierInfo = loyaltyService.getTierPerks(user.loyaltyTier);
        const nextTier = user.loyaltyTier === 'Bronze' ? 'Silver' : user.loyaltyTier === 'Silver' ? 'Gold' : null;
        const nextTierThreshold = nextTier ? loyaltyService.TIER_THRESHOLDS[nextTier] : null;
        const progressToNextTier = nextTier ? ((user.totalSpent / nextTierThreshold) * 100).toFixed(1) : 100;

        res.json({
            points: user.loyaltyPoints,
            tier: user.loyaltyTier,
            totalSpent: user.totalSpent,
            tierPerks: tierInfo,
            nextTier,
            nextTierThreshold,
            progressToNextTier: parseFloat(progressToNextTier),
            amountToNextTier: nextTier ? Math.max(0, nextTierThreshold - user.totalSpent) : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get points transaction history
// @route   GET /api/loyalty/history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const transactions = await loyaltyService.getPointsHistory(req.user._id, limit);

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Redeem points for discount
// @route   POST /api/loyalty/redeem
// @access  Private
router.post('/redeem', protect, async (req, res) => {
    try {
        const { points } = req.body;

        if (!points || points < 1000) {
            return res.status(400).json({ message: 'Minimum redemption is 1000 points' });
        }

        const result = await loyaltyService.redeemPoints(req.user._id, points);

        res.json({
            success: true,
            message: `Successfully redeemed ${points} points`,
            discountAmount: result.discountAmount,
            discountCode: result.discountCode,
            newBalance: result.newBalance
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get tier perks information
// @route   GET /api/loyalty/tiers
// @access  Public
router.get('/tiers', async (req, res) => {
    try {
        const tiers = {
            Bronze: {
                threshold: loyaltyService.TIER_THRESHOLDS.Bronze,
                perks: loyaltyService.getTierPerks('Bronze')
            },
            Silver: {
                threshold: loyaltyService.TIER_THRESHOLDS.Silver,
                perks: loyaltyService.getTierPerks('Silver')
            },
            Gold: {
                threshold: loyaltyService.TIER_THRESHOLDS.Gold,
                perks: loyaltyService.getTierPerks('Gold')
            }
        };

        res.json(tiers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Check for birthday bonus
// @route   POST /api/loyalty/birthday-check
// @access  Private
router.post('/birthday-check', protect, async (req, res) => {
    try {
        const result = await loyaltyService.awardBirthdayBonus(req.user._id);

        if (result) {
            res.json({
                success: true,
                message: 'Happy Birthday! You\'ve received bonus points!',
                pointsAwarded: loyaltyService.POINTS_RATES.BIRTHDAY,
                newBalance: result.newBalance
            });
        } else {
            res.json({
                success: false,
                message: 'No birthday bonus available at this time'
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get points earning opportunities
// @route   GET /api/loyalty/earn-opportunities
// @access  Private
router.get('/earn-opportunities', protect, async (req, res) => {
    try {
        const opportunities = [
            {
                action: 'Make a Purchase',
                points: '10 points per ₹100',
                description: 'Earn points on every purchase'
            },
            {
                action: 'Write a Review',
                points: loyaltyService.POINTS_RATES.REVIEW,
                description: 'Share your product experience'
            },
            {
                action: 'Refer a Friend',
                points: loyaltyService.POINTS_RATES.REFERRAL,
                description: 'Get rewarded when they make their first purchase'
            },
            {
                action: 'Share on Social Media',
                points: loyaltyService.POINTS_RATES.SOCIAL_SHARE,
                description: 'Share products you love'
            },
            {
                action: 'Birthday Bonus',
                points: loyaltyService.POINTS_RATES.BIRTHDAY,
                description: 'Special birthday month reward'
            },
            {
                action: 'Daily Spin',
                points: 'Up to 100',
                description: 'Spin the wheel daily for bonus points'
            }
        ];

        res.json(opportunities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

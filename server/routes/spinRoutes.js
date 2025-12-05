import express from 'express';
import { protect } from '../middleware/auth.js';
import SpinWheel from '../models/SpinWheel.js';
import loyaltyService from '../utils/loyaltyService.js';

const router = express.Router();

// Reward configuration with probabilities
const REWARDS = [
    { type: 'discount', value: 5, probability: 30, label: '5% OFF' },
    { type: 'discount', value: 10, probability: 25, label: '10% OFF' },
    { type: 'discount', value: 15, probability: 20, label: '15% OFF' },
    { type: 'discount', value: 20, probability: 15, label: '20% OFF' },
    { type: 'points', value: 50, probability: 5, label: '50 Points' },
    { type: 'points', value: 100, probability: 3, label: '100 Points' },
    { type: 'discount', value: 50, probability: 1.5, label: '50% OFF' },
    { type: 'free_shipping', value: 1, probability: 0.5, label: 'Free Shipping' }
];

// Generate random reward based on probabilities
const getRandomReward = () => {
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const reward of REWARDS) {
        cumulative += reward.probability;
        if (random <= cumulative) {
            return reward;
        }
    }

    return REWARDS[0]; // Fallback
};

// Generate unique discount code
const generateDiscountCode = (type, value) => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${type.toUpperCase()}${value}_${timestamp}${random}`;
};

// @desc    Get spin wheel status
// @route   GET /api/spin/status
// @access  Private
router.get('/status', protect, async (req, res) => {
    try {
        let spinData = await SpinWheel.findOne({ user: req.user._id });

        if (!spinData) {
            spinData = await SpinWheel.create({ user: req.user._id });
        }

        const canSpin = spinData.canSpinToday();
        const activeRewards = spinData.rewards.filter(r => !r.used && new Date(r.expiresAt) > new Date());

        res.json({
            canSpin,
            currentStreak: spinData.currentStreak,
            longestStreak: spinData.longestStreak,
            totalSpins: spinData.totalSpins,
            lastSpinDate: spinData.lastSpinDate,
            activeRewards: activeRewards.length,
            rewards: activeRewards
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Spin the wheel
// @route   POST /api/spin/wheel
// @access  Private
router.post('/wheel', protect, async (req, res) => {
    try {
        let spinData = await SpinWheel.findOne({ user: req.user._id });

        if (!spinData) {
            spinData = await SpinWheel.create({ user: req.user._id });
        }

        // Check if user can spin
        if (!spinData.canSpinToday()) {
            return res.status(400).json({
                message: 'You have already spun today. Come back tomorrow!',
                nextSpinAvailable: new Date(spinData.lastSpinDate).setHours(24, 0, 0, 0)
            });
        }

        // Get random reward
        const reward = getRandomReward();

        // Generate discount code if applicable
        let code = null;
        if (reward.type === 'discount' || reward.type === 'free_shipping') {
            code = generateDiscountCode(reward.type, reward.value);
        }

        // Calculate expiration (7 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Add reward to user's spin data
        spinData.rewards.push({
            type: reward.type,
            value: reward.value,
            code,
            expiresAt,
            used: false
        });

        // Update streak
        spinData.updateStreak();
        await spinData.save();

        // If reward is points, award them immediately
        if (reward.type === 'points') {
            await loyaltyService.awardPoints(
                req.user._id,
                reward.value,
                'spin_wheel',
                `Won ${reward.value} points from daily spin`
            );
        }

        // Streak bonus (every 7 days)
        let streakBonus = null;
        if (spinData.currentStreak % 7 === 0 && spinData.currentStreak > 0) {
            const bonusPoints = 100;
            await loyaltyService.awardPoints(
                req.user._id,
                bonusPoints,
                'spin_wheel',
                `7-day streak bonus! Earned ${bonusPoints} points`
            );
            streakBonus = bonusPoints;
        }

        res.json({
            success: true,
            reward: {
                type: reward.type,
                value: reward.value,
                label: reward.label,
                code
            },
            currentStreak: spinData.currentStreak,
            streakBonus,
            expiresAt,
            message: `Congratulations! You won ${reward.label}!`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get spin history
// @route   GET /api/spin/history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const spinData = await SpinWheel.findOne({ user: req.user._id });

        if (!spinData) {
            return res.json({ rewards: [] });
        }

        res.json({
            totalSpins: spinData.totalSpins,
            currentStreak: spinData.currentStreak,
            longestStreak: spinData.longestStreak,
            rewards: spinData.rewards.sort((a, b) => b.spunAt - a.spunAt)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Use a reward
// @route   POST /api/spin/use-reward/:rewardId
// @access  Private
router.post('/use-reward/:rewardId', protect, async (req, res) => {
    try {
        const spinData = await SpinWheel.findOne({ user: req.user._id });

        if (!spinData) {
            return res.status(404).json({ message: 'No spin data found' });
        }

        const reward = spinData.rewards.id(req.params.rewardId);

        if (!reward) {
            return res.status(404).json({ message: 'Reward not found' });
        }

        if (reward.used) {
            return res.status(400).json({ message: 'Reward already used' });
        }

        if (new Date(reward.expiresAt) < new Date()) {
            return res.status(400).json({ message: 'Reward has expired' });
        }

        reward.used = true;
        reward.usedAt = new Date();
        await spinData.save();

        res.json({
            success: true,
            message: 'Reward marked as used',
            reward
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

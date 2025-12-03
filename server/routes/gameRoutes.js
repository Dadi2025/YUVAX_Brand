import express from 'express';
import Coupon from '../models/Coupon.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Prize pool configuration
const PRIZES = [
    { discount: 5, type: 'percentage', weight: 30 },
    { discount: 10, type: 'percentage', weight: 25 },
    { discount: 15, type: 'percentage', weight: 20 },
    { discount: 20, type: 'percentage', weight: 15 },
    { discount: 0, type: 'freeShipping', weight: 10 }
];

// Generate random coupon code
const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'YUVA';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Weighted random selection
const selectPrize = () => {
    const totalWeight = PRIZES.reduce((sum, prize) => sum + prize.weight, 0);
    let random = Math.random() * totalWeight;

    for (const prize of PRIZES) {
        random -= prize.weight;
        if (random <= 0) {
            return prize;
        }
    }
    return PRIZES[0]; // Fallback
};

// @desc    Check if user can spin today
// @route   GET /api/game/can-spin
// @access  Private
router.get('/can-spin', protect, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaySpin = await Coupon.findOne({
            user: req.user._id,
            wonAt: { $gte: today }
        });

        res.json({
            canSpin: !todaySpin,
            nextSpinAt: todaySpin ? new Date(today.getTime() + 24 * 60 * 60 * 1000) : null
        });
    } catch (error) {
        console.error('Can spin check error:', error);
        res.status(500).json({ message: 'Failed to check spin status' });
    }
});

// @desc    Spin the wheel and win a prize
// @route   POST /api/game/spin
// @access  Private
router.post('/spin', protect, async (req, res) => {
    try {
        // Check if user already spun today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaySpin = await Coupon.findOne({
            user: req.user._id,
            wonAt: { $gte: today }
        });

        if (todaySpin) {
            return res.status(400).json({
                message: 'You have already spun today. Come back tomorrow!'
            });
        }

        // Select prize
        const prize = selectPrize();

        // Generate unique coupon code
        let code = generateCouponCode();
        let exists = await Coupon.findOne({ code });
        while (exists) {
            code = generateCouponCode();
            exists = await Coupon.findOne({ code });
        }

        // Create coupon
        const coupon = await Coupon.create({
            code,
            discount: prize.discount,
            type: prize.type,
            user: req.user._id,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

        res.json({
            success: true,
            prize: {
                code: coupon.code,
                discount: coupon.discount,
                type: coupon.type,
                expiresAt: coupon.expiresAt
            }
        });
    } catch (error) {
        console.error('Spin error:', error);
        res.status(500).json({ message: 'Failed to spin the wheel' });
    }
});

// @desc    Get user's coupons
// @route   GET /api/game/my-coupons
// @access  Private
router.get('/my-coupons', protect, async (req, res) => {
    try {
        const coupons = await Coupon.find({
            user: req.user._id,
            expiresAt: { $gt: new Date() }
        }).sort({ wonAt: -1 });

        res.json(coupons);
    } catch (error) {
        console.error('Get coupons error:', error);
        res.status(500).json({ message: 'Failed to fetch coupons' });
    }
});

// @desc    Validate and apply coupon
// @route   POST /api/game/validate-coupon
// @access  Private
router.post('/validate-coupon', protect, async (req, res) => {
    try {
        const { code } = req.body;

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            user: req.user._id,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!coupon) {
            return res.status(404).json({
                message: 'Invalid or expired coupon code'
            });
        }

        res.json({
            valid: true,
            discount: coupon.discount,
            type: coupon.type
        });
    } catch (error) {
        console.error('Validate coupon error:', error);
        res.status(500).json({ message: 'Failed to validate coupon' });
    }
});

export default router;

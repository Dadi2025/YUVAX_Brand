import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Toggle price alerts preference
// @route   PUT /api/alerts/preference
// @access  Private
router.put('/preference', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.priceAlertsEnabled = req.body.enabled;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                priceAlertsEnabled: updatedUser.priceAlertsEnabled
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update alert preference error:', error);
        res.status(500).json({ message: 'Failed to update alert preference' });
    }
});

// @desc    Get alert preference
// @route   GET /api/alerts/preference
// @access  Private
router.get('/preference', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({ priceAlertsEnabled: user.priceAlertsEnabled });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get alert preference error:', error);
        res.status(500).json({ message: 'Failed to get alert preference' });
    }
});

export default router;

import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import FlashSale from '../models/FlashSale.js';

const router = express.Router();

// @desc    Get active flash sales
// @route   GET /api/flash-sales/active
// @access  Public
router.get('/active', async (req, res) => {
    try {
        const now = new Date();

        const flashSales = await FlashSale.find({
            active: true,
            startTime: { $lte: now },
            endTime: { $gte: now },
            remainingStock: { $gt: 0 }
        }).sort({ endTime: 1 });

        res.json(flashSales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get upcoming flash sales
// @route   GET /api/flash-sales/upcoming
// @access  Public
router.get('/upcoming', async (req, res) => {
    try {
        const now = new Date();

        const flashSales = await FlashSale.find({
            active: true,
            startTime: { $gt: now }
        }).sort({ startTime: 1 }).limit(10);

        res.json(flashSales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get flash sale by ID
// @route   GET /api/flash-sales/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const flashSale = await FlashSale.findById(req.params.id);

        if (!flashSale) {
            return res.status(404).json({ message: 'Flash sale not found' });
        }

        const now = new Date();
        const isActive = flashSale.active &&
            flashSale.remainingStock > 0 &&
            now >= flashSale.startTime &&
            now <= flashSale.endTime;

        res.json({
            ...flashSale.toObject(),
            isActive,
            timeRemaining: isActive ? Math.max(0, flashSale.endTime - now) : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create flash sale
// @route   POST /api/flash-sales
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const {
            product,
            title,
            originalPrice,
            flashPrice,
            startTime,
            endTime,
            totalStock,
            featured
        } = req.body;

        const discount = Math.round(((originalPrice - flashPrice) / originalPrice) * 100);

        const flashSale = await FlashSale.create({
            product,
            title,
            originalPrice,
            flashPrice,
            discount,
            startTime,
            endTime,
            totalStock,
            remainingStock: totalStock,
            featured: featured || false,
            active: true
        });

        res.status(201).json(flashSale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update flash sale
// @route   PUT /api/flash-sales/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const flashSale = await FlashSale.findById(req.params.id);

        if (!flashSale) {
            return res.status(404).json({ message: 'Flash sale not found' });
        }

        const {
            flashPrice,
            startTime,
            endTime,
            totalStock,
            active,
            featured
        } = req.body;

        if (flashPrice) {
            flashSale.flashPrice = flashPrice;
            flashSale.discount = Math.round(((flashSale.originalPrice - flashPrice) / flashSale.originalPrice) * 100);
        }
        if (startTime) flashSale.startTime = startTime;
        if (endTime) flashSale.endTime = endTime;
        if (totalStock) {
            const sold = flashSale.sold;
            flashSale.totalStock = totalStock;
            flashSale.remainingStock = Math.max(0, totalStock - sold);
        }
        if (typeof active !== 'undefined') flashSale.active = active;
        if (typeof featured !== 'undefined') flashSale.featured = featured;

        await flashSale.save();
        res.json(flashSale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete flash sale
// @route   DELETE /api/flash-sales/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const flashSale = await FlashSale.findById(req.params.id);

        if (!flashSale) {
            return res.status(404).json({ message: 'Flash sale not found' });
        }

        await flashSale.deleteOne();
        res.json({ message: 'Flash sale removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Reserve flash sale item (called during checkout)
// @route   POST /api/flash-sales/:id/reserve
// @access  Private
router.post('/:id/reserve', protect, async (req, res) => {
    try {
        const { quantity } = req.body;
        const flashSale = await FlashSale.findById(req.params.id);

        if (!flashSale) {
            return res.status(404).json({ message: 'Flash sale not found' });
        }

        const now = new Date();
        if (now < flashSale.startTime) {
            return res.status(400).json({ message: 'Flash sale has not started yet' });
        }

        if (now > flashSale.endTime) {
            return res.status(400).json({ message: 'Flash sale has ended' });
        }

        if (flashSale.remainingStock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        flashSale.remainingStock -= quantity;
        flashSale.sold += quantity;
        await flashSale.save();

        res.json({
            success: true,
            message: 'Item reserved',
            flashPrice: flashSale.flashPrice,
            remainingStock: flashSale.remainingStock
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

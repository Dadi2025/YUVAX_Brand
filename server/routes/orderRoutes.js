import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';
import { sendOrderConfirmation } from '../utils/whatsappService.js';
import { assignAgentByPinCode, markOrderCompleted } from '../utils/agentAssignment.js';

const router = express.Router();

// Validation rules
const orderValidation = [
    body('orderItems')
        .isArray({ min: 1 })
        .withMessage('Order must have at least one item'),
    body('shippingAddress.address')
        .trim()
        .notEmpty()
        .withMessage('Address is required'),
    body('shippingAddress.city')
        .trim()
        .notEmpty()
        .withMessage('City is required'),
    body('shippingAddress.postalCode')
        .trim()
        .matches(/^\d{6}$/)
        .withMessage('Invalid postal code'),
    body('shippingAddress.country')
        .trim()
        .notEmpty()
        .withMessage('Country is required'),
    body('paymentMethod')
        .isIn(['upi', 'card', 'cod', 'Razorpay', 'razorpay'])
        .withMessage('Invalid payment method'),
    body('totalPrice')
        .isFloat({ min: 0 })
        .withMessage('Invalid total price'),
];

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email phone');
        res.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders/:userId
// @access  Private
router.get('/myorders/:userId', protect, async (req, res) => {
    try {
        // Verify the userId matches the authenticated user
        if (req.params.userId !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view these orders' });
        }

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const orders = await Order.find({ user: req.params.userId });
        res.json(orders);
    } catch (error) {
        console.error('Fetch user orders error:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        // Validate status
        const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(req.body.status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = req.body.status;

        if (req.body.status === 'Delivered' && !order.isDelivered) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            // Award Loyalty Points (1 point per ₹100)
            const pointsToAward = Math.floor(order.totalPrice / 100);
            const user = await User.findById(order.user);
            if (user) {
                user.points += pointsToAward;
                await user.save();
            }
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(400).json({ message: 'Failed to update order status' });
    }
});

// @desc    Get order analytics
// @route   GET /api/orders/analytics
// @access  Private/Admin
// NOTE: This route MUST be before /:id route to avoid matching 'analytics' as an ID
router.get('/analytics', protect, admin, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalSales = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        const salesData = totalSales.length > 0 ? totalSales[0].total : 0;

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name');

        res.json({
            totalOrders,
            totalSales: salesData,
            recentOrders
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Failed to fetch analytics' });
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public (for order tracking)
// NOTE: This route MUST be after more specific routes like /myorders/:userId and /:id/status
router.get('/:id', async (req, res) => {
    try {
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Fetch order error:', error);
        res.status(500).json({ message: 'Failed to fetch order' });
    }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, orderValidation, async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        userId
    } = req.body;

    // Verify userId matches authenticated user
    if (userId !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to create order for another user' });
    }

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    try {
        const order = new Order({
            orderItems,
            user: userId,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        // Send WhatsApp notification
        if (shippingAddress.phone) {
            await sendOrderConfirmation(shippingAddress.phone, createdOrder._id);
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Create order error:', error);
        res.status(400).json({ message: 'Failed to create order' });
    }
});

// @desc    Request return
// @route   PUT /api/orders/:id/return
// @access  Private
router.put('/:id/return', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns the order
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (!order.isDelivered) {
            return res.status(400).json({ message: 'Cannot return undelivered order' });
        }

        if (order.returnStatus !== 'None') {
            return res.status(400).json({ message: 'Return already requested' });
        }

        order.returnStatus = 'Requested';
        order.returnReason = req.body.reason;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Return request error:', error);
        res.status(400).json({ message: 'Failed to request return' });
    }
});

// @desc    Update return status
// @route   PUT /api/orders/:id/return-status
// @access  Private/Admin
router.put('/:id/return-status', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.returnStatus = req.body.status;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Update return status error:', error);
        res.status(400).json({ message: 'Failed to update return status' });
    }
});

// @desc    Request exchange
// @route   PUT /api/orders/:id/exchange
// @access  Private
router.put('/:id/exchange', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns the order
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (!order.isDelivered) {
            return res.status(400).json({ message: 'Cannot exchange undelivered order' });
        }

        if (order.exchangeStatus !== 'None') {
            return res.status(400).json({ message: 'Exchange already requested' });
        }

        if (order.returnStatus !== 'None') {
            return res.status(400).json({ message: 'Cannot exchange order with active return request' });
        }

        order.exchangeStatus = 'Requested';
        order.exchangeReason = req.body.reason;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Exchange request error:', error);
        res.status(400).json({ message: 'Failed to request exchange' });
    }
});

// @desc    Update exchange status
// @route   PUT /api/orders/:id/exchange-status
// @access  Private/Admin
router.put('/:id/exchange-status', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.exchangeStatus = req.body.status;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Update exchange status error:', error);
        res.status(400).json({ message: 'Failed to update exchange status' });
    }
});

// @desc    Process refund
// @route   PUT /api/orders/:id/refund
// @access  Private/Admin
router.put('/:id/refund', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.returnStatus !== 'Approved') {
            return res.status(400).json({ message: 'Return must be approved before refunding' });
        }

        if (order.refundStatus === 'Completed') {
            return res.status(400).json({ message: 'Refund already completed' });
        }

        order.refundStatus = 'Completed';
        order.refundAmount = req.body.amount || order.totalPrice;
        order.refundedAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Refund processing error:', error);
        res.status(400).json({ message: 'Failed to process refund' });
    }
});

export default router;

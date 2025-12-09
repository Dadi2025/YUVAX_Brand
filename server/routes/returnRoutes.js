import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import ReturnRequest from '../models/ReturnRequest.js';
import Order from '../models/Order.js';

const router = express.Router();

// @desc    Create return request
// @route   POST /api/returns
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { orderId, items, returnType, pickupAddress, pickupTimeSlot } = req.body;

        // Verify order exists and belongs to user
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to return this order' });
        }

        // Check if order is eligible for return (within 14 days)
        const orderDate = new Date(order.createdAt);
        const daysSinceOrder = Math.floor((new Date() - orderDate) / (1000 * 60 * 60 * 24));

        if (daysSinceOrder > 14) {
            return res.status(400).json({ message: 'Return period has expired (14 days)' });
        }

        // Calculate refund amount
        const refundAmount = items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        const returnRequest = await ReturnRequest.create({
            order: orderId,
            user: req.user._id,
            items,
            returnType,
            pickupAddress: pickupAddress || order.shippingAddress,
            pickupTimeSlot,
            refundAmount,
            refundMethod: 'original_payment',
            refundStatus: 'pending',
            status: 'requested',
            statusHistory: [{
                status: 'requested',
                updatedAt: new Date(),
                updatedBy: 'customer',
                notes: 'Return request submitted'
            }]
        });

        // Sync with Order model for Admin Panel visibility
        console.log(`Processing return request for Order ${orderId}, Type: ${returnType}`);
        if (returnType === 'exchange') {
            order.exchangeStatus = 'Requested';
            // Use the first item's reason or a generic one
            order.exchangeReason = items.length > 0 ? (items[0].reasonDetails || items[0].reason) : 'Exchange Requested';
        } else {
            order.returnStatus = 'Requested';
            // Use the first item's reason or a generic one
            order.returnReason = items.length > 0 ? (items[0].reasonDetails || items[0].reason) : 'Return Requested';
        }
        await order.save();

        res.status(201).json(returnRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get user's return requests
// @route   GET /api/returns/my-returns
// @access  Private
router.get('/my-returns', protect, async (req, res) => {
    try {
        const returns = await ReturnRequest.find({ user: req.user._id })
            .populate('order', 'orderNumber createdAt')
            .sort({ createdAt: -1 });

        res.json(returns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get return request by ID
// @route   GET /api/returns/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const returnRequest = await ReturnRequest.findById(req.params.id)
            .populate('order', 'orderNumber createdAt items')
            .populate('user', 'name email phone');

        if (!returnRequest) {
            return res.status(404).json({ message: 'Return request not found' });
        }

        // Check authorization
        if (returnRequest.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(returnRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Cancel return request
// @route   PUT /api/returns/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const returnRequest = await ReturnRequest.findById(req.params.id);

        if (!returnRequest) {
            return res.status(404).json({ message: 'Return request not found' });
        }

        if (returnRequest.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (!['requested', 'approved'].includes(returnRequest.status)) {
            return res.status(400).json({ message: 'Cannot cancel return at this stage' });
        }

        returnRequest.status = 'cancelled';
        returnRequest.statusHistory.push({
            status: 'cancelled',
            updatedAt: new Date(),
            updatedBy: 'customer',
            notes: 'Cancelled by customer'
        });

        await returnRequest.save();
        res.json(returnRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all return requests (Admin)
// @route   GET /api/returns/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res) => {
    try {
        const status = req.query.status;
        const query = status ? { status } : {};

        const returns = await ReturnRequest.find(query)
            .populate('order', 'orderNumber createdAt')
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(returns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update return status (Admin)
// @route   PUT /api/returns/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const { status, notes, pickupDate, trackingNumber } = req.body;

        const returnRequest = await ReturnRequest.findById(req.params.id);

        if (!returnRequest) {
            return res.status(404).json({ message: 'Return request not found' });
        }

        returnRequest.status = status;
        if (notes) returnRequest.adminNotes = notes;
        if (pickupDate) returnRequest.pickupDate = pickupDate;
        if (trackingNumber) returnRequest.trackingNumber = trackingNumber;

        returnRequest.statusHistory.push({
            status,
            updatedAt: new Date(),
            updatedBy: 'admin',
            notes: notes || `Status updated to ${status}`
        });

        // If completed, process refund
        if (status === 'completed') {
            returnRequest.refundStatus = 'completed';
            returnRequest.refundedAt = new Date();
        }

        await returnRequest.save();
        res.json(returnRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get return policy
// @route   GET /api/returns/policy
// @access  Public
router.get('/policy/details', async (req, res) => {
    try {
        const policy = {
            returnWindow: 14,
            conditions: [
                'Products must be unused and in original packaging',
                'Tags and labels must be intact',
                'No damage or alterations',
                'Original invoice required'
            ],
            nonReturnable: [
                'Innerwear and lingerie',
                'Socks and accessories (for hygiene reasons)',
                'Products marked as "Final Sale"',
                'Customized or personalized items'
            ],
            process: [
                'Initiate return request within 14 days',
                'Pack items securely in original packaging',
                'Schedule pickup or drop at nearest store',
                'Refund processed within 7-10 business days'
            ],
            refundMethods: [
                'Original payment method',
                'Store wallet (instant)',
                'Bank transfer (3-5 days)'
            ]
        };

        res.json(policy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { assignAgentByPinCode } from '../utils/agentAssignment.js';
import { sendOrderConfirmation, sendShippingUpdate, sendDeliveryUpdate } from '../utils/whatsappService.js';

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email phone');
        res.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders/:userId
// @access  Private
export const getMyOrders = async (req, res) => {
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
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
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

        // Send WhatsApp Notifications
        if (req.body.status === 'Shipped') {
            await sendShippingUpdate(updatedOrder);
        } else if (req.body.status === 'Delivered') {
            await sendDeliveryUpdate(updatedOrder);
        }

        // Populate user data before sending response
        await updatedOrder.populate('user', 'id name email phone');

        res.json(updatedOrder);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(400).json({ message: 'Failed to update order status' });
    }
};

// @desc    Simulate Courier Updates (Auto-advance status)
// @route   POST /api/orders/simulate-courier
// @access  Private/Admin
export const simulateCourier = async (req, res) => {
    try {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const twoDays = 2 * oneDay;

        let updatedCount = 0;

        // 1. Processing -> Shipped (if older than 1 day)
        const oneDayAgo = new Date(now - oneDay);
        const processingOrders = await Order.find({
            status: 'Processing',
            createdAt: { $lt: oneDayAgo }
        });

        // Helper to process processing orders
        const shipPromises = processingOrders.map(async (order) => {
            try {
                order.status = 'Shipped';
                await order.save();
                // Send WhatsApp Shipping Notification
                await sendShippingUpdate(order).catch(console.error);
                return 1;
            } catch (err) {
                console.error(`Error updating order ${order._id} to Shipped:`, err);
                return 0;
            }
        });

        // 2. Shipped -> Delivered (if older than 2 days from update)
        const twoDaysAgo = new Date(now - twoDays);
        const shippedOrders = await Order.find({
            status: 'Shipped',
            updatedAt: { $lt: twoDaysAgo }
        });

        const deliverPromises = shippedOrders.map(async (order) => {
            try {
                order.status = 'Delivered';
                order.isDelivered = true;
                order.deliveredAt = now;
                await order.save();

                // Award Loyalty Points (Atomic Update)
                const pointsToAward = Math.floor(order.totalPrice / 100);
                if (order.user) {
                    await User.findByIdAndUpdate(order.user, {
                        $inc: { points: pointsToAward }
                    });
                }

                // Send WhatsApp Delivery Notification
                await sendDeliveryUpdate(order).catch(console.error);
                return 1;
            } catch (err) {
                console.error(`Error updating order ${order._id} to Delivered:`, err);
                return 0;
            }
        });

        // Wait for all updates to complete concurrently
        const results = await Promise.all([...shipPromises, ...deliverPromises]);
        updatedCount = results.reduce((a, b) => a + b, 0);

        res.json({ message: `Simulated courier updates: ${updatedCount} orders updated` });
    } catch (error) {
        console.error('Courier simulation error:', error);
        res.status(500).json({ message: 'Failed to simulate courier updates' });
    }
};

// @desc    Get order analytics
// @route   GET /api/orders/analytics
// @access  Private/Admin
export const getOrderAnalytics = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();

        const analytics = await Order.aggregate([
            {
                $facet: {
                    grossSales: [
                        {
                            $match: {
                                $or: [
                                    { isPaid: true },
                                    { status: 'Delivered' }
                                ]
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: '$totalPrice' }
                            }
                        }
                    ],
                    refunds: [
                        {
                            $match: {
                                refundStatus: 'Completed'
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: { $ifNull: ['$refundAmount', '$totalPrice'] } }
                            }
                        }
                    ]
                }
            }
        ]);

        const gross = analytics[0].grossSales.length > 0 ? analytics[0].grossSales[0].total : 0;
        const refundTotal = analytics[0].refunds.length > 0 ? analytics[0].refunds[0].total : 0;

        // Net Sales = Gross Sales (Paid/Delivered) - Refunds
        const netSales = gross - refundTotal;

        const recentOrders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email');

        res.json({
            totalOrders,
            totalSales: netSales < 0 ? 0 : netSales, // Ensure never negative
            grossSales: gross,
            totalRefunds: refundTotal,
            recentOrders
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Failed to fetch analytics' });
    }
};

// @desc    Get advanced analytics for charts
// @route   GET /api/orders/analytics/advanced
// @access  Private/Admin
export const getAdvancedAnalytics = async (req, res) => {
    try {
        const today = new Date();
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        // 1. Sales Trend (Last 7 Days)
        const salesTrend = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    $or: [{ isPaid: true }, { status: 'Delivered' }]
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSales: { $sum: "$totalPrice" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 2. Order Status Distribution
        const orderStatusDist = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 3. Top Products (by Quantity Sold)
        const topProducts = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.product",
                    name: { $first: "$orderItems.name" },
                    totalSold: { $sum: "$orderItems.qty" },
                    revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        // 4. Category Sales (Revenue by Category)
        const categorySales = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $lookup: {
                    from: "products",
                    localField: "orderItems.product",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $group: {
                    _id: "$productDetails.category",
                    totalRevenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        res.json({
            salesTrend,
            orderStatusDist,
            topProducts,
            categorySales
        });
    } catch (error) {
        console.error('Advanced analytics error:', error);
        res.status(500).json({ message: 'Failed to fetch advanced analytics' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public (for order tracking)
export const getOrderById = async (req, res) => {
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
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
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
        billingAddress, // New field
        saveAddress,    // New field (boolean)
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
            billingAddress: billingAddress || shippingAddress, // Default to shipping if not provided
            paymentMethod,
            paymentResult: req.body.paymentResult, // Add payment result from request
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid: req.body.paymentResult && req.body.paymentResult.status === 'COMPLETED' ? true : false,
            paidAt: req.body.paymentResult && req.body.paymentResult.status === 'COMPLETED' ? Date.now() : null,
        });


        const createdOrder = await order.save();

        // Auto-save address if requested
        if (saveAddress) {
            const user = await User.findById(userId);
            if (user) {
                // Check if address already exists to avoid duplicates (simple check by pincode/street)
                const addressExists = user.addresses.some(
                    addr => addr.zip === shippingAddress.postalCode && addr.street === shippingAddress.address
                );

                if (!addressExists) {
                    user.addresses.push({
                        street: shippingAddress.address,
                        city: shippingAddress.city,
                        state: "", // State not currently in Order schema shippingAddress object explicitly but is passed from frontend
                        zip: shippingAddress.postalCode,
                        country: shippingAddress.country
                    });
                    await user.save();
                }
            }
        }

        // Auto-assign delivery agent based on pincode
        const pinCode = String(shippingAddress.postalCode);
        const agent = await assignAgentByPinCode(pinCode);

        if (agent) {
            createdOrder.assignedAgent = agent._id;
            createdOrder.agentAssignedAt = Date.now();
            await createdOrder.save();
            console.log(`✅ Order ${createdOrder._id} assigned to agent: ${agent.name} (PIN: ${pinCode})`);
        } else {
            console.log(`⚠️ No agent available for PIN code: ${pinCode}`);
        }

        // Send WhatsApp notification
        if (createdOrder.user) {
            // Populate user to get phone number if not in shipping address
            await createdOrder.populate('user', 'name phone');
            await sendOrderConfirmation(createdOrder);
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Create order error:', error);
        res.status(400).json({ message: 'Failed to create order' });
    }
};

// @desc    Request return
// @route   PUT /api/orders/:id/return
// @access  Private
export const requestReturn = async (req, res) => {
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

        // Always request approval for returns
        order.returnStatus = 'Requested';
        order.returnReason = req.body.reason;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Return request error:', error);
        res.status(400).json({ message: 'Failed to request return' });
    }
};

// @desc    Update return status
// @route   PUT /api/orders/:id/return-status
// @access  Private/Admin
export const updateReturnStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.returnStatus = req.body.status;

        // Auto-assign agent for pickup if Approved
        if (req.body.status === 'Approved') {
            const pinCode = order.shippingAddress.postalCode;
            const agent = await assignAgentByPinCode(pinCode);
            if (agent) {
                order.assignedAgent = agent._id;
                console.log(`✅ Return Pickup assigned to agent: ${agent.name}`);
            }
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Update return status error:', error);
        res.status(400).json({ message: 'Failed to update return status' });
    }
};

// @desc    Request exchange
// @route   PUT /api/orders/:id/exchange
// @access  Private
export const requestExchange = async (req, res) => {
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
};

// @desc    Update exchange status
// @route   PUT /api/orders/:id/exchange-status
// @access  Private/Admin
export const updateExchangeStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.exchangeStatus = req.body.status;

        // Auto-assign agent for exchange pickup/delivery if Approved
        if (req.body.status === 'Approved') {
            const pinCode = order.shippingAddress.postalCode;
            const agent = await assignAgentByPinCode(pinCode);
            if (agent) {
                order.assignedAgent = agent._id;
                console.log(`✅ Exchange assigned to agent: ${agent.name}`);
            }
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Update exchange status error:', error);
        res.status(400).json({ message: 'Failed to update exchange status' });
    }
};

// @desc    Process refund (Simulated)
// @route   PUT /api/orders/:id/process-refund
// @access  Private/Admin
export const processRefund = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.returnStatus !== 'Approved' && order.status !== 'Cancelled') {
            return res.status(400).json({ message: 'Return must be approved or order cancelled before refunding' });
        }

        if (order.refundStatus === 'Completed') {
            return res.status(400).json({ message: 'Refund already completed' });
        }

        // Simulate Payment Gateway Refund
        order.refundStatus = 'Completed';
        order.refundAmount = order.totalPrice;
        order.refundedAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Refund processing error:', error);
        res.status(400).json({ message: 'Failed to process refund' });
    }
};

// @desc    Process refund (Manual/Legacy)
// @route   PUT /api/orders/:id/refund
// @access  Private/Admin
export const manualRefund = async (req, res) => {
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
};

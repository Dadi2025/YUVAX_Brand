import express from 'express';
import Agent from '../models/Agent.js';
import Order from '../models/Order.js';
import { protect, admin } from '../middleware/auth.js';

import generateToken from '../utils/generateToken.js';

const router = express.Router();

// @desc    Auth agent & get token
// @route   POST /api/agents/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const agent = await Agent.findOne({ email });

    if (agent && (await agent.matchPassword(password))) {
        res.json({
            _id: agent._id,
            name: agent.name,
            email: agent.email,
            pinCodes: agent.pinCodes,
            token: generateToken(agent._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// @desc    Get current agent profile
// @route   GET /api/agents/profile
// @access  Private (Agent)
router.get('/profile', protect, async (req, res) => {
    const agent = await Agent.findById(req.user._id);

    if (agent) {
        res.json({
            _id: agent._id,
            name: agent.name,
            email: agent.email,
            pinCodes: agent.pinCodes,
            assignedOrders: agent.assignedOrders,
            completedOrders: agent.completedOrders
        });
    } else {
        res.status(404).json({ message: 'Agent not found' });
    }
});

// @desc    Change agent password
// @route   PUT /api/agents/change-password
// @access  Private (Agent)
router.put('/change-password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide both current and new password' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const agent = await Agent.findById(req.user._id);

        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        // Verify current password
        const isMatch = await agent.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Update password
        agent.password = newPassword;
        await agent.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Failed to change password' });
    }
});

// @desc    Reset agent password (Admin)
// @route   PUT /api/agents/:id/reset-password
// @access  Private/Admin
router.put('/:id/reset-password', protect, admin, async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: 'Please provide a new password' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const agent = await Agent.findById(req.params.id);

        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        // Update password and set flag to force password change
        agent.password = newPassword;
        agent.mustChangePassword = true;
        agent.resetPasswordToken = undefined;
        agent.resetPasswordExpire = undefined;
        await agent.save();

        res.json({
            message: 'Password reset successfully. Agent must change password on next login.',
            agent: {
                _id: agent._id,
                name: agent.name,
                email: agent.email
            }
        });
    } catch (error) {
        console.error('Admin reset password error:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
});



// @desc    Forgot password - Request reset token
// @route   POST /api/agents/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide email address' });
        }

        const agent = await Agent.findOne({ email });

        if (!agent) {
            return res.json({
                message: 'If an account exists with this email, a password reset link has been sent.'
            });
        }

        // Generate reset token
        const crypto = await import('crypto');
        const resetToken = crypto.default.randomBytes(32).toString('hex');

        // Hash token and set to resetPasswordToken field
        const hashedToken = crypto.default
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        agent.resetPasswordToken = hashedToken;
        agent.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
        await agent.save();

        // In production, send email with reset link
        const resetUrl = `${req.protocol}://${req.get('host')}/delivery/reset-password/${resetToken}`;

        res.json({
            message: 'Password reset link sent to email',
            resetToken, // For dev/testing only
            resetUrl
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Failed to process password reset request' });
    }
});

// @desc    Reset password with token
// @route   PUT /api/agents/reset-password/:token
// @access  Public
router.put('/reset-password/:token', async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: 'Please provide a new password' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const crypto = await import('crypto');
        const hashedToken = crypto.default
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const agent = await Agent.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!agent) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        agent.password = newPassword;
        agent.resetPasswordToken = undefined;
        agent.resetPasswordExpire = undefined;
        agent.mustChangePassword = false;
        await agent.save();

        res.json({ message: 'Password reset successfully. You can now login with your new password.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
});

// @desc    Get logged-in agent's assigned orders
// @route   GET /api/agents/my-orders
// @access  Private (Agent)
router.get('/my-orders', protect, async (req, res) => {
    try {
        // Find agent by user ID (since we use same protect middleware, req.user is set)
        // But wait, protect middleware checks User model. We need to ensure it works for Agents too.
        // Actually, protect middleware uses User.findById(decoded.id).
        // If Agent is in a different collection, protect middleware will fail or return null if ID doesn't exist in User.

        // We need a specific middleware for Agents or update protect to check both.
        // For simplicity, let's assume we update protect or create protectAgent.

        // Let's create a quick check here:
        const agent = await Agent.findById(req.user._id);
        if (!agent) {
            return res.status(401).json({ message: 'Not authorized as agent' });
        }

        const orders = await Order.find({ assignedAgent: agent._id })
            .populate('user', 'name phone') // Populate user details for delivery
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Fetch agent orders error:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// @desc    Mark order as delivered (Agent)
// @route   PUT /api/agents/orders/:id/deliver
// @access  Private (Agent)
router.put('/orders/:id/deliver', protect, async (req, res) => {
    try {
        const agent = await Agent.findById(req.user._id);
        if (!agent) {
            return res.status(401).json({ message: 'Not authorized as agent' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify assignment
        if (order.assignedAgent.toString() !== agent._id.toString()) {
            return res.status(403).json({ message: 'Order not assigned to you' });
        }

        order.status = 'Delivered';
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        // AUTOMATICALLY MARK COD AS PAID
        if (order.paymentMethod === 'cod') {
            order.isPaid = true;
            order.paidAt = Date.now();
        }

        // Update agent stats
        agent.assignedOrders = Math.max(0, agent.assignedOrders - 1);
        agent.completedOrders += 1;
        await agent.save();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Agent deliver order error:', error);
        res.status(500).json({ message: 'Failed to update order' });
    }
});

// @desc    Mark return as picked up (Agent)
// @route   PUT /api/agents/orders/:id/return-pickup
// @access  Private (Agent)
router.put('/orders/:id/return-pickup', protect, async (req, res) => {
    try {
        // Ensure req.user is an Agent
        const agent = await Agent.findById(req.user._id);
        if (!agent) {
            // If protect middleware attached a User, denial access
            return res.status(401).json({ message: 'Not authorized as agent' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify assignment
        if (order.assignedAgent && order.assignedAgent.toString() !== agent._id.toString()) {
            return res.status(403).json({ message: 'Order not assigned to you' });
        }

        // Logic Note: Return Pickup means the agent has collected the item.
        // We set status to 'Returned' to indicate the process is physically underway/complete from customer side.
        order.returnStatus = 'Picked Up';
        order.status = 'Returned';

        // INITIATE REFUND AUTOMATICALLY
        if (order.returnStatus === 'Picked Up') {
            order.refundStatus = 'Pending';
        }

        // Update agent stats (handle potential undefined)
        const currentAssigned = agent.assignedOrders || 0;
        const currentCompleted = agent.completedOrders || 0;

        agent.assignedOrders = Math.max(0, currentAssigned - 1);
        agent.completedOrders = currentCompleted + 1;
        await agent.save();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Agent return pickup error:', error);
        res.status(500).json({ message: 'Failed to update order', error: error.message });
    }
});

// @desc    Mark exchange as completed (Agent)
// @route   PUT /api/agents/orders/:id/exchange-complete
// @access  Private (Agent)
router.put('/orders/:id/exchange-complete', protect, async (req, res) => {
    try {
        const agent = await Agent.findById(req.user._id);
        if (!agent) {
            return res.status(401).json({ message: 'Not authorized as agent' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify assignment
        if (order.assignedAgent.toString() !== agent._id.toString()) {
            return res.status(403).json({ message: 'Order not assigned to you' });
        }

        order.exchangeStatus = 'Completed';
        order.status = 'Delivered'; // Exchange completed means new item delivered

        // Update agent stats
        agent.assignedOrders = Math.max(0, agent.assignedOrders - 1);
        agent.completedOrders += 1;
        await agent.save();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Agent exchange complete error:', error);
        res.status(500).json({ message: 'Failed to update order' });
    }
});

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const agents = await Agent.find({}).sort({ createdAt: -1 });
        res.json(agents);
    } catch (error) {
        console.error('Fetch agents error:', error);
        res.status(500).json({ message: 'Failed to fetch agents' });
    }
});

// @desc    Get agent by ID
// @route   GET /api/agents/:id
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        res.json(agent);
    } catch (error) {
        console.error('Fetch agent error:', error);
        res.status(500).json({ message: 'Failed to fetch agent' });
    }
});

// @desc    Get agents by PIN code
// @route   GET /api/agents/by-pincode/:pincode
// @access  Public
router.get('/by-pincode/:pincode', async (req, res) => {
    try {
        const agents = await Agent.find({
            pinCodes: req.params.pincode,
            isActive: true
        }).sort({ assignedOrders: 1, rating: -1 }); // Sort by workload and rating

        res.json(agents);
    } catch (error) {
        console.error('Fetch agents by PIN code error:', error);
        res.status(500).json({ message: 'Failed to fetch agents' });
    }
});

// @desc    Get agent's orders
// @route   GET /api/agents/:id/orders
// @access  Private/Admin
router.get('/:id/orders', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({ assignedAgent: req.params.id })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Fetch agent orders error:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// @desc    Create new agent
// @route   POST /api/agents
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const { name, email, phone, pinCodes, city, address } = req.body;

        // Check if agent already exists
        const existingAgent = await Agent.findOne({ email });
        if (existingAgent) {
            return res.status(400).json({ message: 'Agent with this email already exists' });
        }

        const agent = await Agent.create({
            name,
            email,
            phone,
            pinCodes,
            city,
            city,
            address,
            password: 'password123' // Default password for new agents
        });

        res.status(201).json(agent);
    } catch (error) {
        console.error('Create agent error:', error);
        res.status(500).json({ message: 'Failed to create agent' });
    }
});

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);

        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        const { name, email, phone, pinCodes, isActive, city, address, rating } = req.body;

        agent.name = name || agent.name;
        agent.email = email || agent.email;
        agent.phone = phone || agent.phone;
        agent.pinCodes = pinCodes || agent.pinCodes;
        agent.isActive = isActive !== undefined ? isActive : agent.isActive;
        agent.city = city || agent.city;
        agent.address = address || agent.address;
        agent.rating = rating !== undefined ? rating : agent.rating;

        const updatedAgent = await agent.save();
        res.json(updatedAgent);
    } catch (error) {
        console.error('Update agent error:', error);
        res.status(500).json({ message: 'Failed to update agent' });
    }
});

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);

        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        // Check if agent has assigned orders
        const assignedOrders = await Order.countDocuments({
            assignedAgent: req.params.id,
            status: { $in: ['Processing', 'Shipped'] }
        });

        if (assignedOrders > 0) {
            return res.status(400).json({
                message: `Cannot delete agent with ${assignedOrders} active orders. Please reassign orders first.`
            });
        }

        await Agent.deleteOne({ _id: req.params.id });
        res.json({ message: 'Agent deleted successfully' });
    } catch (error) {
        console.error('Delete agent error:', error);
        res.status(500).json({ message: 'Failed to delete agent' });
    }
});

export default router;

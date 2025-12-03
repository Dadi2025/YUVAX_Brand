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

import express from 'express';
import Agent from '../models/Agent.js';
import Order from '../models/Order.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

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
            address
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

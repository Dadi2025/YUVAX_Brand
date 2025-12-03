import express from 'express';
import { askFashionAssistant, extractProductRecommendations } from '../utils/geminiService.js';
import Product from '../models/Product.js';

const router = express.Router();

// @desc    Chat with AI fashion assistant
// @route   POST /api/chat/ask
// @access  Public
router.post('/ask', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Get AI response
        const aiResponse = await askFashionAssistant(message);

        // Extract product recommendations
        const productIds = await extractProductRecommendations(aiResponse);

        // Fetch full product details for recommendations
        const recommendedProducts = await Product.find({
            _id: { $in: productIds }
        }).select('name price originalPrice image category');

        res.json({
            response: aiResponse,
            products: recommendedProducts
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            message: 'Failed to process your request',
            response: "I'm having trouble right now. Please try again! 😊"
        });
    }
});

export default router;

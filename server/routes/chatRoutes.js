import express from 'express';
import ChatMessage from '../models/ChatMessage.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Simple rule-based chatbot responses
const generateBotResponse = async (userMessage, userId) => {
    const message = userMessage.toLowerCase();
    let response = '';
    let productSuggestions = [];

    // Greeting
    if (message.match(/\b(hi|hello|hey|hola)\b/)) {
        response = "Hello! 👋 I'm your YUVA X shopping assistant. I can help you with:\n• Product recommendations\n• Size guidance\n• Order tracking\n• Return policies\n• Style advice\n\nWhat can I help you with today?";
    }
    // Product search
    else if (message.match(/\b(show|find|looking for|search|recommend)\b.*\b(jacket|shirt|pants|shoes|dress|hoodie|tshirt|t-shirt)\b/)) {
        const category = message.match(/jacket/) ? 'Jackets' :
            message.match(/shirt/) ? 'Shirts' :
                message.match(/pants/) ? 'Pants' :
                    message.match(/shoes/) ? 'Footwear' :
                        message.match(/dress/) ? 'Dresses' :
                            message.match(/hoodie/) ? 'Hoodies' : 'Tops';

        const products = await Product.find({ category }).limit(3);
        productSuggestions = products.map(p => p.id);
        response = `Here are some ${category.toLowerCase()} you might like! Check them out below. 👇`;
    }
    // Size guidance
    else if (message.match(/\b(size|sizing|fit|measurement)\b/)) {
        response = "📏 **Size Guide:**\n\n• **S**: Chest 36-38\", Waist 28-30\"\n• **M**: Chest 38-40\", Waist 30-32\"\n• **L**: Chest 40-42\", Waist 32-34\"\n• **XL**: Chest 42-44\", Waist 34-36\"\n\nNeed help finding your size? Use our Size Calculator on any product page!";
    }
    // Order tracking
    else if (message.match(/\b(order|track|delivery|shipping|when will)\b/)) {
        try {
            const recentOrder = await Order.findOne({ user: userId }).sort({ createdAt: -1 });
            if (recentOrder) {
                response = `📦 **Your Recent Order:**\n\nOrder #${recentOrder.orderNumber}\nStatus: ${recentOrder.status}\n${recentOrder.status === 'Delivered' ? '✅ Delivered!' : `Expected delivery: ${new Date(recentOrder.createdAt).toLocaleDateString()}`}\n\nCheck your profile for full order history!`;
            } else {
                response = "You don't have any orders yet. Browse our collection and find something you love! 🛍️";
            }
        } catch (err) {
            response = "You can track your orders from your profile page. Just click on 'My Orders'!";
        }
    }
    // Returns
    else if (message.match(/\b(return|refund|exchange|cancel)\b/)) {
        response = "🔄 **Easy Returns:**\n\n• 7-day return window\n• Free pickup from your doorstep\n• Full refund or exchange\n• No questions asked!\n\nGo to 'My Returns' in your profile to initiate a return.";
    }
    // Loyalty/Points
    else if (message.match(/\b(points|loyalty|rewards|earn)\b/)) {
        response = "⭐ **YUVA X Insider Program:**\n\n• Earn 10 points per ₹100 spent\n• 50 points for reviews\n• 200 points for referrals\n• Redeem for discounts!\n\nCheck your Loyalty Dashboard for details!";
    }
    // Style advice
    else if (message.match(/\b(style|fashion|trend|what to wear|outfit)\b/)) {
        response = "✨ **Style Tips:**\n\n• Cyberpunk aesthetic is IN!\n• Layer neon with dark basics\n• Oversized fits are trending\n• Don't forget accessories\n\nCheck out our 'Complete the Look' suggestions on product pages!";
    }
    // Trending
    else if (message.match(/\b(trending|popular|bestseller|hot)\b/)) {
        const trending = await Product.find({}).sort({ createdAt: -1 }).limit(3);
        productSuggestions = trending.map(p => p.id);
        response = "🔥 **Trending Now:**\n\nHere are our hottest items this week! Check them out below. 👇";
    }
    // Discounts/Sales
    else if (message.match(/\b(discount|sale|offer|deal|promo|coupon)\b/)) {
        response = "💰 **Current Offers:**\n\n• Flash Sales - Check homepage!\n• Spin & Win daily rewards\n• Referral bonuses up to ₹1000\n• Birthday month specials\n\nDon't miss out!";
    }
    // Default
    else {
        response = "I'm here to help! You can ask me about:\n• Product recommendations\n• Size guidance\n• Order tracking\n• Returns & exchanges\n• Loyalty points\n• Current offers\n\nWhat would you like to know?";
    }

    return { response, productSuggestions };
};

// @desc    Send a chat message
// @route   POST /api/chat/message
// @access  Private
router.post('/message', protect, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Save user message
        const userMsg = await ChatMessage.create({
            user: req.user._id,
            message: message.trim(),
            sender: 'user'
        });

        // Generate bot response
        const { response, productSuggestions } = await generateBotResponse(message, req.user._id);

        // Save bot response
        const botMsg = await ChatMessage.create({
            user: req.user._id,
            message: response,
            sender: 'bot',
            productSuggestions
        });

        // Return both messages
        res.json({
            userMessage: userMsg,
            botMessage: botMsg
        });
    } catch (error) {
        console.error('Chat message error:', error);
        res.status(500).json({ message: 'Failed to process message' });
    }
});

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;

        const messages = await ChatMessage.find({ user: req.user._id })
            .sort({ timestamp: -1 })
            .limit(limit);

        res.json(messages.reverse()); // Return in chronological order
    } catch (error) {
        console.error('Chat history error:', error);
        res.status(500).json({ message: 'Failed to fetch chat history' });
    }
});

// @desc    Clear chat history
// @route   DELETE /api/chat/clear
// @access  Private
router.delete('/clear', protect, async (req, res) => {
    try {
        await ChatMessage.deleteMany({ user: req.user._id });
        res.json({ message: 'Chat history cleared' });
    } catch (error) {
        console.error('Clear chat error:', error);
        res.status(500).json({ message: 'Failed to clear chat history' });
    }
});

export default router;

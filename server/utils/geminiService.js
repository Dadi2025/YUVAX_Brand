import { GoogleGenerativeAI } from '@google/generative-ai';
import Product from '../models/Product.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Get AI-powered fashion recommendations
 * @param {string} userMessage - User's query
 * @returns {Promise<string>} AI response
 */
export const askFashionAssistant = async (userMessage) => {
    try {
        // Fetch available products for context
        const products = await Product.find({ countInStock: { $gt: 0 } })
            .select('name category price originalPrice description sizes colors')
            .limit(50)
            .lean();

        // Format product catalog for AI
        const productContext = products.map(p =>
            `${p.name} (${p.category}) - ₹${p.price} ${p.originalPrice > p.price ? `(was ₹${p.originalPrice})` : ''} - Available in sizes: ${p.sizes?.join(', ')} - Colors: ${p.colors?.join(', ')}`
        ).join('\n');

        // System prompt
        const systemPrompt = `You are YUVA, a friendly and enthusiastic fashion assistant for YUVA X, an online clothing store in India.

Your role:
- Help users find the perfect outfit based on their needs
- Be conversational and ask clarifying questions when needed
- Recommend 2-3 products maximum per response
- Always mention product name, price in ₹, and why it matches their request
- Keep responses concise and friendly

Available Products:
${productContext}

Guidelines:
- If user asks about budget, filter products accordingly
- If user mentions occasion (party, office, casual), suggest appropriate items
- If no products match exactly, suggest closest alternatives
- Use emojis sparingly to keep it friendly 😊`;

        // Initialize model
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: systemPrompt
        });

        // Generate response
        const result = await model.generateContent(userMessage);
        const response = result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Gemini API error:', error);

        // Fallback response
        if (error.message?.includes('API_KEY')) {
            return "I'm having trouble connecting right now. Please make sure the Gemini API key is configured correctly. 🔧";
        }

        return "I'm having a moment! 😅 Could you try asking that again?";
    }
};

/**
 * Extract product recommendations from AI response
 * @param {string} aiResponse - AI generated response
 * @param {Array} products - Available products
 * @returns {Array} Matched product IDs
 */
export const extractProductRecommendations = async (aiResponse) => {
    try {
        // Find product names mentioned in the response
        const products = await Product.find({ countInStock: { $gt: 0 } })
            .select('name')
            .lean();

        const recommendedProducts = [];

        for (const product of products) {
            // Case-insensitive search for product name in response
            if (aiResponse.toLowerCase().includes(product.name.toLowerCase())) {
                recommendedProducts.push(product._id);
            }
        }

        return recommendedProducts.slice(0, 3); // Max 3 recommendations
    } catch (error) {
        console.error('Error extracting recommendations:', error);
        return [];
    }
};

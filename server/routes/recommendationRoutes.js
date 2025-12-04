import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import UserBehavior from '../models/UserBehavior.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Track product view
// @route   POST /api/recommendations/track-view
// @access  Private (optional - can work for guests too)
router.post('/track-view', async (req, res) => {
    try {
        const { productId, duration = 0 } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID required' });
        }

        // Only track if user is logged in
        if (req.user) {
            let behavior = await UserBehavior.findOne({ user: req.user._id });

            if (!behavior) {
                behavior = new UserBehavior({ user: req.user._id });
            }

            // Add view to history (limit to last 100 views)
            behavior.productViews.unshift({
                product: productId,
                viewedAt: new Date(),
                duration
            });

            if (behavior.productViews.length > 100) {
                behavior.productViews = behavior.productViews.slice(0, 100);
            }

            behavior.lastUpdated = new Date();
            await behavior.save();
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Track view error:', error);
        res.status(500).json({ message: 'Failed to track view' });
    }
});

// @desc    Get personalized recommendations
// @route   GET /api/recommendations/for-you
// @access  Private
router.get('/for-you', protect, async (req, res) => {
    try {
        const behavior = await UserBehavior.findOne({ user: req.user._id });
        let recommendations = [];

        if (behavior && behavior.productViews.length > 0) {
            // Get recently viewed product IDs
            const viewedProductIds = behavior.productViews
                .slice(0, 10)
                .map(v => v.product);

            // Get products from same categories
            const viewedProducts = await Product.find({
                id: { $in: viewedProductIds }
            }).select('category');

            const categories = [...new Set(viewedProducts.map(p => p.category))];

            // Find similar products
            recommendations = await Product.find({
                category: { $in: categories },
                id: { $nin: viewedProductIds }
            }).limit(8);
        }

        // Fallback to trending if no behavior
        if (recommendations.length === 0) {
            recommendations = await Product.find({})
                .sort({ createdAt: -1 })
                .limit(8);
        }

        res.json(recommendations);
    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ message: 'Failed to get recommendations' });
    }
});

// @desc    Get similar products
// @route   GET /api/recommendations/similar/:productId
// @access  Public
router.get('/similar/:productId', async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const product = await Product.findOne({ id: productId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find products in same category, excluding current product
        const similar = await Product.find({
            category: product.category,
            id: { $ne: productId }
        }).limit(4);

        res.json(similar);
    } catch (error) {
        console.error('Similar products error:', error);
        res.status(500).json({ message: 'Failed to get similar products' });
    }
});

// @desc    Get frequently bought together
// @route   GET /api/recommendations/frequently-bought/:productId
// @access  Public
router.get('/frequently-bought/:productId', async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);

        // Find orders containing this product
        const orders = await Order.find({
            'orderItems.product': productId
        }).limit(50);

        // Count co-occurrences
        const productCounts = {};

        orders.forEach(order => {
            order.orderItems.forEach(item => {
                if (item.product !== productId) {
                    productCounts[item.product] = (productCounts[item.product] || 0) + 1;
                }
            });
        });

        // Get top 3 most frequently bought together
        const topProductIds = Object.entries(productCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([id]) => parseInt(id));

        const products = await Product.find({ id: { $in: topProductIds } });

        res.json(products);
    } catch (error) {
        console.error('Frequently bought error:', error);
        res.status(500).json({ message: 'Failed to get frequently bought products' });
    }
});

// @desc    Get trending products
// @route   GET /api/recommendations/trending
// @access  Public
router.get('/trending', async (req, res) => {
    try {
        // Get products from recent orders (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentOrders = await Order.find({
            createdAt: { $gte: sevenDaysAgo }
        });

        // Count product occurrences
        const productCounts = {};

        recentOrders.forEach(order => {
            order.orderItems.forEach(item => {
                productCounts[item.product] = (productCounts[item.product] || 0) + 1;
            });
        });

        // Get top 8 trending products
        const trendingIds = Object.entries(productCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([id]) => parseInt(id));

        const trending = await Product.find({ id: { $in: trendingIds } });

        // Fallback to newest products if no recent orders
        if (trending.length === 0) {
            const fallback = await Product.find({})
                .sort({ createdAt: -1 })
                .limit(8);
            return res.json(fallback);
        }

        res.json(trending);
    } catch (error) {
        console.error('Trending products error:', error);
        res.status(500).json({ message: 'Failed to get trending products' });
    }
});

export default router;

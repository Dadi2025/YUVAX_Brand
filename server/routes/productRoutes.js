import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const productValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ max: 200 })
        .withMessage('Product name must be less than 200 characters'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),
    body('gender')
        .trim()
        .notEmpty()
        .withMessage('Gender is required'),
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
];

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error('Fetch products error:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Fetch product error:', error);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
});

// @desc    Get product recommendations (similar products)
// @route   GET /api/products/:id/recommendations
// @access  Public
router.get('/:id/recommendations', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find similar products in the same category, excluding the current product
        const recommendations = await Product.find({
            category: product.category,
            id: { $ne: req.params.id }
        })
            .limit(4)
            .sort({ createdAt: -1 });

        res.json(recommendations);
    } catch (error) {
        console.error('Fetch recommendations error:', error);
        res.status(500).json({ message: 'Failed to fetch recommendations' });
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, productValidation, async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    const { name, price, description, image, category, gender, sizes, colors, stock, originalPrice } = req.body;

    try {
        // Generate a simple numeric ID (in production use UUID or let Mongo handle it)
        // For now, finding max ID and incrementing to match current schema
        const lastProduct = await Product.findOne().sort({ id: -1 });
        const id = lastProduct ? lastProduct.id + 1 : 1;

        const product = new Product({
            id,
            name,
            price,
            user: req.user._id, // Use authenticated user
            image,
            category,
            gender,
            sizes,
            colors,
            countInStock: stock, // Mapping stock to countInStock
            numReviews: 0,
            description,
            originalPrice
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(400).json({ message: 'Failed to create product' });
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, productValidation, async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    const { name, price, description, image, category, gender, sizes, colors, stock, originalPrice } = req.body;

    try {
        const product = await Product.findOne({ id: req.params.id });

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.category = category || product.category;
            product.gender = gender || product.gender;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.countInStock = stock !== undefined ? stock : product.countInStock;
            product.originalPrice = originalPrice !== undefined ? originalPrice : product.originalPrice;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Update product error:', error);
        res.status(400).json({ message: 'Failed to update product' });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (product) {
            await Product.deleteOne({ id: req.params.id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
});

export default router;

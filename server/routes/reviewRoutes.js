import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import loyaltyService from '../utils/loyaltyService.js';

const router = express.Router();

// Configure multer for photo uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/reviews';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'review-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'));
        }
    }
});

// Validation rules
const reviewValidation = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('comment')
        .trim()
        .notEmpty()
        .withMessage('Review comment is required')
        .isLength({ max: 1000 })
        .withMessage('Comment must be less than 1000 characters')
];

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
router.get('/product/:productId', async (req, res) => {
    try {
        // :productId can be numeric ID or ObjectId
        // We need to find the Product _id first if it's numeric
        let product;
        if (req.params.productId.match(/^[0-9]+$/)) {
            product = await Product.findOne({ id: req.params.productId });
        } else {
            product = await Product.findById(req.params.productId);
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const reviews = await Review.find({ product: product._id })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        console.error('Fetch reviews error:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, upload.array('images', 3), reviewValidation, async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Clean up uploaded files if validation fails
        if (req.files) {
            req.files.forEach(file => fs.unlinkSync(file.path));
        }
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    const { product: productIdInput, rating, comment } = req.body;

    try {
        // Check if product exists (handle numeric ID or ObjectId)
        let product;
        // Assuming frontend sends numeric ID predominantly based on current Product schema
        // But let's support both.
        product = await Product.findOne({ id: productIdInput });
        if (!product && productIdInput.length === 24) {
            product = await Product.findById(productIdInput);
        }

        if (!product) {
            if (req.files) {
                req.files.forEach(file => fs.unlinkSync(file.path));
            }
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            user: req.user._id,
            product: product._id
        });

        if (existingReview) {
            if (req.files) {
                req.files.forEach(file => fs.unlinkSync(file.path));
            }
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        // Get image paths
        const images = req.files ? req.files.map(file => `/${file.path.replace(/\\/g, '/')}`) : [];

        const review = new Review({
            user: req.user._id,
            product: product._id,
            rating: parseInt(rating),
            comment,
            images
        });

        const createdReview = await review.save();

        // Update product rating
        await updateProductRating(product._id);

        // Populate user data before sending response
        await createdReview.populate('user', 'name');

        // Award loyalty points for the review
        try {
            await loyaltyService.awardReviewPoints(req.user._id, createdReview._id);
        } catch (pointsError) {
            console.error('Error awarding review points:', pointsError);
        }

        res.status(201).json(createdReview);
    } catch (error) {
        console.error('Create review error:', error);
        if (req.files) {
            req.files.forEach(file => fs.unlinkSync(file.path));
        }
        res.status(400).json({ message: 'Failed to create review' });
    }
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
router.put('/:id', protect, reviewValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    const { rating, comment } = req.body;

    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns this review
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        const updatedReview = await review.save();

        // Update product rating
        await updateProductRating(review.product);

        await updatedReview.populate('user', 'name');

        res.json(updatedReview);
    } catch (error) {
        console.error('Update review error:', error);
        res.status(400).json({ message: 'Failed to update review' });
    }
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns this review
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        const productId = review.product;

        // Delete associated images
        if (review.images && review.images.length > 0) {
            review.images.forEach(image => {
                const imagePath = image.substring(1); // Remove leading slash
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }

        await Review.deleteOne({ _id: req.params.id });

        // Update product rating
        await updateProductRating(productId);

        res.json({ message: 'Review removed' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ message: 'Failed to delete review' });
    }
});

// Helper function to update product rating
async function updateProductRating(productId) {
    try {
        // productId is ObjectId
        const reviews = await Review.find({ product: productId });

        const numReviews = reviews.length;
        const avgRating = numReviews > 0
            ? reviews.reduce((acc, review) => acc + review.rating, 0) / numReviews
            : 0;

        await Product.updateOne(
            { _id: productId }, // Find by _id now
            {
                rating: Math.round(avgRating * 10) / 10,
                numReviews: numReviews
            }
        );
    } catch (error) {
        console.error('Update product rating error:', error);
    }
}

export default router;

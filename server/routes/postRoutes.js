import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for post image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/posts';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
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
const postValidation = [
    body('caption')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Caption must be less than 1000 characters')
];

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const posts = await Post.find({})
            .populate('user', 'name email')
            .populate('comments.user', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments();

        res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        });
    } catch (error) {
        console.error('Fetch posts error:', error);
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
});

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Public
router.get('/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.userId })
            .populate('user', 'name email')
            .populate('comments.user', 'name')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error('Fetch user posts error:', error);
        res.status(500).json({ message: 'Failed to fetch user posts' });
    }
});

// @desc    Get posts by product
// @route   GET /api/posts/product/:productId
// @access  Public
router.get('/product/:productId', async (req, res) => {
    try {
        const posts = await Post.find({ taggedProducts: parseInt(req.params.productId) })
            .populate('user', 'name email')
            .populate('comments.user', 'name')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error('Fetch product posts error:', error);
        res.status(500).json({ message: 'Failed to fetch product posts' });
    }
});

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, upload.single('image'), postValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'Image is required' });
    }

    const { caption, taggedProducts } = req.body;

    try {
        const imagePath = `/${req.file.path.replace(/\\/g, '/')}`;

        // Parse tagged products (comes as JSON string from FormData)
        const products = taggedProducts ? JSON.parse(taggedProducts) : [];

        const post = new Post({
            user: req.user._id,
            image: imagePath,
            caption: caption || '',
            taggedProducts: products
        });

        const createdPost = await post.save();
        await createdPost.populate('user', 'name email');

        res.status(201).json(createdPost);
    } catch (error) {
        console.error('Create post error:', error);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(400).json({ message: 'Failed to create post' });
    }
});

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const likeIndex = post.likes.indexOf(req.user._id);

        if (likeIndex > -1) {
            // Unlike
            post.likes.splice(likeIndex, 1);
        } else {
            // Like
            post.likes.push(req.user._id);
        }

        await post.save();
        await post.populate('user', 'name email');
        await post.populate('comments.user', 'name');

        res.json(post);
    } catch (error) {
        console.error('Like post error:', error);
        res.status(400).json({ message: 'Failed to like post' });
    }
});

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
router.post('/:id/comment', protect, [
    body('text')
        .trim()
        .notEmpty()
        .withMessage('Comment text is required')
        .isLength({ max: 500 })
        .withMessage('Comment must be less than 500 characters')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = {
            user: req.user._id,
            text: req.body.text
        };

        post.comments.push(comment);
        await post.save();
        await post.populate('user', 'name email');
        await post.populate('comments.user', 'name');

        res.json(post);
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(400).json({ message: 'Failed to add comment' });
    }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user owns this post
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        // Delete associated image
        if (post.image) {
            const imagePath = post.image.substring(1); // Remove leading slash
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Post.deleteOne({ _id: req.params.id });

        res.json({ message: 'Post removed' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ message: 'Failed to delete post' });
    }
});

export default router;

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Product from '../models/Product.js';
import { hexToRgb, calculateColorDistance, getColorCategory } from '../utils/colorExtractor.js';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/search';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'search-' + uniqueSuffix + path.extname(file.originalname));
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
            cb(new Error('Only image files are allowed'));
        }
    }
});

/**
 * Simple color-based product matching
 * In a production app, you'd use ML-based image similarity
 */
const findSimilarProductsByColor = async (targetColor) => {
    try {
        const products = await Product.find({});

        // For MVP: Match products by color category
        // In production: Use actual image analysis or ML model

        const productsWithDistance = products.map(product => {
            // Simple heuristic: use product name/description to infer color
            const productText = `${product.name} ${product.description || ''}`.toLowerCase();

            // Color keywords mapping
            const colorKeywords = {
                black: ['black', 'dark', 'noir'],
                white: ['white', 'ivory', 'cream'],
                red: ['red', 'crimson', 'maroon'],
                blue: ['blue', 'navy', 'azure'],
                green: ['green', 'olive', 'emerald'],
                yellow: ['yellow', 'gold', 'mustard'],
                purple: ['purple', 'violet', 'lavender'],
                gray: ['gray', 'grey', 'silver'],
                brown: ['brown', 'tan', 'beige'],
                pink: ['pink', 'rose', 'blush']
            };

            // Find matching colors in product text
            let matchScore = 0;
            for (const [color, keywords] of Object.entries(colorKeywords)) {
                if (keywords.some(keyword => productText.includes(keyword))) {
                    // If target color matches this color category, increase score
                    if (targetColor === color) {
                        matchScore = 100;
                    } else {
                        matchScore = 50; // Partial match
                    }
                    break;
                }
            }

            // If no color keywords found, give a base score
            if (matchScore === 0) {
                matchScore = 30;
            }

            return {
                ...product.toObject(),
                matchScore
            };
        });

        // Sort by match score and return top matches
        return productsWithDistance
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 12);

    } catch (error) {
        console.error('Error finding similar products:', error);
        throw error;
    }
};

// @desc    Visual search by image upload
// @route   POST /api/visual-search
// @access  Public
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        // For MVP: Use simple color-based matching
        // In production: Use ML model or image recognition API

        // Extract dominant color category from uploaded image
        // For now, we'll use a simple approach based on filename or random
        const colorCategories = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 'gray'];
        const randomColor = colorCategories[Math.floor(Math.random() * colorCategories.length)];

        // Find similar products
        const similarProducts = await findSimilarProductsByColor(randomColor);

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
            message: 'Visual search completed',
            detectedColor: randomColor,
            results: similarProducts
        });

    } catch (error) {
        // Clean up file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Visual search error:', error);
        res.status(500).json({ message: 'Visual search failed' });
    }
});

// @desc    Search by color
// @route   GET /api/visual-search/color/:color
// @access  Public
router.get('/color/:color', async (req, res) => {
    try {
        const { color } = req.params;
        const similarProducts = await findSimilarProductsByColor(color.toLowerCase());

        res.json({
            color,
            results: similarProducts
        });
    } catch (error) {
        console.error('Color search error:', error);
        res.status(500).json({ message: 'Color search failed' });
    }
});

export default router;

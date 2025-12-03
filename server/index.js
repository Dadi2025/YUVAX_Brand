import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import postRoutes from './routes/postRoutes.js';
import visualSearchRoutes from './routes/visualSearchRoutes.js';
import pincodeRoutes from './routes/pincodeRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import { checkPriceDrops } from './utils/priceAlertService.js';
import { apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    process.exit(1);
}

connectDB();

// Start price drop checker (runs every 24 hours)
const startPriceDropChecker = () => {
    // Run immediately on startup
    checkPriceDrops();

    // Then run every 24 hours
    setInterval(checkPriceDrops, 24 * 60 * 60 * 1000);

    console.log('Price drop checker started (runs every 24 hours)');
};

startPriceDropChecker();

const app = express();

// Security Middleware
app.use(helmet()); // Set security headers

// CORS Configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Request Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize data to prevent MongoDB injection
app.use(mongoSanitize());

// Serve static files (for uploaded review images)
app.use('/uploads', express.static('uploads'));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'YUVAX API is running',
        version: '1.0.0',
        environment: process.env.NODE_ENV
    });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/visual-search', visualSearchRoutes);
app.use('/api/pincode', pincodeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/game', gameRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);

    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;

    res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

import app from './app.js';
import connectDB from './config/db.js';
import { checkPriceDrops } from './utils/priceAlertService.js';
import dotenv from 'dotenv';

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

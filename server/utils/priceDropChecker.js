import User from '../models/User.js';
import Product from '../models/Product.js';
import { sendPriceDropEmail } from './emailService.js';
import { sendPriceDropWhatsApp } from './priceAlertService.js';

export const checkPriceDrops = async () => {
    try {
        console.log('Checking for price drops...');

        // Get all users with wishlist items
        const users = await User.find({ 'wishlist.0': { $exists: true } });

        for (const user of users) {
            for (const wishlistItem of user.wishlist) {
                // Get current product price
                const product = await Product.findOne({ id: wishlistItem.productId });

                if (!product) continue;

                // Check if price has dropped
                if (wishlistItem.priceWhenAdded && product.price < wishlistItem.priceWhenAdded) {
                    console.log(`Price drop detected for ${product.name}: ₹${wishlistItem.priceWhenAdded} → ₹${product.price}`);

                    // Send email notification
                    if (user.email) {
                        await sendPriceDropEmail(
                            user.email,
                            user.name,
                            product,
                            wishlistItem.priceWhenAdded,
                            product.price
                        );
                    }

                    // Send WhatsApp notification
                    if (user.phone) {
                        await sendPriceDropWhatsApp(
                            user.phone,
                            product.name,
                            wishlistItem.priceWhenAdded,
                            product.price,
                            product.id
                        );
                    }

                    // Update the price in wishlist
                    wishlistItem.priceWhenAdded = product.price;
                    wishlistItem.notifiedAt = new Date();
                }
            }

            await user.save();
        }

        console.log('Price drop check completed');
    } catch (error) {
        console.error('Check price drops error:', error);
    }
};

// Run price check every 24 hours
export const startPriceDropChecker = () => {
    // Run immediately on startup
    checkPriceDrops();

    // Then run every 24 hours
    setInterval(checkPriceDrops, 24 * 60 * 60 * 1000);

    console.log('Price drop checker started (runs every 24 hours)');
};

export default { checkPriceDrops, startPriceDropChecker };

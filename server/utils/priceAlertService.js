/**
 * Price Alert Service
 * Monitors wishlist items for price drops and sends notifications
 */

import Product from '../models/Product.js';
import User from '../models/User.js';

/**
 * Check for price drops on wishlisted products
 * This would typically be run as a scheduled job (e.g., daily via cron)
 */
export const checkPriceDrops = async () => {
    try {
        console.log('Checking for price drops...');

        // Get all users with wishlists
        const users = await User.find({ 'wishlist.0': { $exists: true } });

        for (const user of users) {
            if (!user.wishlist || user.wishlist.length === 0) continue;

            // Check each wishlisted product
            for (const wishlistItem of user.wishlist) {
                // Handle both simple array (productId) and object format ({productId, ...})
                const productId = typeof wishlistItem === 'object' ? wishlistItem.productId : wishlistItem;

                const product = await Product.findOne({ id: productId });

                if (!product) continue;

                // Check if product has a price drop (originalPrice > current price)
                if (product.originalPrice && product.price < product.originalPrice) {
                    const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);

                    // Only notify if discount is significant (e.g., >= 10%)
                    if (discountPercent >= 10) {
                        await sendPriceDropNotification(user, product, discountPercent);
                    }
                }
            }
        }

        console.log('Price drop check completed');
    } catch (error) {
        console.error('Error checking price drops:', error);
    }
};

/**
 * Send price drop notification to user
 * @param {Object} user - User object
 * @param {Object} product - Product object
 * @param {Number} discountPercent - Discount percentage
 */
const sendPriceDropNotification = async (user, product, discountPercent) => {
    try {
        console.log(`Price drop alert for ${user.email}:`);
        console.log(`  Product: ${product.name}`);
        console.log(`  Discount: ${discountPercent}%`);
        console.log(`  New Price: ₹${product.price} (was ₹${product.originalPrice})`);

        // TODO: Implement actual email/WhatsApp notifications
        // For now, this is a placeholder that logs to console

        // Example email notification (would require email service like SendGrid/Nodemailer):
        // await sendEmail({
        //     to: user.email,
        //     subject: `Price Drop Alert: ${product.name}`,
        //     html: `
        //         <h2>Great News! 🎉</h2>
        //         <p>A product in your wishlist is now on sale!</p>
        //         <h3>${product.name}</h3>
        //         <p><strong>${discountPercent}% OFF</strong></p>
        //         <p>New Price: ₹${product.price} <s>₹${product.originalPrice}</s></p>
        //         <a href="${process.env.CLIENT_URL}/shop/${product.id}">View Product</a>
        //     `
        // });

        // Example WhatsApp notification (would require Twilio or similar):
        // await sendWhatsApp({
        //     to: user.phone,
        //     message: `🎉 Price Drop Alert!\n\n${product.name} is now ${discountPercent}% OFF!\n\nNew Price: ₹${product.price}\nWas: ₹${product.originalPrice}\n\nShop now: ${process.env.CLIENT_URL}/shop/${product.id}`
        // });

        return true;
    } catch (error) {
        console.error('Error sending price drop notification:', error);
        return false;
    }
};

/**
 * Manually trigger price drop check for a specific product
 * Useful when admin updates a product price
 */
export const checkProductPriceDrop = async (productId) => {
    try {
        const product = await Product.findOne({ id: productId });
        if (!product) return;

        // Find users who have this product in their wishlist
        const users = await User.find({ wishlist: productId });

        if (product.originalPrice && product.price < product.originalPrice) {
            const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);

            if (discountPercent >= 10) {
                for (const user of users) {
                    await sendPriceDropNotification(user, product, discountPercent);
                }
            }
        }
    } catch (error) {
        console.error('Error checking product price drop:', error);
    }
};

export default {
    checkPriceDrops,
    checkProductPriceDrop
};

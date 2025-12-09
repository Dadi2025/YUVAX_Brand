import User from '../models/User.js';
import PointsTransaction from '../models/PointsTransaction.js';

// Tier thresholds
const TIER_THRESHOLDS = {
    Bronze: 0,
    Silver: 5000,
    Gold: 15000
};

// Points earning rates
const POINTS_RATES = {
    PURCHASE: 0.1, // 10 points per ₹100 spent
    REVIEW: 50,
    REFERRAL: 200,
    SOCIAL_SHARE: 20,
    BIRTHDAY: 500,
    SIGNUP_BONUS: 100
};

// Cashback rates by tier
const CASHBACK_RATES = {
    Bronze: 0.01, // 1%
    Silver: 0.02, // 2%
    Gold: 0.03    // 3%
};

/**
 * Calculate user's loyalty tier based on total spent
 */
export const calculateTier = (totalSpent) => {
    if (totalSpent >= TIER_THRESHOLDS.Gold) return 'Gold';
    if (totalSpent >= TIER_THRESHOLDS.Silver) return 'Silver';
    return 'Bronze';
};

/**
 * Award points to a user
 */
export const awardPoints = async (userId, points, source, description, metadata = {}) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        // Create transaction record
        const transaction = await PointsTransaction.create({
            user: userId,
            points,
            type: 'earn',
            source,
            description,
            ...metadata
        });

        // Update user's loyalty points
        user.loyaltyPoints += points;
        await user.save();

        return { success: true, transaction, newBalance: user.loyaltyPoints };
    } catch (error) {
        console.error('Error awarding points:', error);
        throw error;
    }
};

/**
 * Redeem points for discount
 */
export const redeemPoints = async (userId, points) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        if (user.loyaltyPoints < points) {
            throw new Error('Insufficient points');
        }

        // Minimum redemption: 1000 points
        if (points < 1000) {
            throw new Error('Minimum redemption is 1000 points');
        }

        // Create transaction record
        const transaction = await PointsTransaction.create({
            user: userId,
            points: -points,
            type: 'redeem',
            source: 'manual',
            description: `Redeemed ${points} points for ₹${points / 10} discount`
        });

        // Update user's loyalty points
        user.loyaltyPoints -= points;
        await user.save();

        // Return discount amount (1000 points = ₹100)
        const discountAmount = points / 10;

        return {
            success: true,
            transaction,
            newBalance: user.loyaltyPoints,
            discountAmount,
            discountCode: `LOYALTY${Date.now()}`
        };
    } catch (error) {
        console.error('Error redeeming points:', error);
        throw error;
    }
};

/**
 * Reverse points for return/refund
 */
export const reversePurchasePoints = async (userId, refundAmount, orderId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        // Calculate points to reverse (same rate as earning: 10 points per 100)
        // Ensure we don't reverse more than what they have? 
        // No, balance can go negative theoretically if they spent them, 
        // OR we just deduct what we can. Let's allow negative for now or floor at 0.
        // Standard practice: Deduction happens regardless.
        const pointsToReverse = Math.floor(refundAmount * POINTS_RATES.PURCHASE);

        if (pointsToReverse <= 0) return { success: true, reversed: 0 };

        // Create transaction record
        const transaction = await PointsTransaction.create({
            user: userId,
            points: -pointsToReverse,
            type: 'deduct', // Or 'reverse'
            source: 'return',
            description: `Reversed ${pointsToReverse} points for refund`,
            metadata: { orderId }
        });

        // Update user's loyalty points
        user.loyaltyPoints -= pointsToReverse;
        // Optional: Prevent negative balance?
        // if (user.loyaltyPoints < 0) user.loyaltyPoints = 0; 

        await user.save();

        // Also handling legacy points field just in case
        if (user.points !== undefined) {
            user.points -= pointsToReverse;
            await user.save();
        }

        return { success: true, transaction, newBalance: user.loyaltyPoints };

    } catch (error) {
        console.error('Error reversing points:', error);
        // Don't throw, just log to prevent refund flow interruption
        return { success: false, error: error.message };
    }


};

/**
 * Refund redeemed points (credit back to user)
 */
export const refundRedeemedPoints = async (userId, points, orderId) => {
    try {
        if (!points || points <= 0) return { success: true, refunded: 0 };

        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        // Create transaction record
        const transaction = await PointsTransaction.create({
            user: userId,
            points: points,
            type: 'earn', // Technically earning them back
            source: 'return',
            description: `Refunded ${points} redeemed points from return`,
            metadata: { orderId }
        });

        // Update user's loyalty points
        user.loyaltyPoints += points;
        await user.save();

        // Legacy support (optional, but safe)
        if (user.points !== undefined) {
            user.points += points;
            await user.save();
        }

        return { success: true, transaction, newBalance: user.loyaltyPoints };
    } catch (error) {
        console.error('Error refunding redeemed points:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Award points for purchase
 */
export const awardPurchasePoints = async (userId, orderAmount, orderId) => {
    const points = Math.floor(orderAmount * POINTS_RATES.PURCHASE);
    return await awardPoints(
        userId,
        points,
        'purchase',
        `Earned ${points} points from order`,
        { orderId }
    );
};

/**
 * Award points for review
 */
export const awardReviewPoints = async (userId, reviewId) => {
    return await awardPoints(
        userId,
        POINTS_RATES.REVIEW,
        'review',
        `Earned ${POINTS_RATES.REVIEW} points for writing a review`,
        { reviewId }
    );
};

/**
 * Award points for referral
 */
export const awardReferralPoints = async (referrerId, referredUserId) => {
    return await awardPoints(
        referrerId,
        POINTS_RATES.REFERRAL,
        'referral',
        `Earned ${POINTS_RATES.REFERRAL} points for successful referral`
    );
};

/**
 * Award birthday bonus
 */
export const awardBirthdayBonus = async (userId) => {
    const user = await User.findById(userId);
    if (!user || !user.birthday) return null;

    const today = new Date();
    const birthday = new Date(user.birthday);

    // Check if it's birthday month
    if (today.getMonth() !== birthday.getMonth()) return null;

    // Check if already awarded this year
    if (user.lastBirthdayReward) {
        const lastReward = new Date(user.lastBirthdayReward);
        if (lastReward.getFullYear() === today.getFullYear()) {
            return null;
        }
    }

    // Award bonus
    const result = await awardPoints(
        userId,
        POINTS_RATES.BIRTHDAY,
        'birthday',
        `Happy Birthday! Earned ${POINTS_RATES.BIRTHDAY} bonus points`
    );

    // Update last birthday reward
    user.lastBirthdayReward = new Date();
    await user.save();

    return result;
};

/**
 * Update user tier based on total spent
 */
export const updateUserTier = async (userId, newTotalSpent) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const oldTier = user.loyaltyTier;
        const newTier = calculateTier(newTotalSpent);

        user.totalSpent = newTotalSpent;
        user.loyaltyTier = newTier;
        await user.save();

        // If tier upgraded, award bonus points
        if (newTier !== oldTier) {
            const bonusPoints = newTier === 'Gold' ? 1000 : 500;
            await awardPoints(
                userId,
                bonusPoints,
                'manual',
                `Tier upgraded to ${newTier}! Bonus ${bonusPoints} points`
            );
        }

        return { oldTier, newTier, upgraded: newTier !== oldTier };
    } catch (error) {
        console.error('Error updating user tier:', error);
        throw error;
    }
};

/**
 * Get user's points history
 */
export const getPointsHistory = async (userId, limit = 50) => {
    try {
        const transactions = await PointsTransaction.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('orderId', 'orderNumber')
            .populate('reviewId', 'product');

        return transactions;
    } catch (error) {
        console.error('Error fetching points history:', error);
        throw error;
    }
};

/**
 * Get tier perks
 */
export const getTierPerks = (tier) => {
    const perks = {
        Bronze: {
            cashback: '1%',
            freeShipping: false,
            earlyAccess: false,
            prioritySupport: false,
            birthdayDiscount: '10%',
            features: [
                'Earn 10 points per ₹100 spent',
                '1% cashback on purchases',
                '10% birthday month discount',
                'Points for reviews and referrals'
            ]
        },
        Silver: {
            cashback: '2%',
            freeShipping: true,
            earlyAccess: true,
            prioritySupport: false,
            birthdayDiscount: '15%',
            features: [
                'All Bronze benefits',
                '2% cashback on purchases',
                'Free shipping on all orders',
                'Early access to sales',
                '15% birthday month discount'
            ]
        },
        Gold: {
            cashback: '3%',
            freeShipping: true,
            earlyAccess: true,
            prioritySupport: true,
            birthdayDiscount: '20%',
            exclusiveProducts: true,
            stylingSession: true,
            features: [
                'All Silver benefits',
                '3% cashback on purchases',
                'Priority customer support',
                'Exclusive product access',
                'Free styling session',
                '20% birthday month discount',
                'Surprise gifts'
            ]
        }
    };

    return perks[tier] || perks.Bronze;
};

export default {
    calculateTier,
    awardPoints,
    redeemPoints,
    awardPurchasePoints,
    reversePurchasePoints,
    refundRedeemedPoints,
    awardReviewPoints,
    awardReferralPoints,
    awardBirthdayBonus,
    updateUserTier,
    getPointsHistory,
    getTierPerks,
    TIER_THRESHOLDS,
    POINTS_RATES,
    CASHBACK_RATES
};

import mongoose from 'mongoose';

const pointsTransactionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['earn', 'redeem', 'deduct'],
        required: true
    },
    source: {
        type: String,
        enum: ['purchase', 'review', 'referral', 'birthday', 'social_share', 'signup_bonus', 'spin_wheel', 'manual', 'return'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Index for faster queries
pointsTransactionSchema.index({ user: 1, createdAt: -1 });

const PointsTransaction = mongoose.model('PointsTransaction', pointsTransactionSchema);

export default PointsTransaction;

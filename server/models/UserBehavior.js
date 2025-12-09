import mongoose from 'mongoose';

const userBehaviorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    productViews: [{
        product: {
            type: Number, // Product ID
            required: true
        },
        viewedAt: {
            type: Date,
            default: Date.now
        },
        duration: {
            type: Number, // in seconds
            default: 0
        }
    }],
    searches: [{
        query: String,
        searchedAt: {
            type: Date,
            default: Date.now
        }
    }],
    categories: [String], // Frequently viewed categories
    priceRange: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100000
        }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries

userBehaviorSchema.index({ 'productViews.product': 1 });

const UserBehavior = mongoose.model('UserBehavior', userBehaviorSchema);

export default UserBehavior;

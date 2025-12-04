import mongoose from 'mongoose';

const flashSaleSchema = mongoose.Schema({
    product: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    flashPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    totalStock: {
        type: Number,
        required: true
    },
    remainingStock: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Virtual for checking if sale is currently active
flashSaleSchema.virtual('isActive').get(function () {
    const now = new Date();
    return this.active &&
        this.remainingStock > 0 &&
        now >= this.startTime &&
        now <= this.endTime;
});

// Virtual for time remaining
flashSaleSchema.virtual('timeRemaining').get(function () {
    const now = new Date();
    if (now > this.endTime) return 0;
    return Math.max(0, this.endTime - now);
});

// Index for faster queries
flashSaleSchema.index({ active: 1, startTime: 1, endTime: 1 });
flashSaleSchema.index({ product: 1 });

const FlashSale = mongoose.model('FlashSale', flashSaleSchema);

export default FlashSale;

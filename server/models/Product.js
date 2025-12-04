import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Keeping numeric ID for compatibility with frontend
    name: { type: String, required: true },
    category: { type: String, required: true },
    gender: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String, required: true },
    images: [{ type: String }],
    sizes: [{ type: String }],
    colors: [{ type: String }],
    description: { type: String },
    isNewArrival: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    availablePinCodes: [{ type: String }], // Empty array = available everywhere
    unavailablePinCodes: [{ type: String }], // Specific PIN codes where not available

    // Phase 2 Features
    sizeChart: [{
        size: { type: String, required: true },
        chest: { type: Number },
        waist: { type: Number },
        length: { type: Number },
        shoulder: { type: Number }
    }],
    completeTheLook: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
});

// Indexes for performance
productSchema.index({ id: 1 });
productSchema.index({ category: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ category: 1, gender: 1 }); // Compound index for common queries

const Product = mongoose.model('Product', productSchema);

export default Product;

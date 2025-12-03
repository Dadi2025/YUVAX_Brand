import mongoose from 'mongoose';

const serviceablePincodeSchema = mongoose.Schema({
    pincode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    deliveryDays: {
        type: Number,
        required: true,
        default: 5
    },
    isCodAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const ServiceablePincode = mongoose.model('ServiceablePincode', serviceablePincodeSchema);

export default ServiceablePincode;

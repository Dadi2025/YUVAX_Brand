import express from 'express';
import ServiceablePincode from '../models/ServiceablePincode.js';

const router = express.Router();

// @desc    Check pincode serviceability
// @route   GET /api/pincode/:code
// @access  Public
router.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;

        // Find in our database
        const pincodeData = await ServiceablePincode.findOne({ pincode: code });

        if (pincodeData) {
            return res.json({
                serviceable: true,
                city: pincodeData.city,
                state: pincodeData.state,
                deliveryDays: pincodeData.deliveryDays,
                isCodAvailable: pincodeData.isCodAvailable,
                message: `Delivers in ${pincodeData.deliveryDays} days`
            });
        }

        // If not in our DB, we can either reject or allow as "Standard Delivery"
        // For this robust system, let's reject if we want to be strict, 
        // OR allow but with longer delivery time if valid.
        // Let's allow generic valid pincodes with 7 days delivery.

        const response = await fetch(`https://api.postalpincode.in/pincode/${code}`);
        const data = await response.json();

        if (data && data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            return res.json({
                serviceable: true,
                city: postOffice.District,
                state: postOffice.State,
                deliveryDays: 7,
                isCodAvailable: false, // No COD for non-partnered areas
                message: 'Standard Delivery (7 days). COD not available.'
            });
        }

        res.status(404).json({
            serviceable: false,
            message: 'Pincode not serviceable'
        });

    } catch (error) {
        console.error('Pincode check error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

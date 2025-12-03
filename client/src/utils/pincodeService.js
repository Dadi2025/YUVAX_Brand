/**
 * Service to fetch address details from Pincode
 * Uses the free public API: https://api.postalpincode.in
 */

export const getAddressFromPincode = async (pincode) => {
    if (!pincode || pincode.length !== 6) {
        throw new Error('Invalid pincode');
    }

    try {
        // Call our backend API which handles both DB check and fallback
        const response = await fetch(`/api/pincode/${pincode}`);
        const data = await response.json();

        if (response.ok && data.serviceable) {
            return {
                city: data.city,
                state: data.state,
                country: 'India',
                deliveryDays: data.deliveryDays,
                isCodAvailable: data.isCodAvailable,
                message: data.message
            };
        } else {
            throw new Error(data.message || 'Pincode not serviceable');
        }
    } catch (error) {
        console.error('Error fetching address:', error);
        throw error;
    }
};

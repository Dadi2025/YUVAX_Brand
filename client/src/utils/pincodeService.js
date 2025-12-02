/**
 * Service to fetch address details from Pincode
 * Uses the free public API: https://api.postalpincode.in
 */

export const getAddressFromPincode = async (pincode) => {
    if (!pincode || pincode.length !== 6) {
        throw new Error('Invalid pincode');
    }

    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();

        if (data && data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            return {
                city: postOffice.District,
                state: postOffice.State,
                country: 'India'
            };
        } else {
            throw new Error('Invalid pincode or data not found');
        }
    } catch (error) {
        console.error('Error fetching address:', error);
        throw error;
    }
};

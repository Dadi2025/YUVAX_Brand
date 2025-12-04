import React, { useState, useEffect } from 'react';

const DeliveryEstimator = ({ pincode }) => {
    const [estimatedDate, setEstimatedDate] = useState('');
    const [deliveryDays, setDeliveryDays] = useState(0);

    useEffect(() => {
        // Calculate estimated delivery (3-7 business days from now)
        const days = Math.floor(Math.random() * 5) + 3; // 3-7 days
        setDeliveryDays(days);

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + days);

        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        setEstimatedDate(deliveryDate.toLocaleDateString('en-IN', options));
    }, [pincode]);

    return (
        <div className="delivery-estimator">
            <div className="delivery-estimator-title">
                🚚 Estimated Delivery
            </div>
            <div className="delivery-date">
                {estimatedDate}
            </div>
            <div className="delivery-note">
                Delivery in {deliveryDays} business days
            </div>
        </div>
    );
};

export default DeliveryEstimator;

import React, { useState, useEffect } from 'react';

const SocialProofNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [currentNotification, setCurrentNotification] = useState(null);

    // Sample data - in production, this would come from real-time data
    const sampleNotifications = [
        { name: 'Rahul S', location: 'Mumbai', product: 'Cyberpunk Hoodie', action: 'purchased' },
        { name: 'Priya K', location: 'Delhi', product: 'Neon Jacket', action: 'added to cart' },
        { name: 'Amit P', location: 'Bangalore', product: 'Tech Tee', action: 'purchased' },
        { name: 'Sneha M', location: 'Pune', product: 'Urban Joggers', action: 'purchased' },
        { name: 'Vikram R', location: 'Chennai', product: 'Street Hoodie', action: 'added to wishlist' },
    ];

    useEffect(() => {
        // Show a random notification every 8 seconds
        const interval = setInterval(() => {
            const randomNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
            setCurrentNotification(randomNotification);

            // Hide after 5 seconds
            setTimeout(() => {
                setCurrentNotification(null);
            }, 5000);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    if (!currentNotification) return null;

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('');
    };

    return (
        <div className="social-proof-notification">
            <div className="social-proof-avatar">
                {getInitials(currentNotification.name)}
            </div>
            <div className="social-proof-content">
                <div className="social-proof-name">{currentNotification.name}</div>
                <div className="social-proof-action">
                    {currentNotification.action} <span className="social-proof-product">{currentNotification.product}</span>
                </div>
                <div className="social-proof-action" style={{ fontSize: '0.7rem' }}>
                    📍 {currentNotification.location}
                </div>
            </div>
        </div>
    );
};

export default SocialProofNotification;

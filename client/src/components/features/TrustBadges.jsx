import React from 'react';

const TrustBadges = () => {
    const badges = [
        {
            icon: '🔒',
            title: 'Secure Payment',
            subtitle: '100% Protected'
        },
        {
            icon: '🚚',
            title: 'Free Shipping',
            subtitle: 'On orders over ₹999'
        },
        {
            icon: '↩️',
            title: 'Easy Returns',
            subtitle: '7 Days Return Policy'
        },
        {
            icon: '✓',
            title: 'Authentic Products',
            subtitle: '100% Original'
        }
    ];

    return (
        <div className="trust-badges">
            {badges.map((badge, index) => (
                <div key={index} className="trust-badge">
                    <div className="trust-badge-icon">{badge.icon}</div>
                    <div className="trust-badge-text">
                        <div className="trust-badge-title">{badge.title}</div>
                        <div className="trust-badge-subtitle">{badge.subtitle}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TrustBadges;

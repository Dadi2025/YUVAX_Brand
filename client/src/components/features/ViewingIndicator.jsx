import React, { useState, useEffect } from 'react';

const ViewingIndicator = ({ productId }) => {
    const [viewerCount, setViewerCount] = useState(0);

    useEffect(() => {
        // Simulate random viewer count between 5-50
        const randomCount = Math.floor(Math.random() * 45) + 5;
        setViewerCount(randomCount);

        // Update count every 10 seconds with slight variation
        const interval = setInterval(() => {
            const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
            setViewerCount(prev => Math.max(5, Math.min(50, prev + variation)));
        }, 10000);

        return () => clearInterval(interval);
    }, [productId]);

    return (
        <div className="viewing-indicator">
            <span className="viewing-indicator-dot"></span>
            <span>{viewerCount} people viewing this right now</span>
        </div>
    );
};

export default ViewingIndicator;

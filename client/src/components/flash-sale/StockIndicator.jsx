import React from 'react';

const StockIndicator = ({ total, sold }) => {
    const percentage = Math.min(100, Math.round((sold / total) * 100));
    const remaining = Math.max(0, total - sold);

    // Determine urgency color
    let color = '#ff0055'; // Default red
    if (percentage < 50) color = '#00ff00'; // Green if plenty stock
    else if (percentage < 80) color = '#ffaa00'; // Orange if getting low

    return (
        <div className="stock-indicator">
            <div className="stock-bar-bg">
                <div
                    className="stock-bar-fill"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                ></div>
            </div>
            <div className="stock-text">
                <span>{percentage}% Sold</span>
                <span>{remaining} Left</span>
            </div>
        </div>
    );
};

export default StockIndicator;

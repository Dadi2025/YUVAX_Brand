import React from 'react';

const StockUrgency = ({ stock }) => {
    if (!stock || stock > 10) return null;

    const isLow = stock <= 3;
    const className = `stock-urgency ${isLow ? 'low' : ''}`;
    const message = isLow
        ? `⚠️ Only ${stock} left in stock!`
        : `🔥 Only ${stock} left - Order soon!`;

    return (
        <div className={className}>
            {message}
        </div>
    );
};

export default StockUrgency;

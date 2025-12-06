import React from 'react';

const TopBar = () => {
    return (
        <div style={{
            background: '#000000',
            color: '#FFFFFF',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: '500',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            position: 'relative',
            zIndex: 1002
        }}>
            <span>Free Shipping on All Orders Over ₹999</span>
        </div>
    );
};

export default TopBar;

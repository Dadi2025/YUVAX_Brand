import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'var(--accent-cyan)' }) => {
    const sizeMap = {
        small: '20px',
        medium: '40px',
        large: '60px'
    };

    const spinnerSize = sizeMap[size] || sizeMap.medium;

    return (
        <div className="flex justify-center items-center p-4">
            <div
                style={{
                    width: spinnerSize,
                    height: spinnerSize,
                    border: `3px solid rgba(255, 255, 255, 0.1)`,
                    borderTop: `3px solid ${color}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}
            />
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default LoadingSpinner;

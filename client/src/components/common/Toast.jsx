import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const Toast = () => {
    const { toast } = useApp();

    if (!toast) return null;

    const bgColors = {
        success: '#00f3ff',
        error: '#ff3366',
        info: '#888888'
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: bgColors[toast.type] || bgColors.info,
            color: '#000',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 'bold',
            zIndex: 10000,
            animation: 'slideIn 0.3s ease',
            boxShadow: `0 4px 12px ${bgColors[toast.type]}40`
        }}>
            {toast.message}
        </div>
    );
};

export default Toast;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const MobileBottomNav = () => {
    const location = useLocation();
    const { getCartCount, wishlist } = useApp();

    const navItems = [
        { path: '/', icon: '🏠', label: 'Home' },
        { path: '/shop', icon: '🛍️', label: 'Shop' },
        { path: '/cart', icon: '🛒', label: 'Cart', badge: getCartCount() },
        { path: '/wishlist', icon: '♥', label: 'Wishlist', badge: wishlist.length },
        { path: '/profile', icon: '👤', label: 'Profile' }
    ];

    return (
        <nav className="mobile-bottom-nav">
            {navItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                    <div className="mobile-nav-icon">
                        {item.icon}
                        {item.badge > 0 && (
                            <span className="mobile-nav-badge">{item.badge}</span>
                        )}
                    </div>
                    <span className="mobile-nav-label">{item.label}</span>
                </Link>
            ))}
        </nav>
    );
};

export default MobileBottomNav;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../data/translations';
import VisualSearch from '../features/VisualSearch';
import './Navbar.css';

const Navbar = () => {
  const { getCartCount, wishlist, user, logout } = useApp();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Scroll detection for sticky header with debounce
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        setIsScrolled(window.scrollY > 50);
        timeoutId = null;
      }, 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Check if admin or agent is logged in
  const isAdminLoggedIn = localStorage.getItem('yuva-admin');
  const isAgentLoggedIn = localStorage.getItem('agent-token');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('yuva-admin');
    navigate('/admin/login');
    window.location.reload(); // Refresh to update navbar
  };

  const handleAgentLogout = () => {
    localStorage.removeItem('agent-token');
    localStorage.removeItem('agent-info');
    navigate('/delivery/login');
    window.location.reload(); // Refresh to update navbar
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container flex justify-between items-center h-full">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          YUVA<span className="navbar-logo-accent">X</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Collections</Link>
          <Link to="/style-wall" className="nav-link">Style Wall</Link>

          {/* Dashboard Links */}
          {user && <Link to="/profile" className="nav-link" style={{ color: 'var(--accent-cyan)' }}>📦 Orders</Link>}
          {user && <Link to="/profile" className="nav-link" style={{ color: 'var(--accent-purple)' }}>👤 My Account</Link>}
          {isAgentLoggedIn && <Link to="/delivery/dashboard" className="nav-link" style={{ color: 'var(--accent-cyan)' }}>📊 Dashboard</Link>}
          {isAdminLoggedIn && <Link to="/admin/dashboard" className="nav-link" style={{ color: 'var(--accent-purple)' }}>📊 Dashboard</Link>}
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center gap-6">
          {/* Search Icon */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="nav-link nav-icon-btn"
          >
            <span className="nav-icon">🔍</span>
          </button>

          {/* Visual Search Icon */}
          <button
            onClick={() => setShowVisualSearch(true)}
            className="nav-link nav-icon-btn"
            title="Visual Search"
          >
            <span className="nav-icon">📷</span>
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative nav-link flex items-center">
            <span className="nav-icon">♥</span>
            {wishlist.length > 0 && (
              <span className="nav-badge nav-badge-purple">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Referral (for logged-in users) */}
          {user && (
            <Link to="/referral" className="nav-link flex items-center gap-2">
              <span className="nav-icon">🎁</span>
              <span className="text-sm font-medium">Refer & Earn</span>
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative nav-link flex items-center">
            <span className="nav-icon">🛍</span>
            {getCartCount() > 0 && (
              <span className="nav-badge nav-badge-cyan">
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* Language Toggle */}
          <button
            onClick={() => changeLanguage(currentLanguage === 'en' ? 'hi' : 'en')}
            className="language-toggle"
          >
            {currentLanguage === 'en' ? 'हिं' : 'EN'}
          </button>

          {/* User Menu */}
          {user ? (
            <div className="user-menu-container">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="nav-link user-menu-btn"
              >
                <span className="nav-icon">👤</span>
                <span>{user.name}</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  {user.isAdmin && (
                    <Link to="/admin/dashboard" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                      Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Profile
                  </Link>
                  <Link to="/loyalty" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Loyalty Program
                  </Link>
                  <Link to="/returns" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                    My Returns
                  </Link>
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="user-dropdown-item text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Show logout for admin/agent, or login for neither
            isAdminLoggedIn ? (
              <button
                onClick={handleAdminLogout}
                className="logout-btn-primary"
              >
                Logout
              </button>
            ) : isAgentLoggedIn ? (
              <button
                onClick={handleAgentLogout}
                className="logout-btn-primary"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn-primary flex items-center h-9 px-4 text-sm">
                Login
              </Link>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white bg-transparent border-none text-2xl cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="search-overlay">
          <div className="container">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="search-input"
              />
              <button type="submit" className="btn-primary search-submit-btn">
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="btn-secondary search-close-btn"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full mobile-menu">
          <div className="mobile-menu-content">
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/shop" className="nav-link" onClick={() => setIsOpen(false)}>Collections</Link>
            <Link to="/style-wall" className="nav-link" onClick={() => setIsOpen(false)}>Style Wall</Link>
            <Link to="/cart" className="nav-link" onClick={() => setIsOpen(false)}>Cart ({getCartCount()})</Link>
            <Link to="/wishlist" className="nav-link" onClick={() => setIsOpen(false)}>Wishlist ({wishlist.length})</Link>
            {user ? (
              <>
                {user.isAdmin && (
                  <Link to="/admin/dashboard" className="nav-link" onClick={() => setIsOpen(false)}>Dashboard</Link>
                )}
                <Link to="/profile" className="nav-link" onClick={() => setIsOpen(false)}>Profile</Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="nav-link text-left bg-transparent border-none cursor-pointer">Logout</button>
              </>
            ) : (
              <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      )}

      {/* Visual Search Modal */}
      <VisualSearch
        isOpen={showVisualSearch}
        onClose={() => setShowVisualSearch(false)}
      />
    </nav>
  );
};

export default Navbar;

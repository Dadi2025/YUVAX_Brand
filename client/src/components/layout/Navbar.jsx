import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../data/translations';
import './Navbar.css';

const Navbar = () => {
  const { getCartCount, wishlist, user, logout } = useApp();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if admin or agent is logged in
  const isAdminLoggedIn = localStorage.getItem('yuva-admin');
  const isAgentLoggedIn = localStorage.getItem('agent-token');



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
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            NEO-INDIA
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8 nav-center">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/shop" className="nav-link">Collections</Link>
            <Link to="/style-wall" className="nav-link">Style Wall</Link>
            {user && (
              <Link to="/referral" className="nav-link" aria-label="Refer & Earn">
                Refer & Earn
              </Link>
            )}
          </div>

          {/* Right Utilities */}
          <div className="hidden md:flex items-center gap-6 nav-right">

            {/* Wishlist */}
            <Link to="/wishlist" className="nav-icon-btn relative" aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {wishlist.length > 0 && (
                <span className="nav-badge nav-badge-purple">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="nav-icon-btn relative" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {getCartCount() > 0 && (
                <span className="nav-badge nav-badge-cyan">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Dashboard Link (Conditionally Rendered) */}
            {(
              (isAgentLoggedIn && !isAdminLoggedIn && !user?.isAdmin) ||
              (isAdminLoggedIn)
            ) && (
                <Link to={isAdminLoggedIn ? "/admin/dashboard" : "/delivery/dashboard"} className="nav-icon-btn" aria-label="Dashboard">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </Link>
              )}

            {/* Account / User Menu */}
            {user ? (
              <div className="user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="nav-icon-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
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
              // Login / Logout buttons for Admin/Agent/Guest
              isAdminLoggedIn ? (
                <button onClick={handleAdminLogout} className="text-sm font-medium uppercase tracking-wide hover:text-red-500 transition-colors">Logout</button>
              ) : isAgentLoggedIn ? (
                <button onClick={handleAgentLogout} className="text-sm font-medium uppercase tracking-wide hover:text-red-500 transition-colors">Logout</button>
              ) : (
                <Link to="/login" className="btn-primary" style={{ padding: '8px 20px', height: '36px', fontSize: '12px' }}>
                  Login
                </Link>
              )
            )}

            {/* Language Toggle */}
            <button
              onClick={() => changeLanguage(currentLanguage === 'en' ? 'hi' : 'en')}
              className="language-toggle"
              style={{ marginLeft: '8px' }}
            >
              {currentLanguage === 'en' ? 'हिं' : 'EN'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-black bg-transparent border-none cursor-pointer p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* Global Search Overlay */}


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

      </nav>
    </>
  );
};

export default Navbar;

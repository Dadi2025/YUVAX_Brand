import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import VisualSearch from '../features/VisualSearch';

const Navbar = () => {
  const { getCartCount, wishlist, user, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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
    <nav className="navbar">
      <div className="container flex justify-between items-center h-full">
        {/* Logo */}
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>
          YUVA<span style={{ color: 'var(--accent-cyan)' }}>X</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Collections</Link>
          <Link to="/style-wall" className="nav-link">Style Wall</Link>
          <Link to="/spin-wheel" className="nav-link" style={{ color: 'var(--accent-cyan)' }}>🎁 Spin & Win</Link>
          <Link to="/feedback" className="nav-link">Feedback</Link>

          {/* Dashboard Links */}
          {user && <Link to="/profile" className="nav-link" style={{ color: 'var(--accent-purple)' }}>👤 My Account</Link>}
          {isAgentLoggedIn && <Link to="/delivery/dashboard" className="nav-link" style={{ color: 'var(--accent-cyan)' }}>📊 Dashboard</Link>}
          {isAdminLoggedIn && <Link to="/admin/dashboard" className="nav-link" style={{ color: 'var(--accent-purple)' }}>📊 Dashboard</Link>}
        </div>


        {/* Icons */}
        <div className="hidden md:flex items-center gap-6">
          {/* Search Icon */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="nav-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '1.25rem' }}>🔍</span>
          </button>

          {/* Visual Search Icon */}
          <button
            onClick={() => setShowVisualSearch(true)}
            className="nav-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            title="Visual Search"
          >
            <span style={{ fontSize: '1.25rem' }}>📷</span>
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative nav-link">
            <span style={{ fontSize: '1.25rem' }}>♥</span>
            {wishlist.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--accent-purple)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Referral (for logged-in users) */}
          {user && (
            <Link to="/referral" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🎁</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Refer & Earn</span>
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative nav-link">
            <span style={{ fontSize: '1.25rem' }}>🛍</span>
            {getCartCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--accent-cyan)',
                color: 'black',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="nav-link"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '1.25rem' }}>👤</span>
                <span>{user.name}</span>
              </button>
              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  minWidth: '150px',
                  zIndex: 1000
                }}>
                  {user.isAdmin && (
                    <Link to="/admin/dashboard" className="nav-link" style={{ display: 'block', padding: '0.75rem 1rem' }} onClick={() => setShowUserMenu(false)}>
                      Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="nav-link" style={{ display: 'block', padding: '0.75rem 1rem' }} onClick={() => setShowUserMenu(false)}>
                    Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="nav-link"
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer' }}
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
                className="btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: '#ff4444', border: 'none' }}
              >
                Logout
              </button>
            ) : isAgentLoggedIn ? (
              <button
                onClick={handleAgentLogout}
                className="btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: '#ff4444', border: 'none' }}
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Login
              </Link>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          background: 'var(--bg-dark)',
          borderTop: '1px solid var(--border-light)',
          padding: '1rem 0',
          zIndex: 999
        }}>
          <div className="container">
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '4px',
                  color: 'white',
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="btn-secondary"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full" style={{ background: 'var(--bg-dark)', borderTop: '1px solid var(--border-light)' }}>
          <div className="flex flex-col p-8 gap-6">
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
                <button onClick={() => { logout(); setIsOpen(false); }} className="nav-link" style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
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

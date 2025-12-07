import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Search, Camera } from 'lucide-react';
import TrustBadges from '../features/TrustBadges';
import VisualSearch from '../features/VisualSearch';

const Footer = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showVisualSearch, setShowVisualSearch] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    return (
        <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)', padding: '4rem 0 2rem 0', marginTop: 'auto' }}>
            <div className="container">
                {/* Search & Brand Section */}
                <div style={{ paddingBottom: '3rem', borderBottom: '1px solid var(--border-light)', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                    <div>
                        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', display: 'block', marginBottom: '0.5rem' }}>
                            NEO-INDIA
                        </Link>
                        <p style={{ color: 'var(--text-muted)' }}>The future of Indian streetwear.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: '4px', padding: '0.5rem 1rem', border: '1px solid var(--border-light)' }}>
                            <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '0.9rem', width: '200px' }}
                            />
                        </form>
                        <button
                            onClick={() => setShowVisualSearch(true)}
                            title="Visual Search using Camera"
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Camera size={20} color="var(--text-main)" />
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                    {/* Brand */}
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>About</h4>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Future-ready streetwear for the digital generation. Redefining style with tech and culture.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Shop</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link to="/shop" style={{ color: 'var(--text-muted)' }}>All Collections</Link>
                            <Link to="/shop?category=Men" style={{ color: 'var(--text-muted)' }}>Men</Link>
                            <Link to="/shop?category=Women" style={{ color: 'var(--text-muted)' }}>Women</Link>
                            <Link to="/shop?category=Accessories" style={{ color: 'var(--text-muted)' }}>Accessories</Link>
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Support</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link to="/track-order" style={{ color: 'var(--text-muted)' }}>Track Order</Link>
                            <Link to="/contact" style={{ color: 'var(--text-muted)' }}>Contact Us</Link>
                            <Link to="/faq" style={{ color: 'var(--text-muted)' }}>FAQ</Link>
                            <Link to="/feedback" style={{ color: 'var(--text-muted)' }}>Feedback</Link>
                            <Link to="/spin-wheel" style={{ color: 'var(--text-muted)' }}>🎁 Spin & Win</Link>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Company</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link to="/about" style={{ color: 'var(--text-muted)' }}>About Us</Link>
                            <Link to="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
                            <Link to="/terms" style={{ color: 'var(--text-muted)' }}>Terms of Service</Link>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <TrustBadges />

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <p>&copy; {new Date().getFullYear()} NEO-INDIA. All rights reserved.</p>
                </div>
            </div>


            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    background: '#25D366',
                    color: 'white',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                title="Chat with us on WhatsApp"
            >
                <MessageCircle size={32} />
            </a>
            {/* Visual Search Modal */}
            <VisualSearch
                isOpen={showVisualSearch}
                onClose={() => setShowVisualSearch(false)}
            />
        </footer>
    );
};

export default Footer;

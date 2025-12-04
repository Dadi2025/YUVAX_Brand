import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import TrustBadges from '../features/TrustBadges';

const Footer = () => {
    return (
        <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)', padding: '4rem 0 2rem 0', marginTop: 'auto' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                    {/* Brand */}
                    <div>
                        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', display: 'block', marginBottom: '1rem' }}>
                            YUVA<span style={{ color: 'var(--accent-cyan)' }}>X</span>
                        </Link>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Future-ready streetwear for the digital generation.
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
                    <p>&copy; {new Date().getFullYear()} YUVA X. All rights reserved.</p>
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
        </footer >
    );
};

export default Footer;

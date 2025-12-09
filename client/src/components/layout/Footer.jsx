import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Search, Camera, Instagram, Twitter, Youtube } from 'lucide-react';
import './Footer.css';

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
        <footer className="footer">
            <div className="container">
                {/* Search & Brand Section */}
                <div className="footer-top">
                    <div>
                        <Link to="/" className="footer-brand-link">
                            NEO-INDIA
                        </Link>
                        <p className="footer-tagline">The future of Indian streetwear.</p>
                    </div>

                    <div className="footer-search-group">
                        <form onSubmit={handleSearch} className="footer-search-form">
                            <Search size={18} color="rgba(255,255,255,0.5)" style={{ marginRight: '0.5rem' }} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="footer-search-input"
                            />
                        </form>
                        <button
                            onClick={() => setShowVisualSearch(true)}
                            title="Visual Search using Camera"
                            className="footer-cam-btn"
                        >
                            <Camera size={20} />
                        </button>
                    </div>
                </div>

                <div className="footer-grid">
                    {/* Brand */}
                    <div>
                        <h4 className="footer-col-title">About</h4>
                        <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', fontSize: '0.9rem' }}>
                            Future-ready streetwear for the digital generation. Redefining style with tech and culture.
                        </p>
                        <div className="footer-socials">
                            {/* Placeholder Socials if using Lucide, or just links */}
                            <a href="#" className="social-icon"><Instagram size={18} /></a>
                            <a href="#" className="social-icon"><Twitter size={18} /></a>
                            <a href="#" className="social-icon"><Youtube size={18} /></a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="footer-col-title">Shop</h4>
                        <div className="footer-links">
                            <Link to="/shop" className="footer-link">All Collections</Link>
                            <Link to="/shop?category=Men" className="footer-link">Men</Link>
                            <Link to="/shop?category=Women" className="footer-link">Women</Link>
                            <Link to="/shop?category=Accessories" className="footer-link">Accessories</Link>
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="footer-col-title">Support</h4>
                        <div className="footer-links">
                            <Link to="/track-order" className="footer-link">Track Order</Link>
                            <Link to="/contact" className="footer-link">Contact Us</Link>
                            <Link to="/faq" className="footer-link">FAQ</Link>
                            <Link to="/feedback" className="footer-link">Feedback</Link>
                            <Link to="/spin-wheel" className="footer-link">🎁 Spin & Win</Link>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="footer-col-title">Company</h4>
                        <div className="footer-links">
                            <Link to="/about" className="footer-link">About Us</Link>
                            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                            <Link to="/terms" className="footer-link">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} NEO-INDIA. All rights reserved.</p>
                </div>
            </div>


            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-float"
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

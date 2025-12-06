import React from 'react';
import './TrustBar.css';

const TrustBar = () => {
    return (
        <section className="trust-bar">
            <div className="container trust-grid">
                <div className="trust-item">
                    <span className="trust-icon">🚚</span>
                    <div className="trust-text">
                        <h3>Free Shipping</h3>
                        <p>On all orders over ₹999</p>
                    </div>
                </div>
                <div className="trust-item">
                    <span className="trust-icon">💵</span>
                    <div className="trust-text">
                        <h3>Cash on Delivery</h3>
                        <p>Pay when you receive</p>
                    </div>
                </div>
                <div className="trust-item">
                    <span className="trust-icon">↺</span>
                    <div className="trust-text">
                        <h3>Easy Returns</h3>
                        <p>7-day hassle-free returns</p>
                    </div>
                </div>
                <div className="trust-item">
                    <span className="trust-icon">🛡️</span>
                    <div className="trust-text">
                        <h3>100% Authentic</h3>
                        <p>Guaranteed original products</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustBar;

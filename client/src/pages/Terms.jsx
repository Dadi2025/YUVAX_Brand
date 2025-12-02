import React from 'react';

const Terms = () => {
    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>TERMS OF SERVICE</h1>

                    <div style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                        <p style={{ marginBottom: '1.5rem' }}>Last updated: December 2025</p>

                        <h3 style={{ color: 'white', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h3>
                        <p style={{ marginBottom: '1rem' }}>
                            By accessing and using YUVA X, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>

                        <h3 style={{ color: 'white', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. Use of Service</h3>
                        <p style={{ marginBottom: '1rem' }}>
                            You must be at least 18 years old to use our services. You agree not to use our products for any illegal or unauthorized purpose.
                        </p>

                        <h3 style={{ color: 'white', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. Products and Pricing</h3>
                        <p style={{ marginBottom: '1rem' }}>
                            We reserve the right to modify or discontinue any product at any time. Prices for our products are subject to change without notice.
                        </p>

                        <h3 style={{ color: 'white', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>4. Intellectual Property</h3>
                        <p style={{ marginBottom: '1rem' }}>
                            All content on this site, including text, graphics, logos, and images, is the property of YUVA X and protected by copyright laws.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;

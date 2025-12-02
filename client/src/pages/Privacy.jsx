import React from 'react';

const Privacy = () => {
    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>PRIVACY POLICY</h1>

                    <div style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                        <p style={{ marginBottom: '1.5rem' }}>Last updated: December 2025</p>

                        <h3 style={{ color: 'white', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h3>
                        <p style={{ marginBottom: '1rem' }}>
                            We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes your name, email address, phone number, and shipping address.
                        </p>

                        <h3 style={{ color: 'white', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Your Information</h3>
                        <p style={{ marginBottom: '1rem' }}>
                            We use the information we collect to process your orders, communicate with you, and improve our services. We do not sell your personal data to third parties.
                        </p>

                        <h3 style={{ color: 'white', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. Data Security</h3>
                        <p style={{ marginBottom: '1rem' }}>
                            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access or disclosure.
                        </p>

                        <h3 style={{ color: 'white', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>4. Cookies</h3>
                        <p style={{ marginBottom: '1rem' }}>
                            We use cookies to enhance your browsing experience and analyze site traffic. You can control cookie preferences through your browser settings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;

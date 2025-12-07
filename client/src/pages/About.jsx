import React from 'react';

const About = () => {
    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>ABOUT NEO-INDIA</h1>

                    <div style={{ marginBottom: '3rem' }}>
                        <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            NEO-INDIA is not just a clothing brand; it's a movement. Born in the digital age, we bridge the gap between streetwear culture and futuristic aesthetics.
                        </p>
                        <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                            Our mission is to empower the youth of India to express their unique identity through fashion that is bold, innovative, and unapologetically modern.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Innovation</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Pushing boundaries with tech-inspired designs and premium materials.</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-purple)' }}>Culture</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Deeply rooted in the pulse of modern India's youth culture.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;

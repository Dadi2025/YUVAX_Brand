import React from 'react';
import SpinWheelComponent from '../components/gamification/SpinWheel';

const SpinWheel = () => {
    return (
        <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    background: 'linear-gradient(to right, #00ffff, #ff00ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0.5rem'
                }}>
                    Spin & Win
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>Try your luck daily for exclusive rewards!</p>
            </div>
            <SpinWheelComponent />
        </div>
    );
};

export default SpinWheel;

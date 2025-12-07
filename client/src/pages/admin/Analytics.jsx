import React from 'react';
import DashboardStats from './DashboardStats';

const Analytics = () => {
    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Business Analytics</h2>
                <p style={{ color: 'var(--text-muted)' }}>Detailed breakdown of sales and order performance.</p>
            </div>

            <DashboardStats />

            {/* Placeholder for future advanced charts */}
            <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>More advanced charts and reports coming soon...</p>
            </div>
        </div>
    );
};

export default Analytics;

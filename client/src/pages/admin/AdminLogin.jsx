import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login, showToast, user } = useApp();
    const navigate = useNavigate();

    // If already logged in as admin, show dashboard link
    if (user && user.isAdmin) {
        return (
            <div style={{ minHeight: '100vh', paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>ALREADY LOGGED IN</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        You are currently logged in as <strong>{user.name}</strong>
                    </p>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="btn-primary"
                        style={{ width: '100%', marginBottom: '1rem' }}
                    >
                        GO TO DASHBOARD
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('yuva-admin');
                            // Also logout from context if needed, but for now just redirect
                            navigate('/admin/dashboard');
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Continue to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const userData = await login(credentials.email, credentials.password);

            // Check if user is admin
            if (userData.isAdmin) {
                localStorage.setItem('yuva-admin', 'true');
                // Clear any agent session to prevent confusion
                localStorage.removeItem('agent-token');
                localStorage.removeItem('agent-info');
                navigate('/admin/dashboard');
            } else {
                showToast('Access denied. Admin privileges required.', 'error');
                // Logout non-admin user
                localStorage.removeItem('yuva-admin');
            }
        } catch (error) {
            console.error('Admin login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB' }}>
            <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', background: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center', color: '#111827' }}>ADMIN LOGIN</h1>
                <p style={{ color: '#6B7280', textAlign: 'center', marginBottom: '2rem', fontSize: '0.875rem' }}>
                    Login with your admin account
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#374151', fontWeight: '600' }}>Email</label>
                        <input
                            type="email"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            required
                            autoComplete="email"
                            style={{ width: '100%', padding: '0.75rem', background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827', outline: 'none' }}
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#374151', fontWeight: '600' }}>Password</label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.75rem', background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827', outline: 'none' }}
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'LOGGING IN...' : 'LOGIN'}
                    </button>
                </form>
            </div>

            <div style={{ position: 'absolute', bottom: '2rem', textAlign: 'center', width: '100%' }}>
                <a href="/delivery/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                    Delivery Partner Login &rarr;
                </a>
            </div>
        </div>
    );
};

export default AdminLogin;

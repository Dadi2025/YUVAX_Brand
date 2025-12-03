import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Lock, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DeliveryLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useApp();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/agents/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('agent-token', data.token);
                localStorage.setItem('agent-info', JSON.stringify(data));
                showToast(`Welcome back, ${data.name}!`, 'success');
                navigate('/delivery/dashboard');
            } else {
                showToast(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            showToast('Something went wrong', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#121212',
            padding: '1rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: '#1e1e1e',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'rgba(0, 255, 255, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <Truck size={32} color="var(--accent-cyan)" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Delivery Partner</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Login to access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: '#2a2a2a',
                            border: '1px solid var(--border-light)',
                            borderRadius: '8px',
                            padding: '0.75rem'
                        }}>
                            <User size={20} color="var(--text-muted)" style={{ marginRight: '0.75rem' }} />
                            <input
                                type="email"
                                placeholder="Agent Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    width: '100%',
                                    outline: 'none'
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: '#2a2a2a',
                            border: '1px solid var(--border-light)',
                            borderRadius: '8px',
                            padding: '0.75rem'
                        }}>
                            <Lock size={20} color="var(--text-muted)" style={{ marginRight: '0.75rem' }} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    width: '100%',
                                    outline: 'none'
                                }}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'var(--accent-cyan)',
                            color: 'black',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DeliveryLogin;

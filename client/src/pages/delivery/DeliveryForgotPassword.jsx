import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Loader } from 'lucide-react';

const DeliveryForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/agents/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message);
                // For demo purposes, if token is returned (dev mode), show it
                if (data.resetUrl) {
                    console.log('Reset URL:', data.resetUrl);
                }
            } else {
                setStatus('error');
                setMessage(data.message || 'Failed to send reset link');
            }
        } catch (error) {
            setStatus('error');
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-dark)',
            padding: '1rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}>
                <Link to="/delivery/login" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem'
                }}>
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>Forgot Password?</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Enter your email to receive a reset link</p>
                </div>

                {status === 'success' ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'rgba(0, 243, 255, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem'
                        }}>
                            <Mail size={30} color="var(--accent-cyan)" />
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Check your email</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            We have sent a password reset link to <strong>{email}</strong>
                        </p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="btn-secondary"
                            style={{ width: '100%' }}
                        >
                            Try another email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your registered email"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem 0.75rem 3rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>

                        {status === 'error' && (
                            <div style={{
                                padding: '0.75rem',
                                background: 'rgba(255, 68, 68, 0.1)',
                                border: '1px solid rgba(255, 68, 68, 0.2)',
                                borderRadius: '8px',
                                color: '#ff4444',
                                marginBottom: '1.5rem',
                                fontSize: '0.875rem',
                                textAlign: 'center'
                            }}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="btn-primary"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            {status === 'loading' ? (
                                <>
                                    <Loader size={20} className="animate-spin" /> Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default DeliveryForgotPassword;

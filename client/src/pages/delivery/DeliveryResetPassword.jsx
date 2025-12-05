import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader, CheckCircle } from 'lucide-react';

const DeliveryResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch(`/api/agents/reset-password/${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPassword: password })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message);
                setTimeout(() => {
                    navigate('/delivery/login');
                }, 3000);
            } else {
                setStatus('error');
                setMessage(data.message || 'Failed to reset password');
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
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>Reset Password</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create a new password for your account</p>
                </div>

                {status === 'success' ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'rgba(0, 255, 157, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem'
                        }}>
                            <CheckCircle size={30} color="#00ff9d" />
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Password Reset Successful!</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            You can now login with your new password. Redirecting to login...
                        </p>
                        <Link
                            to="/delivery/login"
                            className="btn-primary"
                            style={{ display: 'block', width: '100%', textAlign: 'center' }}
                        >
                            Login Now
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 3rem 0.75rem 3rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
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
                                    <Loader size={20} className="animate-spin" /> Resetting...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default DeliveryResetPassword;

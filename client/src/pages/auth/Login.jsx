import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const Login = () => {
    const [loginMode, setLoginMode] = useState('email'); // 'email' or 'otp'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { login, showToast } = useApp();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            // Error is handled in context
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async () => {
        if (!phone.trim()) {
            setErrors({ phone: 'Phone number is required' });
            return;
        }
        if (!/^\d{10}$/.test(phone)) {
            setErrors({ phone: 'Phone number must be 10 digits' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/otp/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });
            const data = await response.json();
            if (response.ok) {
                setOtpSent(true);
                showToast(`OTP sent! (Test OTP: ${data.otp})`, 'success');
            } else {
                setErrors({ phone: data.message });
            }
        } catch (error) {
            setErrors({ phone: 'Failed to send OTP' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            setErrors({ otp: 'OTP is required' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/otp/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp })
            });
            const data = await response.json();
            if (response.ok) {
                // Use correct localStorage keys that match AppContext
                localStorage.setItem('yuva-token', data.token);
                const { token, ...userWithoutToken } = data;
                localStorage.setItem('yuva-user', JSON.stringify(userWithoutToken));
                showToast('Login successful!', 'success');
                // Reload to reinitialize AppContext with new user data
                window.location.href = '/';
            } else {
                setErrors({ otp: data.message });
            }
        } catch (error) {
            setErrors({ otp: 'Failed to verify OTP' });
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        // In a real app, this would redirect to the provider's OAuth URL
        // For now, we'll simulate a login or show a "Coming Soon" message
        showToast(`${provider} login coming soon!`, 'info');
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>WELCOME BACK</h1>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1rem' }}>Login to your account</p>

                {/* Login Mode Toggle */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '4px' }}>
                    <button
                        type="button"
                        onClick={() => { setLoginMode('email'); setErrors({}); }}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: loginMode === 'email' ? 'var(--accent-cyan)' : 'transparent',
                            color: loginMode === 'email' ? 'black' : 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                        }}
                    >
                        EMAIL
                    </button>
                    <button
                        type="button"
                        onClick={() => { setLoginMode('otp'); setErrors({}); setOtpSent(false); }}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: loginMode === 'otp' ? 'var(--accent-cyan)' : 'transparent',
                            color: loginMode === 'otp' ? 'black' : 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                        }}
                    >
                        MOBILE OTP
                    </button>
                </div>

                {loginMode === 'email' ? (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '4px',
                                    color: 'white',
                                    outline: 'none'
                                }}
                                placeholder="your@email.com"
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '4px',
                                    color: 'white',
                                    outline: 'none'
                                }}
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
                            {loading ? 'LOGGING IN...' : 'LOGIN'}
                        </button>

                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            Don't have an account? <Link to="/signup" style={{ color: 'var(--accent-cyan)' }}>Sign up</Link>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Mobile Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                maxLength={10}
                                disabled={otpSent}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${errors.phone ? '#ff4444' : 'var(--border-light)'}`,
                                    borderRadius: '4px',
                                    color: 'white',
                                    outline: 'none'
                                }}
                                placeholder="10-digit mobile number"
                            />
                            {errors.phone && <span style={{ color: '#ff4444', fontSize: '0.75rem' }}>{errors.phone}</span>}
                        </div>

                        {!otpSent ? (
                            <button type="button" onClick={handleSendOTP} className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                                {loading ? 'SENDING...' : 'SEND OTP'}
                            </button>
                        ) : (
                            <>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Enter OTP</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: `1px solid ${errors.otp ? '#ff4444' : 'var(--border-light)'}`,
                                            borderRadius: '4px',
                                            color: 'white',
                                            outline: 'none',
                                            letterSpacing: '0.5em',
                                            fontSize: '1.25rem',
                                            textAlign: 'center'
                                        }}
                                        placeholder="000000"
                                    />
                                    {errors.otp && <span style={{ color: '#ff4444', fontSize: '0.75rem' }}>{errors.otp}</span>}
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
                                    {loading ? 'VERIFYING...' : 'VERIFY & LOGIN'}
                                </button>
                                <button type="button" onClick={() => { setOtpSent(false); setOtp(''); }} className="btn-secondary" style={{ width: '100%' }}>
                                    RESEND OTP
                                </button>
                            </>
                        )}
                    </form>
                )}

                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>Or continue with</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => handleSocialLogin('Google')} className="btn-secondary" style={{ flex: 1, padding: '0.75rem' }}>Google</button>
                        <button onClick={() => handleSocialLogin('Facebook')} className="btn-secondary" style={{ flex: 1, padding: '0.75rem' }}>Facebook</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

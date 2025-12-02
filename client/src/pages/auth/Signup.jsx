import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { signup, showToast } = useApp();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for this field when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length > 100) {
            newErrors.name = 'Name must be less than 100 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Please fix the errors in the form', 'error');
            return;
        }

        setLoading(true);
        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...signupData } = formData;
            await signup(signupData);
            navigate('/');
        } catch (error) {
            // Error is handled in context
            console.error('Signup error:', error);
        } finally {
            setLoading(false);
        }
    };

    const ErrorMessage = ({ message }) => (
        message ? <span style={{ color: '#ff4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{message}</span> : null
    );

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>CREATE ACCOUNT</h1>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>Join the YUVA X community</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: `1px solid ${errors.name ? '#ff4444' : 'var(--border-light)'}`,
                                borderRadius: '4px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <ErrorMessage message={errors.name} />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: `1px solid ${errors.email ? '#ff4444' : 'var(--border-light)'}`,
                                borderRadius: '4px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <ErrorMessage message={errors.email} />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Phone (Optional)</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="10 digits"
                            maxLength={10}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: `1px solid ${errors.phone ? '#ff4444' : 'var(--border-light)'}`,
                                borderRadius: '4px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <ErrorMessage message={errors.phone} />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 6 characters"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: `1px solid ${errors.password ? '#ff4444' : 'var(--border-light)'}`,
                                borderRadius: '4px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <ErrorMessage message={errors.password} />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: `1px solid ${errors.confirmPassword ? '#ff4444' : 'var(--border-light)'}`,
                                borderRadius: '4px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <ErrorMessage message={errors.confirmPassword} />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
                        {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                    </button>

                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--accent-cyan)' }}>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const Feedback = () => {
    const { showToast } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'product',
        rating: 5,
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        showToast('Thank you for your feedback!', 'success');
        setFormData({ name: '', email: '', category: 'product', rating: 5, message: '' });
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>FEEDBACK</h1>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '3rem' }}>
                        We'd love to hear from you. Your feedback helps us improve.
                    </p>

                    <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '2rem' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white', outline: 'none' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white', outline: 'none' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
                            >
                                <option value="product">Product Quality</option>
                                <option value="service">Customer Service</option>
                                <option value="website">Website Experience</option>
                                <option value="delivery">Delivery</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Rating</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: star <= formData.rating ? 'var(--accent-cyan)' : 'var(--text-muted)' }}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                rows={5}
                                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white', outline: 'none' }}
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                            SUBMIT FEEDBACK
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Feedback;

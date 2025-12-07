import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Contact = () => {
    const { showToast } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        showToast('Message sent successfully! We will get back to you soon.', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>CONTACT US</h1>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Subject</label>
                                <select
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white' }}
                                >
                                    <option value="">Select a subject</option>
                                    <option value="Order">Order Issue</option>
                                    <option value="Product">Product Inquiry</option>
                                    <option value="Return">Return/Exchange</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Message</label>
                                <textarea
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white' }}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>SEND MESSAGE</button>
                        </form>
                    </div>

                    <div style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p>Email: support@neoindia.in</p>
                        <p>Phone: +91 98765 43210</p>
                        <p>Address: 123, Cyber City, Bangalore, India</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

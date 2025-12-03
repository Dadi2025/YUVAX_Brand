import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Package, MapPin, Phone, CheckCircle, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DeliveryDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const { showToast } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('agent-token');
        const agentInfo = localStorage.getItem('agent-info');

        if (!token || !agentInfo) {
            navigate('/delivery/login');
            return;
        }

        setAgent(JSON.parse(agentInfo));
        fetchAssignedOrders(token, JSON.parse(agentInfo)._id);
    }, []);

    const fetchAssignedOrders = async (token, agentId) => {
        try {
            // We need a specific endpoint for agent's own orders or use the existing one
            // Since we implemented GET /api/agents/:id/orders for admin, we can reuse it if we allow agent access
            // Or better, let's assume the backend allows agents to fetch their own orders via a new endpoint or existing one.
            // For now, let's try the admin one but we might need to update backend permissions.
            // Actually, let's use the one we planned: GET /api/agents/my-orders (Wait, I didn't implement that yet!)
            // I'll use the existing /api/agents/:id/orders but I need to ensure the backend allows it.
            // The backend route is: router.get('/:id/orders', protect, admin, ...) -> It requires ADMIN!

            // FIX: I need to update the backend to allow agents to fetch their own orders.
            // For now, I'll simulate it by fetching all orders and filtering client-side if I was admin, 
            // but I am not admin.

            // I will implement a new endpoint in the next step: router.get('/my-orders', protect, ...)
            // For now, let's assume it exists: /api/agents/my-orders

            const res = await fetch('/api/agents/my-orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            } else {
                // Fallback for demo if endpoint missing
                console.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('agent-token');
        localStorage.removeItem('agent-info');
        navigate('/delivery/login');
    };

    const markDelivered = async (orderId) => {
        if (!window.confirm('Mark this order as Delivered?')) return;

        try {
            const token = localStorage.getItem('agent-token');
            // We can use the existing order status update endpoint if we allow agents
            // PUT /api/orders/:id/status -> requires Admin
            // I need to update backend permissions or create a specific endpoint for agents.
            // Let's assume: PUT /api/agents/orders/:id/deliver

            const res = await fetch(`/api/agents/orders/${orderId}/deliver`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                showToast('Order marked as Delivered', 'success');
                // Refresh orders
                fetchAssignedOrders(token, agent._id);
            } else {
                showToast('Failed to update status', 'error');
            }
        } catch (error) {
            showToast('Error updating status', 'error');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('agent-token');
            const res = await fetch('/api/agents/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await res.json();

            if (res.ok) {
                showToast('Password changed successfully', 'success');
                setShowPasswordModal(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                showToast(data.message || 'Failed to change password', 'error');
            }
        } catch (error) {
            showToast('Error changing password', 'error');
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚚</div>
                <div style={{ color: 'var(--text-muted)' }}>Loading your deliveries...</div>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem', background: 'var(--bg-dark)' }}>
            <div className="container">
                {/* Header Card */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                    borderRadius: '16px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    boxShadow: '0 8px 32px rgba(0, 255, 255, 0.2)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem'
                            }}>
                                🚚
                            </div>
                            <div>
                                <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: 'black' }}>Hello, {agent?.name}!</h1>
                                <p style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '1rem' }}>Delivery Partner Dashboard</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.3)',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                color: 'black',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.875rem'
                            }}
                        >
                            🔒 Change Password
                        </button>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '1rem', borderRadius: '12px' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'black' }}>
                                {orders.length}
                            </div>
                            <div style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.875rem' }}>Total Assigned</div>
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '1rem', borderRadius: '12px' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'black' }}>
                                {orders.filter(o => o.status !== 'Delivered').length}
                            </div>
                            <div style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.875rem' }}>Pending Orders</div>
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '1rem', borderRadius: '12px' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'black' }}>
                                {orders.filter(o => o.status === 'Delivered').length}
                            </div>
                            <div style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.875rem' }}>Delivered Orders</div>
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '1rem', borderRadius: '12px' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'black' }}>
                                ₹{orders.reduce((acc, order) => (order.paymentMethod === 'cod' && order.status !== 'Delivered') ? acc + order.totalPrice : acc, 0)}
                            </div>
                            <div style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.875rem' }}>Cash to Collect</div>
                        </div>
                    </div>
                </div>

                {/* Orders Section */}
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package size={24} color="var(--accent-cyan)" />
                    Your Deliveries
                </h2>

                {orders.length === 0 ? (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '2px dashed var(--border-light)',
                        borderRadius: '16px',
                        padding: '4rem 2rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Deliveries Yet</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Orders will appear here when assigned to your area</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {orders.map(order => (
                            <div key={order._id} style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid var(--border-light)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 255, 255, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}>
                                {/* Order Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            fontFamily: 'monospace',
                                            fontWeight: 'bold',
                                            color: 'black'
                                        }}>
                                            #{order._id.slice(-6)}
                                        </div>
                                        <div style={{
                                            background: order.status === 'Delivered' ? '#4ade80' : 'var(--accent-cyan)',
                                            color: 'black',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            fontSize: '0.875rem'
                                        }}>
                                            {order.status === 'Delivered' ? '✓ Delivered' : '🚚 ' + order.status}
                                        </div>
                                    </div>
                                    <div style={{
                                        background: order.paymentMethod === 'cod' ? '#ffbb33' : '#4ade80',
                                        color: 'black',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        fontSize: '0.875rem'
                                    }}>
                                        {order.paymentMethod === 'cod' ? `💰 COD ₹${order.totalPrice}` : '✓ Prepaid'}
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                                        <MapPin size={20} color="var(--accent-cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.25rem' }}>
                                                {order.shippingAddress?.address}
                                            </div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Contact */}
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                    <a
                                        href={`tel:${order.user?.phone || '0000000000'}`}
                                        style={{
                                            flex: 1,
                                            background: 'var(--accent-purple)',
                                            color: 'white',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            fontWeight: 'bold',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <Phone size={18} />
                                        Call Customer
                                    </a>
                                </div>

                                {/* Action Button */}
                                {order.status !== 'Delivered' && (
                                    <button
                                        onClick={() => markDelivered(order._id)}
                                        style={{
                                            width: '100%',
                                            background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                                            color: 'black',
                                            border: 'none',
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <CheckCircle size={20} />
                                        Mark as Delivered
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{
                        background: '#1e1e1e',
                        padding: '2rem',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '400px',
                        border: '1px solid var(--accent-cyan)',
                        boxShadow: '0 8px 32px rgba(0, 255, 255, 0.3)'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>🔒 Change Password</h3>
                        <form onSubmit={handlePasswordChange}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: '#2a2a2a',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: '#2a2a2a',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: '#2a2a2a',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        background: 'none',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        background: 'var(--accent-cyan)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'black',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryDashboard;

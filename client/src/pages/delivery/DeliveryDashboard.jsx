import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Package, MapPin, Phone, CheckCircle, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DeliveryDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
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

    if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Loading...</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#121212', color: 'white' }}>
            {/* Header */}
            <div style={{
                padding: '1rem',
                background: '#1e1e1e',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Truck color="var(--accent-cyan)" />
                    <span style={{ fontWeight: 'bold' }}>Delivery Partner</span>
                </div>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ff4444' }}>
                    <LogOut size={20} />
                </button>
            </div>

            {/* Agent Info */}
            <div style={{ padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Hello, {agent?.name} 👋</h2>
                <p style={{ color: 'var(--text-muted)' }}>You have {orders.filter(o => o.status !== 'Delivered').length} active deliveries.</p>
            </div>

            {/* Orders List */}
            <div style={{ padding: '0 1rem 2rem' }}>
                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No assigned orders.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {orders.map(order => (
                            <div key={order._id} style={{
                                background: '#1e1e1e',
                                borderRadius: '8px',
                                padding: '1rem',
                                border: '1px solid var(--border-light)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontFamily: 'monospace'
                                    }}>
                                        #{order._id.slice(-6)}
                                    </span>
                                    <span style={{
                                        color: order.status === 'Delivered' ? '#4ade80' : 'var(--accent-cyan)',
                                        fontWeight: 'bold',
                                        fontSize: '0.875rem'
                                    }}>
                                        {order.status}
                                    </span>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <MapPin size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{order.shippingAddress?.address}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Phone size={18} color="var(--text-muted)" />
                                        <a href={`tel:${order.user?.phone || '0000000000'}`} style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                                            Call Customer
                                        </a>
                                    </div>
                                </div>

                                <div style={{
                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                    paddingTop: '1rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ fontSize: '0.9rem' }}>
                                        {order.paymentMethod === 'cod' ? (
                                            <span style={{ color: '#ffbb33' }}>Collect: ₹{order.totalPrice}</span>
                                        ) : (
                                            <span style={{ color: '#4ade80' }}>Prepaid</span>
                                        )}
                                    </div>

                                    {order.status !== 'Delivered' && (
                                        <button
                                            onClick={() => markDelivered(order._id)}
                                            style={{
                                                background: 'var(--accent-cyan)',
                                                color: 'black',
                                                border: 'none',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '4px',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <CheckCircle size={16} />
                                            Mark Delivered
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryDashboard;

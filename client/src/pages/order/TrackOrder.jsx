import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TrackOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useApp();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [submittingReturn, setSubmittingReturn] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${orderId}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
            } else {
                setError('Order not found');
            }
        } catch (err) {
            setError('Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    };

    const handleReturnRequest = async (e) => {
        e.preventDefault();
        if (!returnReason.trim()) {
            showToast('Please provide a reason for return', 'error');
            return;
        }

        setSubmittingReturn(true);
        try {
            const token = localStorage.getItem('yuva-token');
            const res = await fetch(`/api/orders/${orderId}/return`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason: returnReason })
            });

            const data = await res.json();

            if (res.ok) {
                setOrder(data);
                setShowReturnModal(false);
                showToast('Return requested successfully', 'success');
            } else {
                showToast(data.message || 'Failed to request return', 'error');
            }
        } catch (error) {
            showToast('Something went wrong', 'error');
        } finally {
            setSubmittingReturn(false);
        }
    };

    const getStatusSteps = () => {
        const steps = [
            { status: 'Processing', label: 'Order Placed', icon: Package, description: 'Your order has been received' },
            { status: 'Shipped', label: 'Shipped', icon: Truck, description: 'Your order is on the way' },
            { status: 'Delivered', label: 'Delivered', icon: CheckCircle, description: 'Order delivered successfully' }
        ];

        const currentStatusIndex = steps.findIndex(step => step.status === order?.status);

        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentStatusIndex,
            active: index === currentStatusIndex
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'var(--accent-cyan)';
            case 'Shipped': return 'var(--accent-purple)';
            case 'Delivered': return '#00ff00';
            case 'Cancelled': return '#ff4444';
            default: return 'var(--text-muted)';
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <Clock size={48} style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }} />
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div style={{ minHeight: '100vh', paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <Package size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Order Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error || 'The order you are looking for does not exist.'}</p>
                    <button onClick={() => navigate('/')} className="btn-primary">Go to Home</button>
                </div>
            </div>
        );
    }

    const statusSteps = getStatusSteps();
    const estimatedDelivery = new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000);

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                {/* Header */}
                <div style={{ marginBottom: '3rem' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        ← Back
                    </button>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Track Your Order</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Order ID: {order._id}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    {/* Left Column - Timeline */}
                    <div>
                        {/* Status Timeline */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '2rem', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Order Status</h2>

                            {/* Timeline */}
                            <div style={{ position: 'relative' }}>
                                {statusSteps.map((step, index) => {
                                    const Icon = step.icon;
                                    return (
                                        <div key={step.status} style={{ position: 'relative', paddingLeft: '4rem', paddingBottom: index < statusSteps.length - 1 ? '3rem' : '0' }}>
                                            {/* Vertical Line */}
                                            {index < statusSteps.length - 1 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    left: '1.5rem',
                                                    top: '3rem',
                                                    width: '2px',
                                                    height: 'calc(100% - 1rem)',
                                                    background: step.completed ? getStatusColor(step.status) : 'var(--border-light)'
                                                }} />
                                            )}

                                            {/* Icon Circle */}
                                            <div style={{
                                                position: 'absolute',
                                                left: '0',
                                                top: '0',
                                                width: '3rem',
                                                height: '3rem',
                                                borderRadius: '50%',
                                                background: step.completed ? getStatusColor(step.status) : 'rgba(255,255,255,0.05)',
                                                border: `2px solid ${step.completed ? getStatusColor(step.status) : 'var(--border-light)'}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                <Icon size={20} style={{ color: step.completed ? 'black' : 'var(--text-muted)' }} />
                                            </div>

                                            {/* Content */}
                                            <div>
                                                <h3 style={{
                                                    fontSize: '1.125rem',
                                                    marginBottom: '0.25rem',
                                                    color: step.completed ? 'white' : 'var(--text-muted)',
                                                    fontWeight: step.active ? 'bold' : 'normal'
                                                }}>
                                                    {step.label}
                                                    {step.active && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: getStatusColor(step.status) }}>• Current</span>}
                                                </h3>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{step.description}</p>
                                                {step.completed && (
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Estimated Delivery */}
                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,243,255,0.1)', border: '1px solid var(--accent-cyan)', borderRadius: '8px' }}>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Estimated Delivery</p>
                                    <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                                        {estimatedDelivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Order Items</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {order.orderItems.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: index < order.orderItems.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                                        <div>
                                            <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.name}</p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Size: {item.size} • Qty: {item.qty}</p>
                                        </div>
                                        <p style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}>₹{item.price * item.qty}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div>
                        {/* Order Summary */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '2rem', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Order Summary</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                                    <span>₹{order.itemsPrice}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                                    <span>₹{order.shippingPrice}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Tax</span>
                                    <span>₹{order.taxPrice}</span>
                                </div>
                                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--accent-cyan)' }}>₹{order.totalPrice}</span>
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Payment Method</p>
                                <p style={{ fontWeight: 'bold' }}>{order.paymentMethod}</p>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Delivery Address</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <MapPin size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '0.25rem' }} />
                                    <div>
                                        <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{order.shippingAddress.name}</p>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                            {order.shippingAddress.address}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                            {order.shippingAddress.postalCode}<br />
                                            {order.shippingAddress.country}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                                    <Phone size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                                    <p style={{ fontSize: '0.875rem' }}>{order.shippingAddress.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Return Action */}
                        {order.isDelivered && order.returnStatus === 'None' && (
                            <div style={{ marginTop: '2rem' }}>
                                <button
                                    onClick={() => setShowReturnModal(true)}
                                    className="btn-secondary"
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    <RotateCcw size={18} />
                                    Request Return
                                </button>
                            </div>
                        )}

                        {order.returnStatus !== 'None' && (
                            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <RotateCcw size={18} color="var(--accent-cyan)" />
                                    Return Status
                                </h3>
                                <p style={{ fontWeight: 'bold', color: order.returnStatus === 'Approved' ? '#00ff00' : order.returnStatus === 'Rejected' ? '#ff4444' : 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
                                    {order.returnStatus}
                                </p>
                                {order.returnReason && (
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Reason: {order.returnReason}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Return Modal */}
                {showReturnModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px', border: '1px solid var(--border-light)' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Request Return</h2>
                            <form onSubmit={handleReturnRequest}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Reason for Return</label>
                                    <textarea
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                        required
                                        rows="4"
                                        placeholder="Please explain why you want to return this item..."
                                        style={{
                                            width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white', resize: 'vertical'
                                        }}
                                    ></textarea>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowReturnModal(false)}
                                        className="btn-secondary"
                                        style={{ flex: 1 }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        style={{ flex: 1 }}
                                        disabled={submittingReturn}
                                    >
                                        {submittingReturn ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;

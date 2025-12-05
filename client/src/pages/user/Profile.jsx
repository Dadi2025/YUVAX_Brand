import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import OrderReturnModal from '../../components/returns/OrderReturnModal';

const Profile = () => {
    const { user, logout, getUserOrders } = useApp();
    const navigate = useNavigate();
    const [returnModalOrder, setReturnModalOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');

    if (!user) {
        navigate('/login');
        return null;
    }

    const userOrders = getUserOrders();

    // Check if order is eligible for return (delivered + within 14 days)
    const isReturnEligible = (order) => {
        if (order.status !== 'Delivered') return false;

        const deliveryDate = new Date(order.deliveredAt || order.createdAt);
        const daysSinceDelivery = Math.floor((new Date() - deliveryDate) / (1000 * 60 * 60 * 24));

        return daysSinceDelivery <= 14;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'var(--accent-cyan)';
            case 'Shipped': return 'var(--accent-purple)';
            case 'Delivered': return '#00ff00';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>MY PROFILE</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
                    {/* Sidebar */}
                    <div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '2rem' }}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent-cyan)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'black', fontWeight: 'bold' }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{user.name}</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user.email}</p>
                                <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(0,243,255,0.1)', borderRadius: '4px', display: 'inline-block' }}>
                                    <p style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', fontSize: '0.875rem' }}>
                                        {user.points || 0} Loyalty Points
                                    </p>
                                </div>
                            </div>
                            <button onClick={logout} className="btn-secondary" style={{ width: '100%' }}>
                                LOGOUT
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div>
                        {/* Personal Information */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '2rem', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Personal Information</h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Name</p>
                                    <p>{user.name}</p>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email</p>
                                    <p>{user.email}</p>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Phone</p>
                                    <p>{user.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order History */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Order History</h3>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {['All', 'Pending', 'Delivered', 'Returned'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status)}
                                            style={{
                                                background: filterStatus === status ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)',
                                                color: filterStatus === status ? 'black' : 'var(--text-muted)',
                                                border: 'none',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {userOrders.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {userOrders.filter(order => {
                                        if (filterStatus === 'All') return true;
                                        if (filterStatus === 'Pending') return ['Processing', 'Shipped'].includes(order.status);
                                        if (filterStatus === 'Delivered') return order.status === 'Delivered';
                                        if (filterStatus === 'Returned') return order.status === 'Returned' || order.returnStatus === 'Approved' || order.returnStatus === 'Completed';
                                        return true;
                                    }).map(order => (
                                        <div key={order._id || order.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                                <div>
                                                    <p style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Order #{order._id || order.id}</p>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                        {new Date(order.createdAt || order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>₹{order.totalPrice || order.total}</p>
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                        color: getStatusColor(order.status),
                                                        padding: '0.25rem 0.75rem',
                                                        border: `1px solid ${getStatusColor(order.status)}`,
                                                        borderRadius: '4px',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '1rem' }}>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Items ({(order.orderItems || order.items || []).length})</p>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {(order.orderItems || order.items || []).map((item, idx) => (
                                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                                            <span>{item.name} (Size: {item.size}) × {item.quantity}</span>
                                                            <span>₹{item.price * item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '1rem' }}>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Delivery Address</p>
                                                <p style={{ fontSize: '0.875rem' }}>
                                                    {order.shippingAddress.name}<br />
                                                    {order.shippingAddress.address}<br />
                                                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                                                    {order.shippingAddress.phone}
                                                </p>
                                            </div>

                                            <div style={{ marginTop: '1rem' }}>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                    Estimated Delivery: <span style={{ color: 'white', fontWeight: 'bold' }}>
                                                        {new Date(new Date(order.createdAt || order.date).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                </p>
                                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                    <button
                                                        onClick={() => navigate(`/track-order/${order._id || order.id}`)}
                                                        className="btn-primary"
                                                        style={{ flex: 1 }}
                                                    >
                                                        TRACK ORDER
                                                    </button>
                                                    {isReturnEligible(order) && (
                                                        <button
                                                            onClick={() => setReturnModalOrder(order)}
                                                            className="btn-secondary"
                                                            style={{ flex: 1 }}
                                                        >
                                                            RETURN/EXCHANGE
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No orders yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Return/Exchange Modal */}
            {returnModalOrder && (
                <OrderReturnModal
                    order={returnModalOrder}
                    onClose={() => setReturnModalOrder(null)}
                    onSuccess={() => {
                        // Optionally refresh orders or show success message
                        setReturnModalOrder(null);
                    }}
                />
            )}
        </div>
    );
};

export default Profile;

import React from 'react';
import { useApp } from '../../context/AppContext';

const ManageOrders = () => {
    const { orders, updateOrderStatus, fetchAllOrders, user, showToast } = useApp();
    const [filterStatus, setFilterStatus] = React.useState('All');

    React.useEffect(() => {
        if (user && user.isAdmin) {
            console.log('ManageOrders mounted, fetching orders...');
            fetchAllOrders();
        }
    }, [user]);

    React.useEffect(() => {
        console.log('Orders state updated:', orders.length, 'orders');
    }, [orders]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'var(--accent-purple)';
            case 'Shipped': return 'var(--accent-cyan)';
            case 'Delivered': return '#4ade80'; // Green
            case 'Cancelled': return '#ef4444'; // Red
            case 'Approved': return '#4ade80';
            case 'Rejected': return '#ef4444';
            case 'Requested': return '#facc15'; // Yellow
            default: return 'var(--text-muted)';
        }
    };

    const handleReturnStatusUpdate = async (orderId, status) => {
        try {
            const token = localStorage.getItem('yuva-token');
            const res = await fetch(`/api/orders/${orderId}/return-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                showToast(`Return request ${status}`, 'success');
                fetchAllOrders();
            } else {
                showToast('Failed to update return status', 'error');
            }
        } catch (error) {
            showToast('Something went wrong', 'error');
        }
    };

    const handleExchangeStatusUpdate = async (orderId, status) => {
        try {
            const token = localStorage.getItem('yuva-token');
            const res = await fetch(`/api/orders/${orderId}/exchange-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                showToast(`Exchange request ${status}`, 'success');
                fetchAllOrders();
            } else {
                showToast('Failed to update exchange status', 'error');
            }
        } catch (error) {
            showToast('Something went wrong', 'error');
        }
    };

    const handleRefund = async (orderId) => {
        if (!window.confirm('Are you sure you want to process this refund? This action cannot be undone.')) return;

        try {
            const token = localStorage.getItem('yuva-token');
            const res = await fetch(`/api/orders/${orderId}/refund`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                showToast('Refund processed successfully', 'success');
                fetchAllOrders();
            } else {
                const data = await res.json();
                showToast(data.message || 'Failed to process refund', 'error');
            }
        } catch (error) {
            showToast('Something went wrong', 'error');
        }
    };

    const handleSimulateCourier = async () => {
        try {
            const token = localStorage.getItem('yuva-token');
            const res = await fetch('/api/orders/simulate-courier', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                showToast(data.message, 'success');
                fetchAllOrders();
            } else {
                showToast('Simulation failed', 'error');
            }
        } catch (error) {
            showToast('Simulation error', 'error');
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filterStatus === 'All') return true;
        if (filterStatus === 'Pending') return ['Processing', 'Shipped'].includes(order.status);
        if (filterStatus === 'Delivered') return order.status === 'Delivered';
        if (filterStatus === 'Returned') return order.status === 'Returned' || order.returnStatus === 'Approved' || order.returnStatus === 'Completed';
        return true;
    });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Manage Orders ({filteredOrders.length})</h2>
                <button
                    onClick={handleSimulateCourier}
                    className="btn-secondary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                    🚚 Simulate Courier Updates
                </button>
            </div>

            {/* Stats Section */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div
                    onClick={() => setFilterStatus('All')}
                    style={{
                        background: filterStatus === 'All' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        border: `1px solid ${filterStatus === 'All' ? 'var(--accent-cyan)' : 'var(--border-light)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{orders.length}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Total Orders</div>
                </div>
                <div
                    onClick={() => setFilterStatus('Pending')}
                    style={{
                        background: filterStatus === 'Pending' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        border: `1px solid ${filterStatus === 'Pending' ? 'var(--accent-purple)' : 'var(--border-light)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--accent-purple)' }}>
                        {orders.filter(o => ['Processing', 'Shipped'].includes(o.status)).length}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>Pending</div>
                </div>
                <div
                    onClick={() => setFilterStatus('Delivered')}
                    style={{
                        background: filterStatus === 'Delivered' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        border: `1px solid ${filterStatus === 'Delivered' ? '#4ade80' : 'var(--border-light)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#4ade80' }}>
                        {orders.filter(o => o.status === 'Delivered').length}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>Delivered</div>
                </div>
                <div
                    onClick={() => setFilterStatus('Returned')}
                    style={{
                        background: filterStatus === 'Returned' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        border: `1px solid ${filterStatus === 'Returned' ? '#facc15' : 'var(--border-light)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#facc15' }}>
                        {orders.filter(o => o.status === 'Returned' || o.returnStatus === 'Approved' || o.returnStatus === 'Completed').length}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>Returned</div>
                </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Order ID</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Date</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Customer</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Items</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Total</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Return/Exchange</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
                            filteredOrders.map((order, index) => {
                                if (!order) return null;
                                const orderId = order._id || order.id || `order-${index}`;
                                const dateStr = order.createdAt || order.date;
                                const dateDisplay = dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';
                                const userId = order.user?._id || order.user?.id || order.user || order.userId || 'Unknown';
                                const items = order.orderItems || order.items || [];
                                const total = order.totalPrice || order.total || 0;

                                return (
                                    <tr key={orderId} style={{ borderTop: '1px solid var(--border-light)' }}>
                                        <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{orderId}</td>
                                        <td style={{ padding: '1rem' }}>{dateDisplay}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 'bold' }}>{order.user?.name || 'Unknown'}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                                            {order.user?.phone && (
                                                <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{order.user?.phone}</div>
                                            )}
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>ID: {userId}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {Array.isArray(items) && items.map((item, i) => (
                                                <div key={item._id || item.id || `item-${i}`} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                                    {item.quantity || 0}x {item.name || 'Item'} ({item.size || 'N/A'})
                                                </div>
                                            ))}
                                        </td>
                                        <td style={{ padding: '1rem' }}>₹{total}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                color: getStatusColor(order.status),
                                                fontWeight: 'bold',
                                                padding: '0.25rem 0.75rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                borderRadius: '4px',
                                                fontSize: '0.875rem'
                                            }}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {order.returnStatus && order.returnStatus !== 'None' && (
                                                <div style={{ marginBottom: '0.5rem' }}>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Return:</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ color: getStatusColor(order.returnStatus), fontWeight: 'bold' }}>{order.returnStatus}</span>
                                                        {order.returnStatus === 'Requested' && (
                                                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                                <button onClick={() => handleReturnStatusUpdate(orderId, 'Approved')} style={{ background: '#4ade80', border: 'none', borderRadius: '4px', padding: '0.25rem', cursor: 'pointer' }} title="Approve">✓</button>
                                                                <button onClick={() => handleReturnStatusUpdate(orderId, 'Rejected')} style={{ background: '#ef4444', border: 'none', borderRadius: '4px', padding: '0.25rem', cursor: 'pointer' }} title="Reject">✕</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {order.returnReason && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={order.returnReason}>{order.returnReason}</div>}

                                                    {/* Refund Controls */}
                                                    {order.returnStatus === 'Approved' && (
                                                        <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                                                            {order.refundStatus === 'Completed' ? (
                                                                <div style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 'bold' }}>
                                                                    Refunded: ₹{order.refundAmount}
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleRefund(orderId)}
                                                                    style={{
                                                                        background: 'var(--accent-cyan)',
                                                                        color: 'black',
                                                                        border: 'none',
                                                                        borderRadius: '4px',
                                                                        padding: '0.25rem 0.5rem',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: 'bold',
                                                                        width: '100%'
                                                                    }}
                                                                >
                                                                    Process Refund
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {order.exchangeStatus && order.exchangeStatus !== 'None' && (
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Exchange:</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ color: getStatusColor(order.exchangeStatus), fontWeight: 'bold' }}>{order.exchangeStatus}</span>
                                                        {order.exchangeStatus === 'Requested' && (
                                                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                                <button onClick={() => handleExchangeStatusUpdate(orderId, 'Approved')} style={{ background: '#4ade80', border: 'none', borderRadius: '4px', padding: '0.25rem', cursor: 'pointer' }} title="Approve">✓</button>
                                                                <button onClick={() => handleExchangeStatusUpdate(orderId, 'Rejected')} style={{ background: '#ef4444', border: 'none', borderRadius: '4px', padding: '0.25rem', cursor: 'pointer' }} title="Reject">✕</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {order.exchangeReason && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={order.exchangeReason}>{order.exchangeReason}</div>}
                                                </div>
                                            )}
                                            {(!order.returnStatus || order.returnStatus === 'None') && (!order.exchangeStatus || order.exchangeStatus === 'None') && (
                                                <span style={{ color: 'var(--text-muted)' }}>-</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <select
                                                value={order.status || 'Processing'}
                                                onChange={(e) => updateOrderStatus(orderId, e.target.value)}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: '#2a2a2a',
                                                    border: '1px solid var(--border-light)',
                                                    borderRadius: '4px',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                <option value="Processing" style={{ background: '#2a2a2a', color: 'white' }}>Processing</option>
                                                <option value="Shipped" style={{ background: '#2a2a2a', color: 'white' }}>Shipped</option>
                                                <option value="Delivered" style={{ background: '#2a2a2a', color: 'white' }}>Delivered</option>
                                                <option value="Cancelled" style={{ background: '#2a2a2a', color: 'white' }}>Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    {Array.isArray(orders) ? 'No orders found' : 'Error: Orders data is invalid'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageOrders;

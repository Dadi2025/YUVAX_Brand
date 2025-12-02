import React from 'react';
import { useApp } from '../../context/AppContext';

const ManageOrders = () => {
    const { orders, updateOrderStatus, fetchAllOrders, user } = useApp();

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
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Manage Orders ({orders.length})</h2>

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
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(orders) && orders.length > 0 ? (
                            orders.map((order, index) => {
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
                                        <td style={{ padding: '1rem' }}>User #{typeof userId === 'object' ? 'Object' : userId}</td>
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
                                            <select
                                                value={order.status || 'Processing'}
                                                onChange={(e) => updateOrderStatus(orderId, e.target.value)}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid var(--border-light)',
                                                    borderRadius: '4px',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
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

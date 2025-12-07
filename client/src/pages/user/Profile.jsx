import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, RotateCcw, RefreshCw, XCircle, Printer } from 'lucide-react';
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

    const handlePrintInvoice = (order) => {
        const printWindow = window.open('', '_blank');
        const invoiceContent = `
            <html>
                <head>
                    <title>Invoice - ${order._id || order.id}</title>
                    <style>
                        body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 20px; line-height: 1.5; color: #333; }
                        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
                        .logo { font-size: 24px; font-weight: bold; color: #000; }
                        .invoice-title { font-size: 32px; font-weight: bold; color: #333; }
                        .info-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
                        .company-info, .bill-to { width: 45%; }
                        h3 { font-size: 14px; text-transform: uppercase; color: #666; margin-bottom: 10px; }
                        p { margin: 0; font-size: 14px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                        th { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; background: #f9f9f9; font-size: 12px; text-transform: uppercase; }
                        td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
                        .total-section { float: right; width: 300px; }
                        .row { display: flex; justify-content: space-between; padding: 5px 0; }
                        .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
                        .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; padding-top: 20px; border-top: 1px solid #eee; }
                        @media print {
                            button { display: none; }
                            body { font-size: 12pt; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">YUVAX</div>
                        <div class="invoice-title">INVOICE</div>
                    </div>

                    <div class="info-section">
                        <div class="company-info">
                            <h3>From</h3>
                            <p><strong>YUVAX Inc.</strong></p>
                            <p>123 Fashion Street</p>
                            <p>Mumbai, Maharashtra 400001</p>
                            <p>support@yuvax.com</p>
                        </div>
                        <div class="bill-to">
                            <h3>Bill To</h3>
                            <p><strong>${order.shippingAddress.name}</strong></p>
                            <p>${order.shippingAddress.address}</p>
                            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
                            <p>Phone: ${order.shippingAddress.phone}</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <p><strong>Order ID:</strong> ${order._id || order.id}</p>
                        <p><strong>Date:</strong> ${new Date(order.createdAt || order.date).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> ${order.status}</p>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Size</th>
                                <th>Oty</th>
                                <th style="text-align: right">Price</th>
                                <th style="text-align: right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(order.orderItems || order.items || []).map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.size}</td>
                                    <td>${item.quantity}</td>
                                    <td style="text-align: right">₹${item.price}</td>
                                    <td style="text-align: right">₹${item.price * item.quantity}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="total-section">
                        <div class="row">
                            <span>Subtotal:</span>
                            <span>₹${order.totalPrice || order.total}</span>
                        </div>
                        <div class="row">
                            <span>Shipping:</span>
                            <span>Included</span>
                        </div>
                        <div class="row grand-total">
                            <span>Total:</span>
                            <span>₹${order.totalPrice || order.total}</span>
                        </div>
                    </div>

                    <div style="clear: both;"></div>

                    <div class="footer">
                        <p>Thank you for shopping with YUVAX!</p>
                        <p>For any queries, please contact support.</p>
                    </div>

                    <script>
                        window.onload = function() { window.print(); }
                    </script>
                </body>
            </html>
        `;

        printWindow.document.write(invoiceContent);
        printWindow.document.close();
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
                                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                                    {[
                                        { id: 'All', label: 'All Orders', icon: Package, color: 'var(--text-primary)' },
                                        { id: 'Pending', label: 'Pending', icon: Clock, color: 'var(--accent-cyan)' },
                                        { id: 'Delivered', label: 'Delivered', icon: CheckCircle, color: '#4ade80' },
                                        { id: 'Returned', label: 'Returned', icon: RotateCcw, color: '#facc15' },
                                        { id: 'Exchanged', label: 'Exchanged', icon: RefreshCw, color: '#a855f7' },
                                        { id: 'Rejected', label: 'Rejected', icon: XCircle, color: '#ef4444' }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setFilterStatus(tab.id)}
                                            style={{
                                                background: filterStatus === tab.id ? tab.color : 'rgba(255,255,255,0.05)',
                                                color: filterStatus === tab.id ? 'black' : 'var(--text-muted)',
                                                border: filterStatus === tab.id ? 'none' : '1px solid var(--border-light)',
                                                padding: '0.6rem 1.2rem',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                transition: 'all 0.2s ease',
                                                boxShadow: filterStatus === tab.id ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (filterStatus !== tab.id) {
                                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (filterStatus !== tab.id) {
                                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }
                                            }}
                                        >
                                            <tab.icon size={16} />
                                            {tab.label}
                                            <span style={{
                                                background: filterStatus === tab.id ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)',
                                                borderRadius: '20px',
                                                padding: '2px 8px',
                                                fontSize: '0.75rem',
                                                marginLeft: '4px'
                                            }}>
                                                {userOrders.filter(o => {
                                                    if (tab.id === 'All') return true;
                                                    if (tab.id === 'Pending') return ['Processing', 'Shipped'].includes(o.status);
                                                    if (tab.id === 'Delivered') return o.status === 'Delivered';
                                                    if (tab.id === 'Returned') return (o.status === 'Returned' || (o.returnStatus !== 'None' && o.returnStatus !== 'Rejected')) && o.exchangeStatus === 'None';
                                                    if (tab.id === 'Exchanged') return (o.exchangeStatus !== 'None' && o.exchangeStatus !== 'Rejected');
                                                    if (tab.id === 'Rejected') return o.returnStatus === 'Rejected' || o.exchangeStatus === 'Rejected';
                                                    return false;
                                                }).length}
                                            </span>
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
                                        if (filterStatus === 'Returned') return (order.status === 'Returned' || (order.returnStatus !== 'None' && order.returnStatus !== 'Rejected')) && order.exchangeStatus === 'None';
                                        if (filterStatus === 'Exchanged') return (order.exchangeStatus !== 'None' && order.exchangeStatus !== 'Rejected');
                                        if (filterStatus === 'Rejected') return order.returnStatus === 'Rejected' || order.exchangeStatus === 'Rejected';
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
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                    {(order.orderItems || order.items || []).map((item, idx) => (
                                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                                                />
                                                                <div>
                                                                    <a
                                                                        href={`/shop/product/${item.product}`}
                                                                        style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', display: 'block' }}
                                                                    >
                                                                        {item.name}
                                                                    </a>
                                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Size: {item.size} | Qty: {item.quantity}</span>
                                                                </div>
                                                            </div>
                                                            <span style={{ fontWeight: 'bold' }}>₹{item.price * item.quantity}</span>
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
                                                    <button
                                                        onClick={() => handlePrintInvoice(order)}
                                                        className="btn-secondary"
                                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                                    >
                                                        <Printer size={16} />
                                                        INVOICE
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

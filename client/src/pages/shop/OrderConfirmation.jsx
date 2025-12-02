import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const OrderConfirmation = () => {
    const location = useLocation();
    const { orders } = useApp();

    // Get order ID from URL
    const params = new URLSearchParams(location.search);
    const orderId = params.get('orderId');

    // Find the order
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return (
            <div style={{ minHeight: '100vh', paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ maxWidth: '600px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Order Not Found</h1>
                    <Link to="/shop" className="btn-primary">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    const estimatedDelivery = new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ maxWidth: '600px', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>✓</div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>ORDER CONFIRMED!</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.125rem' }}>
                    Thank you for your purchase. Your order has been placed successfully.
                </p>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Order Number</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{order.id}</p>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Order Total</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>₹{order.total}</p>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Payment Method</p>
                        <p style={{ fontSize: '1rem' }}>{order.paymentMethod === 'upi' ? 'UPI' : order.paymentMethod === 'card' ? 'Card' : 'Cash on Delivery'}</p>
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Estimated Delivery</p>
                        <p style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{estimatedDelivery}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/profile" className="btn-secondary">View Orders</Link>
                    <Link to="/shop" className="btn-primary">Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;

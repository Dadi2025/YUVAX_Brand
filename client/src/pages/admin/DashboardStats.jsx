import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DashboardStats = ({ showRecentOrders = true }) => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSales: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);
    const { showToast } = useApp();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('yuva-token');
            console.log('Fetching analytics with token:', token ? 'Token exists' : 'No token');

            const res = await fetch('/api/orders/analytics', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Analytics response status:', res.status);
            const data = await res.json();
            console.log('Analytics data:', data);

            if (res.ok) {
                setStats(data);
            } else {
                console.error('Analytics error response:', data);
                showToast(data.message || 'Failed to load analytics', 'error');
            }
        } catch (error) {
            console.error('Analytics fetch error:', error);
            showToast('Failed to load analytics', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Loading stats...</div>;

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                {/* Total Sales */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Sales</p>
                            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>₹{stats.totalSales.toLocaleString()}</h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(0,243,255,0.1)', borderRadius: '50%' }}>
                            <DollarSign size={24} color="var(--accent-cyan)" />
                        </div>
                    </div>
                </div>

                {/* Total Orders */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Orders</p>
                            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-purple)' }}>{stats.totalOrders}</h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(188,19,254,0.1)', borderRadius: '50%' }}>
                            <ShoppingBag size={24} color="var(--accent-purple)" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            {showRecentOrders && (
                <>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Recent Orders</h3>
                    {stats.recentOrders && stats.recentOrders.length > 0 ? (
                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.02)' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Order ID</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>User</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Date</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Total</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.map(order => (
                                        <tr key={order._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                            <td style={{ padding: '1rem' }}>{order._id.substring(0, 8)}...</td>
                                            <td style={{ padding: '1rem' }}>{order.user?.name || 'Unknown'}</td>
                                            <td style={{ padding: '1rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '1rem' }}>₹{order.totalPrice}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    background: order.isPaid ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)',
                                                    color: order.isPaid ? '#00ff00' : '#ff4444'
                                                }}>
                                                    {order.isPaid ? 'Paid' : 'Unpaid'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '3rem', textAlign: 'center' }}>
                            <ShoppingBag size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>No orders yet</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                Orders will appear here once customers start placing orders.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DashboardStats;

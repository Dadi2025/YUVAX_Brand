import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import DashboardStats from './DashboardStats';

const Analytics = () => {
    const { getAuthHeaders, showToast } = useApp();
    const [analyticsData, setAnalyticsData] = useState({
        salesTrend: [],
        orderStatusDist: [],
        topProducts: [],
        categorySales: []
    });
    const [loading, setLoading] = useState(true);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        const fetchAdvancedAnalytics = async () => {
            try {
                const res = await fetch('/api/orders/analytics/advanced', {
                    headers: getAuthHeaders()
                });
                const data = await res.json();

                if (res.ok) {
                    setAnalyticsData(data);
                } else {
                    showToast(data.message || 'Failed to fetch analytics', 'error');
                }
            } catch (error) {
                console.error('Analytics fetch error:', error);
                showToast('Failed to load advanced analytics', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchAdvancedAnalytics();
    }, []);

    if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '3rem' }}>Loading detailed insights...</div>;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: '#1a1a1a', border: '1px solid var(--border-light)', padding: '10px', borderRadius: '4px', zIndex: 1000 }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#fff' }}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ margin: 0, color: entry.color || '#fff' }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Strategic Analytics</h2>
                <p style={{ color: 'var(--text-muted)' }}>Deep dive into your business performance to drive decisions.</p>
            </div>

            {/* Key Stats Cards (Hide Recent Orders Table) */}
            <DashboardStats showRecentOrders={false} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem', marginTop: '3rem' }}>

                {/* 1. Sales Trend (7 Days) */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📈 Sales Trend <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Last 7 Days)</span>
                    </h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData.salesTrend}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="_id" stroke="var(--text-muted)" tickFormatter={(str) => str.slice(5)} />
                                <YAxis stroke="var(--text-muted)" />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="totalSales" stroke="var(--accent-cyan)" fillOpacity={1} fill="url(#colorSales)" name="Revenue (₹)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Order Status Distribution */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>🎯 Order Status Distribution</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analyticsData.orderStatusDist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="_id"
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {analyticsData.orderStatusDist.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Top Products */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>🏆 Top Selling Products</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData.topProducts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis type="number" stroke="var(--text-muted)" />
                                <YAxis dataKey="name" type="category" width={150} stroke="var(--text-muted)" style={{ fontSize: '0.8rem', cursor: 'pointer' }} onClick={(data) => {
                                    // Handle clicking Y-Axis labels if possible, or leave as simple bar click
                                }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="totalSold"
                                    fill="var(--accent-purple)"
                                    name="Units Sold"
                                    radius={[0, 4, 4, 0]}
                                    barSize={20}
                                    style={{ cursor: 'pointer' }}
                                    onClick={(data) => window.open(`/product/${data._id}`, '_blank')}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Revenue by Category */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>🛍️ Revenue by Category</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData.categorySales}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="_id" stroke="var(--text-muted)" />
                                <YAxis stroke="var(--text-muted)" />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="totalRevenue" fill="#FF8042" name="Revenue (₹)" barSize={40} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;

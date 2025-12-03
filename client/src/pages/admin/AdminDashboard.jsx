import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ManageProducts from './ManageProducts';
import ManageOrders from './ManageOrders';
import ManageUsers from './ManageUsers';
import ManageAgents from './ManageAgents';
import DashboardStats from './DashboardStats';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const isAdmin = localStorage.getItem('yuva-admin');
    if (!isAdmin) {
        navigate('/admin/login');
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem('yuva-admin');
        navigate('/admin/login');
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '3rem' }}>ADMIN DASHBOARD</h1>
                    <button onClick={handleLogout} className="btn-secondary">Logout</button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)' }}>
                    {['overview', 'products', 'orders', 'users', 'agents'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: activeTab === tab ? 'var(--accent-cyan)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontSize: '0.875rem',
                                fontWeight: 'bold',
                                borderBottom: activeTab === tab ? '2px solid var(--accent-cyan)' : '2px solid transparent'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && <DashboardStats />}

                {/* Products Tab */}
                {activeTab === 'products' && <ManageProducts />}

                {/* Orders Tab */}
                {activeTab === 'orders' && <ManageOrders />}

                {/* Users Tab */}
                {activeTab === 'users' && <ManageUsers />}

                {/* Agents Tab */}
                {activeTab === 'agents' && <ManageAgents />}
            </div>
        </div>
    );
};

export default AdminDashboard;

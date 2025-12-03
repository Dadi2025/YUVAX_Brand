import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const ManageAgents = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAgent, setNewAgent] = useState({
        name: '',
        email: '',
        phone: '',
        pinCodes: '',
        city: '',
        address: ''
    });

    const { getAuthHeaders, showToast } = useApp();

    const fetchAgents = async () => {
        try {
            const res = await fetch('/api/agents', {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setAgents(data);
            } else {
                throw new Error('Failed to fetch agents');
            }
        } catch (error) {
            console.error('Error fetching agents:', error);
            showToast('Failed to load agents', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAgent = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newAgent,
                pinCodes: newAgent.pinCodes.split(',').map(p => p.trim())
            };

            const res = await fetch('/api/agents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showToast('Agent created successfully', 'success');
                setShowAddForm(false);
                setNewAgent({ name: '', email: '', phone: '', pinCodes: '', city: '', address: '' });
                fetchAgents();
            } else {
                const data = await res.json();
                throw new Error(data.message || 'Failed to create agent');
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const deleteAgent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this agent?')) return;

        try {
            const res = await fetch(`/api/agents/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (res.ok) {
                setAgents(agents.filter(a => a._id !== id));
                showToast('Agent deleted successfully', 'success');
            } else {
                const data = await res.json();
                throw new Error(data.message || 'Failed to delete agent');
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    if (loading) return <div>Loading agents...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Manage Agents ({agents.length})</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn-primary"
                >
                    {showAddForm ? 'Cancel' : '+ Add New Agent'}
                </button>
            </div>

            {showAddForm && (
                <div style={{ background: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border-light)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Add New Delivery Agent</h3>
                    <form onSubmit={handleCreateAgent}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Name"
                                value={newAgent.name}
                                onChange={e => setNewAgent({ ...newAgent, name: e.target.value })}
                                required
                                style={{ padding: '0.75rem', background: '#2a2a2a', border: '1px solid var(--border-light)', color: 'white', borderRadius: '4px' }}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newAgent.email}
                                onChange={e => setNewAgent({ ...newAgent, email: e.target.value })}
                                required
                                style={{ padding: '0.75rem', background: '#2a2a2a', border: '1px solid var(--border-light)', color: 'white', borderRadius: '4px' }}
                            />
                            <input
                                type="text"
                                placeholder="Phone"
                                value={newAgent.phone}
                                onChange={e => setNewAgent({ ...newAgent, phone: e.target.value })}
                                required
                                style={{ padding: '0.75rem', background: '#2a2a2a', border: '1px solid var(--border-light)', color: 'white', borderRadius: '4px' }}
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={newAgent.city}
                                onChange={e => setNewAgent({ ...newAgent, city: e.target.value })}
                                style={{ padding: '0.75rem', background: '#2a2a2a', border: '1px solid var(--border-light)', color: 'white', borderRadius: '4px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Serviceable Pincodes (comma separated)"
                                value={newAgent.pinCodes}
                                onChange={e => setNewAgent({ ...newAgent, pinCodes: e.target.value })}
                                required
                                style={{ width: '100%', padding: '0.75rem', background: '#2a2a2a', border: '1px solid var(--border-light)', color: 'white', borderRadius: '4px' }}
                            />
                        </div>
                        <button type="submit" className="btn-primary">Create Agent</button>
                    </form>
                </div>
            )}

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Phone</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Assigned Orders</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map(agent => (
                            <tr key={agent._id} style={{ borderTop: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '1rem' }}>{agent.name}</td>
                                <td style={{ padding: '1rem' }}>{agent.email}</td>
                                <td style={{ padding: '1rem' }}>{agent.phone}</td>
                                <td style={{ padding: '1rem' }}>{agent.assignedOrders}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => deleteAgent(agent._id)}
                                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageAgents;

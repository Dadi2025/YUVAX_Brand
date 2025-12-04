import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, MapPin, Package, Star, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const ManageAgents = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        pinCodes: '',
        city: '',
        address: ''
    });

    const { getAuthHeaders, showToast } = useApp();

    useEffect(() => {
        fetchAgents();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const pinCodesArray = formData.pinCodes.split(',').map(p => p.trim()).filter(p => p);

            const payload = {
                ...formData,
                pinCodes: pinCodesArray
            };

            const url = editingAgent ? `/api/agents/${editingAgent._id}` : '/api/agents';
            const method = editingAgent ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showToast(editingAgent ? 'Agent updated successfully' : 'Agent created successfully', 'success');
                fetchAgents();
                closeModal();
            } else {
                const error = await res.json();
                throw new Error(error.message || 'Failed to save agent');
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this agent?')) return;

        try {
            const res = await fetch(`/api/agents/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (res.ok) {
                showToast('Agent deleted successfully', 'success');
                fetchAgents();
            } else {
                const error = await res.json();
                throw new Error(error.message || 'Failed to delete agent');
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const handleToggleActive = async (agent) => {
        try {
            const res = await fetch(`/api/agents/${agent._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({ isActive: !agent.isActive })
            });

            if (res.ok) {
                showToast(`Agent ${!agent.isActive ? 'activated' : 'deactivated'}`, 'success');
                fetchAgents();
            }
        } catch (error) {
            showToast('Failed to update agent status', 'error');
        }
    };

    const openModal = (agent = null) => {
        if (agent) {
            setEditingAgent(agent);
            setFormData({
                name: agent.name,
                email: agent.email,
                phone: agent.phone,
                pinCodes: agent.pinCodes.join(', '),
                city: agent.city || '',
                address: agent.address || ''
            });
        } else {
            setEditingAgent(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                pinCodes: '',
                city: '',
                address: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingAgent(null);
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)' }}>Loading agents...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Delivery Agents</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Manage delivery agents and their pincode coverage</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} />
                    Add Agent
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    padding: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Users size={24} color="var(--accent-cyan)" />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Agents</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{agents.length}</div>
                </div>

                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    padding: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Check size={24} color="#10b981" />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Agents</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {agents.filter(a => a.isActive).length}
                    </div>
                </div>

                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    padding: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Package size={24} color="var(--accent-purple)" />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Assigned Orders</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {agents.reduce((sum, a) => sum + a.assignedOrders, 0)}
                    </div>
                </div>

                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    padding: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <MapPin size={24} color="#f59e0b" />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Pincodes Covered</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {new Set(agents.flatMap(a => a.pinCodes)).size}
                    </div>
                </div>
            </div>

            {/* Agents Table */}
            <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                overflow: 'hidden'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-light)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Agent</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Contact</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Pincodes</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Assigned</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Completed</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Rating</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.map((agent) => (
                                <tr key={agent._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '500' }}>{agent.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{agent.city || 'N/A'}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.875rem' }}>{agent.email}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{agent.phone}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                            {agent.pinCodes.slice(0, 3).map((pin, idx) => (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        background: 'var(--accent-cyan)',
                                                        color: 'black',
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '4px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    {pin}
                                                </span>
                                            ))}
                                            {agent.pinCodes.length > 3 && (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    +{agent.pinCodes.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                                        {agent.assignedOrders}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                                        {agent.completedOrders}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                            <Star size={16} fill="#f59e0b" color="#f59e0b" />
                                            <span style={{ fontWeight: '600' }}>{agent.rating.toFixed(1)}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleToggleActive(agent)}
                                            style={{
                                                background: agent.isActive ? '#10b981' : '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {agent.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => openModal(agent)}
                                                style={{
                                                    background: 'var(--accent-cyan)',
                                                    color: 'black',
                                                    border: 'none',
                                                    padding: '0.5rem',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(agent._id)}
                                                style={{
                                                    background: '#ef4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.5rem',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {agents.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No delivery agents found. Click "Add Agent" to create one.
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: '12px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{
                            padding: '1.5rem',
                            borderBottom: '1px solid var(--border-light)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                                {editingAgent ? 'Edit Agent' : 'Add New Agent'}
                            </h3>
                            <button
                                onClick={closeModal}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '0.5rem'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-light)',
                                            background: 'var(--bg-dark)',
                                            color: 'var(--text-main)'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-light)',
                                            background: 'var(--bg-dark)',
                                            color: 'var(--text-main)'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-light)',
                                            background: 'var(--bg-dark)',
                                            color: 'var(--text-main)'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Pincodes * (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="110001, 110002, 110003"
                                        value={formData.pinCodes}
                                        onChange={(e) => setFormData({ ...formData, pinCodes: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-light)',
                                            background: 'var(--bg-dark)',
                                            color: 'var(--text-main)'
                                        }}
                                    />
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                        Enter pincodes separated by commas
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-light)',
                                            background: 'var(--bg-dark)',
                                            color: 'var(--text-main)'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Address
                                    </label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-light)',
                                            background: 'var(--bg-dark)',
                                            color: 'var(--text-main)',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    {editingAgent ? 'Update Agent' : 'Create Agent'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-light)',
                                        background: 'var(--bg-dark)',
                                        color: 'var(--text-main)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAgents;

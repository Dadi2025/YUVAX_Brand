import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, X } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const { getAuthHeaders, showToast, user } = useApp();

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users', {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                throw new Error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            showToast('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (res.ok) {
                setUsers(users.filter(u => u._id !== id));
                showToast('User deleted successfully', 'success');
            } else {
                const data = await res.json();
                throw new Error(data.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            showToast(error.message, 'error');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</div>;
    }

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Registered Users ({users.length})</h2>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>ID</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Name</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Email</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Admin</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Joined</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(u => (
                                <tr key={u._id} style={{ borderTop: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{u._id}</td>
                                    <td style={{ padding: '1rem' }}>{u.name}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <a href={`mailto:${u.email}`} style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                                            {u.email}
                                        </a>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {u.isAdmin ? (
                                            <span style={{ color: '#4ade80', fontWeight: 'bold' }}>Yes</span>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)' }}>No</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => setSelectedUser(u)}
                                                style={{
                                                    background: 'var(--accent-cyan)',
                                                    color: 'black',
                                                    border: 'none',
                                                    padding: '0.5rem',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            {!u.isAdmin && (
                                                <button
                                                    onClick={() => deleteUser(u._id)}
                                                    style={{
                                                        background: '#ef4444',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View User Modal */}
            {
                selectedUser && (
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
                            background: '#1f2937',
                            borderRadius: '12px',
                            maxWidth: '500px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            color: 'white',
                            border: '1px solid var(--border-light)'
                        }}>
                            <div style={{
                                padding: '1.5rem',
                                borderBottom: '1px solid var(--border-light)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>User Details</h3>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'black', margin: '0 auto 1rem' }}>
                                        {selectedUser.name.charAt(0).toUpperCase()}
                                    </div>
                                    <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{selectedUser.name}</h4>
                                    <p style={{ color: 'var(--text-muted)' }}>{selectedUser.email}</p>
                                </div>

                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                        <h5 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Account Info</h5>
                                        <div><strong>ID:</strong> {selectedUser._id}</div>
                                        <div><strong>Role:</strong> {selectedUser.isAdmin ? 'Admin' : 'Customer'}</div>
                                        <div><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                                    </div>

                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                        <h5 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Saved Addresses</h5>
                                        {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {selectedUser.addresses.map((addr, idx) => (
                                                    <div key={idx} style={{ padding: '0.5rem', border: '1px solid var(--border-light)', borderRadius: '4px' }}>
                                                        <div>{addr.street}, {addr.city}</div>
                                                        <div>{addr.state} - {addr.zip}</div>
                                                        <div>{addr.country}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No saved addresses</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ManageUsers;

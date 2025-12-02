import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
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
        </div>
    );
};

export default ManageUsers;

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Search } from 'lucide-react';

const ManagePincodes = () => {
    const [pincodes, setPincodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { getAuthHeaders, showToast } = useApp();

    useEffect(() => {
        fetchPincodes();
    }, []);

    const fetchPincodes = async () => {
        try {
            const res = await fetch('/api/agents', {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const agents = await res.json();
                // Extract unique pincodes and map them to agents
                const pinMap = new Map();
                agents.forEach(agent => {
                    agent.pinCodes.forEach(pin => {
                        if (!pinMap.has(pin)) {
                            pinMap.set(pin, []);
                        }
                        pinMap.get(pin).push(agent.name);
                    });
                });

                const pinList = Array.from(pinMap.entries()).map(([pin, agentNames]) => ({
                    code: pin,
                    agents: agentNames
                })).sort((a, b) => a.code.localeCompare(b.code));

                setPincodes(pinList);
            } else {
                showToast('Failed to load pincode data', 'error');
            }
        } catch (error) {
            console.error('Error fetching pincodes:', error);
            showToast('Failed to load pincode data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredPincodes = pincodes.filter(p =>
        p.code.includes(searchTerm) ||
        p.agents.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading pincodes...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Serviceable Pincodes ({pincodes.length})</h2>
                <div style={{ position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search pincode or agent..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '0.75rem 0.75rem 0.75rem 3rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border-light)',
                            background: 'var(--bg-card)',
                            color: 'var(--text-main)',
                            width: '300px'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {filteredPincodes.map((pin) => (
                    <div key={pin.code} style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'rgba(234, 179, 8, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem'
                        }}>
                            <MapPin size={24} color="#eab308" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{pin.code}</h3>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Covered by:
                        </div>
                        <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                            {pin.agents.map((agent, idx) => (
                                <span key={idx} style={{
                                    background: 'var(--accent-cyan)',
                                    color: 'black',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}>
                                    {agent}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {filteredPincodes.length === 0 && (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No pincodes found matching "{searchTerm}"
                </div>
            )}
        </div>
    );
};

export default ManagePincodes;

import React, { useState } from 'react';
import { MapPin, CheckCircle, XCircle, Truck } from 'lucide-react';
import { getAddressFromPincode } from '../../utils/pincodeService';

const DeliveryCheck = () => {
    const [pincode, setPincode] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const checkDelivery = async () => {
        if (!pincode || pincode.length !== 6) {
            setError('Please enter a valid 6-digit pincode');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const data = await getAddressFromPincode(pincode);
            setResult(data);
        } catch (err) {
            setError(err.message || 'Delivery not available for this pincode');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid var(--border-light)'
        }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="var(--accent-cyan)" />
                Check Delivery
            </h3>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '4px',
                        color: 'white'
                    }}
                />
                <button
                    onClick={checkDelivery}
                    disabled={loading}
                    className="btn-secondary"
                    style={{ padding: '0.75rem 1.5rem' }}
                >
                    {loading ? 'Checking...' : 'Check'}
                </button>
            </div>

            {error && (
                <div style={{ color: '#ff4444', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <XCircle size={16} />
                    {error}
                </div>
            )}

            {result && (
                <div style={{ fontSize: '0.875rem' }}>
                    <div style={{ color: '#00C851', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        <CheckCircle size={16} />
                        Delivery Available to {result.city}, {result.state}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        <Truck size={16} />
                        {result.message}
                    </div>

                    {!result.isCodAvailable && (
                        <div style={{ color: '#ffbb33', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                            ⚠️ Cash on Delivery not available
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DeliveryCheck;

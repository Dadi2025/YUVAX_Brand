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
        <div className="delivery-check-container">
            <h3 className="delivery-header">
                <MapPin size={18} color="var(--accent-cyan)" />
                Check Delivery Availability
            </h3>

            <div className="delivery-input-group">
                <input
                    type="text"
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="delivery-input"
                />
                <button
                    onClick={checkDelivery}
                    disabled={loading}
                    className="delivery-check-btn"
                >
                    {loading ? '...' : 'Check'}
                </button>
            </div>

            {error && (
                <div style={{ color: '#ff4444', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <XCircle size={16} />
                    {error}
                </div>
            )}

            {result && (
                <div style={{ fontSize: '0.875rem', marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '6px' }}>
                    <div style={{ color: '#00C851', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        <CheckCircle size={16} />
                        Available in {result.city}, {result.state}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        <Truck size={16} />
                        {result.message}
                    </div>

                    {!result.isCodAvailable && (
                        <div style={{ color: '#ffbb33', fontSize: '0.8rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span>⚠️</span> Cash on Delivery not available
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DeliveryCheck;

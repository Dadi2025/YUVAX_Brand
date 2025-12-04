import React from 'react';
import { Package, RefreshCw } from 'lucide-react';
import ReturnTracking from './ReturnTracking';
import '../../styles/returns.css';

const MyReturns = ({ returns }) => {
    if (!returns || returns.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                <RefreshCw size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3>No returns found</h3>
                <p>You haven't made any return requests yet.</p>
            </div>
        );
    }

    return (
        <div className="returns-list">
            {returns.map((req) => (
                <div key={req._id} className="return-card">
                    <div className="return-card-header">
                        <div>
                            <div className="return-id">Return #{req._id.substring(0, 8)}</div>
                            <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.2rem' }}>
                                For Order #{req.order.orderNumber} • {new Date(req.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div className={`return-status status-${req.status}`}>
                            {req.status.replace('_', ' ')}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        {req.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                <span style={{ color: '#00ffff' }}>{item.quantity}x</span>
                                <span>Product ID: {item.product}</span>
                            </div>
                        ))}
                    </div>

                    <ReturnTracking status={req.status} history={req.statusHistory} />
                </div>
            ))}
        </div>
    );
};

export default MyReturns;

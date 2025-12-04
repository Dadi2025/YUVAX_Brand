import React from 'react';
import { Zap } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import '../../styles/flash-sale.css';

const FlashSaleBanner = ({ endTime }) => {
    return (
        <div className="flash-sale-banner">
            <div className="flash-content">
                <h2>
                    <Zap size={32} fill="yellow" color="yellow" />
                    Flash Sale
                </h2>
                <p>Limited time deals. Grab them before they're gone!</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ textTransform: 'uppercase', fontWeight: '600', letterSpacing: '1px' }}>Ends In:</span>
                <CountdownTimer endTime={endTime} />
            </div>
        </div>
    );
};

export default FlashSaleBanner;

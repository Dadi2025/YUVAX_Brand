import React from 'react';
import { TrendingUp } from 'lucide-react';
import TierBadge from './TierBadge';

const PointsBalance = ({ points, tier, nextTier, progressToNextTier, amountToNextTier }) => {
    return (
        <div className="loyalty-header">
            <div className="points-display">
                <div className="points-value">{points?.toLocaleString()}</div>
                <div className="points-label">Loyalty Points</div>

                <div style={{ marginTop: '1rem' }}>
                    <TierBadge tier={tier} />
                </div>
            </div>

            <div className="tier-progress">
                {nextTier ? (
                    <>
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${Math.min(100, Math.max(0, progressToNextTier))}%` }}
                            ></div>
                        </div>
                        <div className="progress-text">
                            <span>Current: {tier}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <TrendingUp size={14} />
                                Spend ₹{amountToNextTier?.toLocaleString()} to reach {nextTier}
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="progress-text" style={{ justifyContent: 'center', color: '#ffd700' }}>
                        <Crown size={16} style={{ marginRight: '8px' }} />
                        You've reached the top tier!
                    </div>
                )}
            </div>
        </div>
    );
};

export default PointsBalance;

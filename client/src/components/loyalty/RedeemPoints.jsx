import React from 'react';
import { Gift, Lock } from 'lucide-react';

const RedeemPoints = ({ points, onRedeem }) => {
    const redeemOptions = [
        { points: 1000, value: 100 },
        { points: 2000, value: 200 },
        { points: 5000, value: 500 },
        { points: 10000, value: 1000 }
    ];

    return (
        <div className="loyalty-card">
            <h3 className="card-title">
                <Gift size={20} />
                Redeem Rewards
            </h3>

            <div className="redeem-options">
                {redeemOptions.map((option) => {
                    const canRedeem = points >= option.points;

                    return (
                        <div
                            key={option.points}
                            className="redeem-card"
                            style={{ opacity: canRedeem ? 1 : 0.5, cursor: canRedeem ? 'pointer' : 'not-allowed' }}
                            onClick={() => canRedeem && onRedeem(option.points)}
                        >
                            <div className="redeem-cost">{option.points.toLocaleString()} Points</div>
                            <div className="redeem-amount">₹{option.value}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Discount Voucher
                            </div>
                            {!canRedeem && (
                                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.8rem', color: '#ff4444' }}>
                                    <Lock size={12} />
                                    Need {option.points - points} more
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RedeemPoints;

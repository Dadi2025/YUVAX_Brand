import React from 'react';
import { Trophy, Medal } from 'lucide-react';

const ReferralLeaderboard = ({ leaderboard }) => {
    return (
        <div className="leaderboard-section">
            <div className="leaderboard-header">
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Trophy size={24} color="#ffd700" />
                    Top Referrers
                </h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>This Month</span>
            </div>

            <div className="leaderboard-list">
                {leaderboard.map((user, index) => (
                    <div key={index} className="leaderboard-item">
                        <div className={`rank rank-${index + 1}`}>
                            {index + 1 <= 3 ? <Medal size={24} /> : `#${index + 1}`}
                        </div>
                        <div className="user-info">
                            <div className="user-name">{user.name}</div>
                            <div className="referral-count">{user.referrals} Referrals</div>
                        </div>
                        <div className="earnings">₹{user.earnings}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReferralLeaderboard;

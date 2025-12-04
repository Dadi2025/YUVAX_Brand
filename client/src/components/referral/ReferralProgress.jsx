import React from 'react';
import { Gift, TrendingUp } from 'lucide-react';

const ReferralProgress = ({ totalReferrals }) => {
    // Milestone thresholds
    const milestones = [
        { count: 5, bonus: 500, label: 'Silver Tier' },
        { count: 10, bonus: 1000, label: 'Gold Tier' }
    ];

    // Determine current milestone
    let currentMilestone = null;
    let progress = 0;

    if (totalReferrals < 5) {
        currentMilestone = milestones[0];
        progress = (totalReferrals / 5) * 100;
    } else if (totalReferrals < 10) {
        currentMilestone = milestones[1];
        progress = ((totalReferrals - 5) / 5) * 100;
    } else {
        // Completed all milestones
        return (
            <div className="referral-progress completed">
                <div className="progress-header">
                    <Gift size={24} />
                    <h3>All Milestones Unlocked! 🎉</h3>
                </div>
                <p>You've reached Gold Tier! Keep referring to earn ₹200 per referral.</p>
            </div>
        );
    }

    const remaining = currentMilestone.count - totalReferrals;

    return (
        <div className="referral-progress">
            <div className="progress-header">
                <TrendingUp size={24} />
                <h3>Next Milestone: {currentMilestone.label}</h3>
            </div>

            <div className="progress-info">
                <p>Refer {remaining} more friend{remaining !== 1 ? 's' : ''} to unlock <strong>₹{currentMilestone.bonus} bonus</strong>!</p>
            </div>

            <div className="progress-bar-container">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="progress-labels">
                    <span>{totalReferrals} referrals</span>
                    <span>{currentMilestone.count} referrals</span>
                </div>
            </div>

            <div className="milestone-rewards">
                <div className="milestone-item">
                    <div className={`milestone-badge ${totalReferrals >= 5 ? 'unlocked' : ''}`}>
                        5
                    </div>
                    <div className="milestone-details">
                        <div className="milestone-label">Silver Tier</div>
                        <div className="milestone-bonus">+₹500 bonus</div>
                    </div>
                </div>
                <div className="milestone-item">
                    <div className={`milestone-badge ${totalReferrals >= 10 ? 'unlocked' : ''}`}>
                        10
                    </div>
                    <div className="milestone-details">
                        <div className="milestone-label">Gold Tier</div>
                        <div className="milestone-bonus">+₹1000 bonus</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferralProgress;

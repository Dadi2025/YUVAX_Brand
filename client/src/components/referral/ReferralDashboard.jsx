import React, { useState } from 'react';
import { Copy, Check, Users, DollarSign, TrendingUp } from 'lucide-react';
import SocialShareButtons from './SocialShareButtons';
import ReferralLeaderboard from './ReferralLeaderboard';
import '../../styles/referral.css';

const ReferralDashboard = () => {
    const [copied, setCopied] = useState(false);

    // Mock data
    const userStats = {
        referralCode: 'YUVA2024',
        totalReferrals: 12,
        successfulReferrals: 8,
        earnings: 1600,
        rank: 5
    };

    const leaderboard = [
        { name: 'Rahul K.', referrals: 45, earnings: 9000 },
        { name: 'Priya S.', referrals: 38, earnings: 7600 },
        { name: 'Amit M.', referrals: 32, earnings: 6400 },
        { name: 'Sneha R.', referrals: 28, earnings: 5600 },
        { name: 'Vikram J.', referrals: 25, earnings: 5000 }
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(userStats.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="referral-dashboard">
            <div className="referral-hero">
                <h1>Invite Friends & Earn Big</h1>
                <p>Get ₹200 for every friend who makes their first purchase. Your friends get ₹200 off too!</p>

                <div className="copy-box">
                    <div className="referral-code">{userStats.referralCode}</div>
                    <button className="copy-btn" onClick={handleCopy}>
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                        {copied ? ' Copied!' : ' Copy Code'}
                    </button>
                </div>

                <SocialShareButtons referralCode={userStats.referralCode} />
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{userStats.totalReferrals}</div>
                    <div className="stat-label">Total Invites</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{userStats.successfulReferrals}</div>
                    <div className="stat-label">Successful</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">₹{userStats.earnings}</div>
                    <div className="stat-label">Total Earnings</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">#{userStats.rank}</div>
                    <div className="stat-label">Your Rank</div>
                </div>
            </div>

            <ReferralLeaderboard leaderboard={leaderboard} />
        </div>
    );
};

export default ReferralDashboard;

import React, { useState } from 'react';
import { Copy, Check, Users, DollarSign, TrendingUp } from 'lucide-react';
import SocialShareButtons from '../../components/referral/SocialShareButtons';
import ReferralLeaderboard from '../../components/referral/ReferralLeaderboard';
import ReferralProgress from '../../components/referral/ReferralProgress';
import loyaltyService from '../../services/loyaltyService';
import '../../styles/referral.css';

const ReferralDashboard = () => {
    const [copied, setCopied] = useState(false);
    const [userStats, setUserStats] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [stats, leaders] = await Promise.all([
                    loyaltyService.getReferralStats(),
                    loyaltyService.getReferralLeaderboard()
                ]);
                setUserStats(stats);
                setLeaderboard(leaders);
            } catch (err) {
                console.error('Error fetching referral data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCopy = () => {
        if (userStats?.referralCode) {
            navigator.clipboard.writeText(userStats.referralCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Loading Referral Dashboard...</div>;
    if (!userStats) return <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Failed to load data</div>;

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

            <ReferralProgress totalReferrals={userStats.totalReferrals} />

            <ReferralLeaderboard leaderboard={leaderboard} />
        </div>
    );
};

export default ReferralDashboard;

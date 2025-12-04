import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, Share2, Users, Gift } from 'lucide-react';
import PointsBalance from './PointsBalance';
import PointsHistory from './PointsHistory';
import RedeemPoints from './RedeemPoints';
import '../../styles/loyalty.css';

const LoyaltyDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [history, setHistory] = useState([]);
    const [earnOpportunities, setEarnOpportunities] = useState([]);

    // Mock data for development - replace with API calls later
    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            setData({
                points: 2450,
                tier: 'Silver',
                totalSpent: 12500,
                nextTier: 'Gold',
                nextTierThreshold: 15000,
                progressToNextTier: 83.3,
                amountToNextTier: 2500
            });

            setHistory([
                { _id: '1', description: 'Purchase - Order #12345', points: 450, type: 'earn', createdAt: new Date().toISOString() },
                { _id: '2', description: 'Referral Bonus', points: 200, type: 'earn', createdAt: new Date(Date.now() - 86400000).toISOString() },
                { _id: '3', description: 'Redeemed for Discount', points: 1000, type: 'redeem', createdAt: new Date(Date.now() - 172800000).toISOString() }
            ]);

            setEarnOpportunities([
                { icon: <ShoppingBag size={20} />, action: 'Shop & Earn', points: '10 pts / ₹100', desc: 'Earn on every order' },
                { icon: <Star size={20} />, action: 'Write Reviews', points: '50 pts', desc: 'Share your thoughts' },
                { icon: <Users size={20} />, action: 'Refer Friends', points: '200 pts', desc: 'When they buy' },
                { icon: <Share2 size={20} />, action: 'Social Share', points: '20 pts', desc: 'Spread the love' },
                { icon: <Gift size={20} />, action: 'Birthday', points: '500 pts', desc: 'Special gift' }
            ]);

            setLoading(false);
        }, 1000);
    }, []);

    const handleRedeem = (points) => {
        if (window.confirm(`Are you sure you want to redeem ${points} points?`)) {
            // API call would go here
            alert(`Redeemed ${points} points! Code: LOYALTY${Date.now()}`);
            // Update local state for demo
            setData(prev => ({ ...prev, points: prev.points - points }));
            setHistory(prev => [{
                _id: Date.now().toString(),
                description: `Redeemed ${points} points`,
                points: points,
                type: 'redeem',
                createdAt: new Date().toISOString()
            }, ...prev]);
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>Loading Loyalty Dashboard...</div>;
    }

    return (
        <div className="loyalty-dashboard">
            <PointsBalance
                points={data.points}
                tier={data.tier}
                nextTier={data.nextTier}
                progressToNextTier={data.progressToNextTier}
                amountToNextTier={data.amountToNextTier}
            />

            <div className="loyalty-grid">
                <div className="main-content">
                    <RedeemPoints points={data.points} onRedeem={handleRedeem} />
                    <PointsHistory transactions={history} />
                </div>

                <div className="sidebar">
                    <div className="loyalty-card">
                        <h3 className="card-title">
                            <Star size={20} />
                            Ways to Earn
                        </h3>
                        <div className="earn-list">
                            {earnOpportunities.map((item, index) => (
                                <div key={index} className="earn-item">
                                    <div className="earn-icon">{item.icon}</div>
                                    <div className="earn-details">
                                        <h4>{item.action}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                    <div className="earn-points">{item.points}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoyaltyDashboard;

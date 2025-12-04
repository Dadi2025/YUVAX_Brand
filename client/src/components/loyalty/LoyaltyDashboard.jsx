import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, Share2, Users, Gift } from 'lucide-react';
import PointsBalance from './PointsBalance';
import PointsHistory from './PointsHistory';
import RedeemPoints from './RedeemPoints';
import loyaltyService from '../../services/loyaltyService';
import '../../styles/loyalty.css';

const LoyaltyDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [history, setHistory] = useState([]);
    const [earnOpportunities, setEarnOpportunities] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check for birthday bonus first
                await loyaltyService.checkBirthdayBonus();

                const [dashboardData, historyData, opportunitiesData] = await Promise.all([
                    loyaltyService.getDashboardData(),
                    loyaltyService.getHistory(),
                    loyaltyService.getEarnOpportunities()
                ]);

                setData(dashboardData);
                setHistory(historyData);
                setEarnOpportunities(opportunitiesData);
            } catch (err) {
                console.error('Error fetching loyalty data:', err);
                setError('Failed to load loyalty data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleRedeem = async (points) => {
        if (window.confirm(`Are you sure you want to redeem ${points} points?`)) {
            try {
                const result = await loyaltyService.redeemPoints(points);
                alert(result.message);

                // Refresh data
                const [dashboardData, historyData] = await Promise.all([
                    loyaltyService.getDashboardData(),
                    loyaltyService.getHistory()
                ]);

                setData(dashboardData);
                setHistory(historyData);
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to redeem points');
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>Loading Loyalty Dashboard...</div>;
    if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: '#ff4444' }}>{error}</div>;

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
                                    <div className="earn-icon">
                                        {item.action.includes('Shop') && <ShoppingBag size={20} />}
                                        {item.action.includes('Review') && <Star size={20} />}
                                        {item.action.includes('Refer') && <Users size={20} />}
                                        {item.action.includes('Share') && <Share2 size={20} />}
                                        {item.action.includes('Birthday') && <Gift size={20} />}
                                        {item.action.includes('Spin') && <Star size={20} />}
                                    </div>
                                    <div className="earn-details">
                                        <h4>{item.action}</h4>
                                        <p>{item.description}</p>
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

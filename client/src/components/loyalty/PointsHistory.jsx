import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

const PointsHistory = ({ transactions }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="loyalty-card">
                <h3 className="card-title">
                    <Calendar size={20} />
                    Points History
                </h3>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                    No points history yet. Start shopping to earn!
                </p>
            </div>
        );
    }

    return (
        <div className="loyalty-card">
            <h3 className="card-title">
                <Calendar size={20} />
                Recent Activity
            </h3>

            <div className="history-list">
                {transactions.map((tx) => (
                    <div key={tx._id} className="history-item">
                        <div className="history-info">
                            <h4>{tx.description}</h4>
                            <div className="history-date">
                                {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                        <div className={`history-points ${tx.type}`}>
                            {tx.type === 'earn' ? '+' : '-'}{tx.points}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PointsHistory;

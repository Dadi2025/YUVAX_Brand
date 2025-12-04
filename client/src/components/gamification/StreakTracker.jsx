import React from 'react';
import { Flame } from 'lucide-react';

const StreakTracker = ({ streak }) => {
    return (
        <div className="streak-tracker">
            <Flame className="streak-flame" size={24} fill={streak > 0 ? "#ff4500" : "none"} />
            <div>
                <div className="streak-count">{streak} Day Streak</div>
                <div className="streak-label">Spin daily to keep it going!</div>
            </div>
        </div>
    );
};

export default StreakTracker;

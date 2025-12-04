import React from 'react';
import { Award, Crown, Star } from 'lucide-react';

const TierBadge = ({ tier }) => {
    const getBadgeConfig = (tier) => {
        switch (tier?.toLowerCase()) {
            case 'gold':
                return {
                    icon: <Crown size={16} />,
                    className: 'tier-badge gold',
                    label: 'Gold Member'
                };
            case 'silver':
                return {
                    icon: <Star size={16} />,
                    className: 'tier-badge silver',
                    label: 'Silver Member'
                };
            default:
                return {
                    icon: <Award size={16} />,
                    className: 'tier-badge bronze',
                    label: 'Bronze Member'
                };
        }
    };

    const config = getBadgeConfig(tier);

    return (
        <div className={config.className}>
            {config.icon}
            <span>{config.label}</span>
        </div>
    );
};

export default TierBadge;

import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import StreakTracker from './StreakTracker';
import RewardNotification from './RewardNotification';
import '../../styles/gamification.css';

const SEGMENTS = [
    { label: '5% OFF', color: '#FF00FF', value: 5, type: 'discount' },
    { label: '10% OFF', color: '#00FFFF', value: 10, type: 'discount' },
    { label: '50 PTS', color: '#FFFF00', value: 50, type: 'points' },
    { label: '15% OFF', color: '#FF00FF', value: 15, type: 'discount' },
    { label: 'FREE SHIP', color: '#00FFFF', value: 1, type: 'free_shipping' },
    { label: '100 PTS', color: '#FFFF00', value: 100, type: 'points' },
    { label: '20% OFF', color: '#FF00FF', value: 20, type: 'discount' },
    { label: 'MYSTERY', color: '#00FFFF', value: 0, type: 'mystery' }
];

const SpinWheel = () => {
    const [canSpin, setCanSpin] = useState(true);
    const [isSpinning, setIsSpinning] = useState(false);
    const [streak, setStreak] = useState(3); // Mock streak
    const [showReward, setShowReward] = useState(false);
    const [reward, setReward] = useState(null);
    const controls = useAnimation();

    const handleSpin = async () => {
        if (!canSpin || isSpinning) return;

        setIsSpinning(true);

        // Simulate API call to get result
        // In real app: const { rewardIndex } = await api.spin();
        const randomSegmentIndex = Math.floor(Math.random() * SEGMENTS.length);
        const selectedSegment = SEGMENTS[randomSegmentIndex];

        // Calculate rotation
        // 360 / 8 segments = 45 degrees per segment
        // We want to land on the selected segment
        // Add extra rotations for effect (5 full spins = 1800 degrees)
        const segmentAngle = 360 / SEGMENTS.length;
        const targetAngle = 1800 + (360 - (randomSegmentIndex * segmentAngle) - (segmentAngle / 2));

        await controls.start({
            rotate: targetAngle,
            transition: { duration: 4, ease: "circOut" }
        });

        setTimeout(() => {
            setReward({
                label: selectedSegment.label,
                code: selectedSegment.type === 'discount' ? `SPIN${selectedSegment.value}` : null
            });
            setShowReward(true);
            setIsSpinning(false);
            setCanSpin(false);
            setStreak(prev => prev + 1);
        }, 500);
    };

    return (
        <div className="spin-wheel-container">
            <StreakTracker streak={streak} />

            <div className="wheel-wrapper">
                <div className="wheel-pointer"></div>
                <motion.div
                    className="wheel-canvas"
                    animate={controls}
                    initial={{ rotate: 0 }}
                >
                    {SEGMENTS.map((segment, index) => (
                        <div
                            key={index}
                            className="wheel-section"
                            style={{
                                transform: `rotate(${index * (360 / SEGMENTS.length)}deg) skewY(-${90 - (360 / SEGMENTS.length)}deg)`,
                                background: index % 2 === 0 ? '#1a1a2e' : '#2a2a4e'
                            }}
                        >
                            <span style={{
                                transform: `skewY(${90 - (360 / SEGMENTS.length)}deg) rotate(${360 / SEGMENTS.length / 2}deg)`,
                                display: 'block',
                                position: 'absolute',
                                right: '20px',
                                top: '30px',
                                color: segment.color
                            }}>
                                {segment.label}
                            </span>
                        </div>
                    ))}
                    <div className="wheel-center"></div>
                </motion.div>
            </div>

            <button
                className="spin-button"
                onClick={handleSpin}
                disabled={!canSpin || isSpinning}
            >
                {isSpinning ? 'Spinning...' : canSpin ? 'SPIN NOW' : 'Come Back Tomorrow'}
            </button>

            <RewardNotification
                isOpen={showReward}
                onClose={() => setShowReward(false)}
                reward={reward}
            />
        </div>
    );
};

export default SpinWheel;

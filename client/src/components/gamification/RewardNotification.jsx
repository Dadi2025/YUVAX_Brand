import React from 'react';
import { X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RewardNotification = ({ isOpen, onClose, reward }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        if (reward?.code) {
            navigator.clipboard.writeText(reward.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isOpen || !reward) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="reward-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="reward-modal"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>

                    <div className="reward-icon">🎉</div>
                    <h2 className="reward-title">Congratulations!</h2>
                    <p style={{ color: '#ccc' }}>You've won</p>

                    <div className="reward-value">{reward.label}</div>

                    {reward.code && (
                        <div className="reward-code-box" onClick={handleCopy}>
                            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Your Coupon Code</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                {reward.code}
                                {copied ? <Check size={16} color="#00ff00" /> : <Copy size={16} />}
                            </div>
                        </div>
                    )}

                    <button className="claim-button" onClick={onClose}>
                        Claim Reward
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RewardNotification;

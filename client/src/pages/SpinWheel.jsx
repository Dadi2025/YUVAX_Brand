import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Sparkles, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SpinWheel = () => {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [prize, setPrize] = useState(null);
    const [canSpin, setCanSpin] = useState(true);
    const [nextSpinTime, setNextSpinTime] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const { user, getAuthHeaders, showToast } = useApp();
    const navigate = useNavigate();

    const prizes = [
        { label: '5% OFF', color: '#ff6b6b', value: 5 },
        { label: '10% OFF', color: '#4ecdc4', value: 10 },
        { label: '15% OFF', color: '#45b7d1', value: 15 },
        { label: '20% OFF', color: '#96ceb4', value: 20 },
        { label: 'FREE SHIPPING', color: '#ffeaa7', value: 0 }
    ];

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        checkSpinStatus();
        fetchCoupons();
    }, [user]);

    const checkSpinStatus = async () => {
        try {
            const res = await fetch('/api/game/can-spin', {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            setCanSpin(data.canSpin);
            setNextSpinTime(data.nextSpinAt);
        } catch (error) {
            console.error('Check spin error:', error);
        }
    };

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/game/my-coupons', {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setCoupons(data);
            }
        } catch (error) {
            console.error('Fetch coupons error:', error);
        }
    };

    const handleSpin = async () => {
        if (!canSpin || spinning) return;

        setSpinning(true);

        try {
            const res = await fetch('/api/game/spin', {
                method: 'POST',
                headers: getAuthHeaders()
            });

            const data = await res.json();

            if (res.ok) {
                // Calculate rotation (5 full spins + random position)
                const spins = 5;
                const randomDegree = Math.floor(Math.random() * 360);
                const totalRotation = rotation + (360 * spins) + randomDegree;

                setRotation(totalRotation);

                // Show prize after animation
                setTimeout(() => {
                    setPrize(data.prize);
                    setSpinning(false);
                    setCanSpin(false);
                    showToast(`You won: ${data.prize.type === 'freeShipping' ? 'Free Shipping' : data.prize.discount + '% OFF'}!`, 'success');
                    fetchCoupons();
                }, 4000);
            } else {
                showToast(data.message, 'error');
                setSpinning(false);
            }
        } catch (error) {
            showToast('Failed to spin', 'error');
            setSpinning(false);
        }
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        showToast('Coupon code copied!', 'success');
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                        <Sparkles color="var(--accent-cyan)" />
                        SPIN & WIN
                        <Sparkles color="var(--accent-purple)" />
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
                        Spin once daily for a chance to win exclusive discounts!
                    </p>
                </div>

                {/* Wheel Container */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                    {/* Wheel */}
                    <div style={{ position: 'relative', width: '400px', height: '400px' }}>
                        {/* Pointer */}
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '20px solid transparent',
                            borderRight: '20px solid transparent',
                            borderTop: '40px solid var(--accent-cyan)',
                            zIndex: 10,
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                        }} />

                        {/* Wheel */}
                        <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            border: '8px solid var(--accent-cyan)',
                            boxShadow: '0 8px 32px rgba(0, 255, 255, 0.3)',
                            transform: `rotate(${rotation}deg)`,
                            transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                            background: 'conic-gradient(from 0deg, #ff6b6b 0deg 72deg, #4ecdc4 72deg 144deg, #45b7d1 144deg 216deg, #96ceb4 216deg 288deg, #ffeaa7 288deg 360deg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}>
                            {/* Center Circle */}
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: '#1e1e1e',
                                border: '4px solid var(--accent-cyan)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem'
                            }}>
                                🎁
                            </div>

                            {/* Prize Labels */}
                            {prizes.map((p, idx) => (
                                <div key={idx} style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: `rotate(${idx * 72 + 36}deg) translateY(-140px)`,
                                    transformOrigin: '0 0',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                }}>
                                    {p.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Spin Button */}
                    <button
                        onClick={handleSpin}
                        disabled={!canSpin || spinning}
                        style={{
                            padding: '1rem 3rem',
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            background: canSpin && !spinning ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))' : '#333',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: canSpin && !spinning ? 'pointer' : 'not-allowed',
                            boxShadow: canSpin && !spinning ? '0 4px 20px rgba(0, 255, 255, 0.3)' : 'none',
                            transition: 'transform 0.2s',
                            opacity: canSpin && !spinning ? 1 : 0.5
                        }}
                        onMouseEnter={(e) => canSpin && !spinning && (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {spinning ? 'SPINNING...' : canSpin ? 'SPIN NOW!' : 'COME BACK TOMORROW'}
                    </button>

                    {!canSpin && nextSpinTime && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                            <Clock size={16} />
                            <span>Next spin available: {new Date(nextSpinTime).toLocaleString()}</span>
                        </div>
                    )}
                </div>

                {/* Won Coupons */}
                {coupons.length > 0 && (
                    <div style={{ marginTop: '4rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                            Your Coupons ({coupons.length})
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {coupons.map(coupon => (
                                <div key={coupon._id} style={{
                                    background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(138, 43, 226, 0.1))',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                        <Gift size={24} color="var(--accent-cyan)" />
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                        {coupon.type === 'freeShipping' ? 'Free Shipping' : `${coupon.discount}% Discount`}
                                    </div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>
                                        {coupon.code}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                        Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                                    </div>
                                    <button
                                        onClick={() => copyCode(coupon.code)}
                                        className="btn-secondary"
                                        style={{ width: '100%', padding: '0.5rem' }}
                                    >
                                        Copy Code
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpinWheel;

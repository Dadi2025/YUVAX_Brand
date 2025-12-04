import React, { useState, useEffect } from 'react';
import { Gift, Copy, Share2, Wallet, Users, TrendingUp } from 'lucide-react';

const ReferralDashboard = () => {
    const [referralData, setReferralData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchReferralData();
    }, []);

    const fetchReferralData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/referral/my-referral', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            setReferralData(data);
        } catch (error) {
            console.error('Error fetching referral data:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyReferralCode = () => {
        navigator.clipboard.writeText(referralData.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareReferral = () => {
        const message = `Join YUVA X with my referral code ${referralData.referralCode} and get ₹100 bonus! 🎁`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <Gift size={48} style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }} />
                    <div style={{ color: 'var(--text-muted)' }}>Loading your referral dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem', background: 'var(--bg-dark)' }}>
            <div className="container">
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                    borderRadius: '16px',
                    padding: '3rem 2rem',
                    marginBottom: '2rem',
                    textAlign: 'center',
                    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
                }}>
                    <Gift size={64} style={{ color: 'white', marginBottom: '1rem' }} />
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'white' }}>Refer & Earn</h1>
                    <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.9)' }}>
                        Share the love, earn rewards! Get ₹500 for every friend who joins.
                    </p>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Wallet size={32} color="white" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Wallet Balance</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>₹{referralData?.walletBalance || 0}</div>
                        </div>
                    </div>

                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--accent-purple), #7c3aed)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Users size={32} color="white" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Referrals</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{referralData?.totalReferrals || 0}</div>
                        </div>
                    </div>

                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--accent-cyan), #06b6d4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TrendingUp size={32} color="white" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Earnings</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>₹{referralData?.referralEarnings || 0}</div>
                        </div>
                    </div>
                </div>

                {/* Referral Code Card */}
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Your Referral Code</h2>
                    <div style={{
                        background: 'var(--bg-dark)',
                        border: '2px dashed var(--accent-cyan)',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>
                            {referralData?.referralCode}
                        </div>
                        <button
                            onClick={copyReferralCode}
                            style={{
                                background: copied ? '#10b981' : 'var(--accent-cyan)',
                                color: 'black',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: 'bold',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Copy size={20} />
                            {copied ? 'Copied!' : 'Copy Code'}
                        </button>
                    </div>

                    <button
                        onClick={shareReferral}
                        className="btn-primary"
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '1rem'
                        }}
                    >
                        <Share2 size={20} />
                        Share on WhatsApp
                    </button>
                </div>

                {/* How It Works */}
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    padding: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>How It Works</h2>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'var(--accent-cyan)',
                                color: 'black',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                flexShrink: 0
                            }}>1</div>
                            <div>
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Share Your Code</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Share your unique referral code with friends and family.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'var(--accent-purple)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                flexShrink: 0
                            }}>2</div>
                            <div>
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>They Sign Up</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Your friend creates an account using your referral code and gets ₹100 bonus.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#10b981',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                flexShrink: 0
                            }}>3</div>
                            <div>
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>You Both Win!</h3>
                                <p style={{ color: 'var(--text-muted)' }}>You earn ₹500 in your wallet. Use it on your next purchase!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferralDashboard;

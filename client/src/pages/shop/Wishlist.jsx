import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Bell, BellOff } from 'lucide-react';

const PriceAlertToggle = () => {
    const { user, showToast } = useApp();
    const [enabled, setEnabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (user) {
            // Fetch current preference
            fetch('/api/alerts/preference', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('yuva-token')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.priceAlertsEnabled !== undefined) {
                        setEnabled(data.priceAlertsEnabled);
                    }
                })
                .catch(err => console.error('Failed to fetch alert preference', err));
        }
    }, [user]);

    const toggleAlerts = async () => {
        if (!user) {
            showToast('Please login to manage alerts', 'error');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/alerts/preference', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('yuva-token')}`
                },
                body: JSON.stringify({ enabled: !enabled })
            });

            if (res.ok) {
                setEnabled(!enabled);
                showToast(`Price alerts ${!enabled ? 'enabled' : 'disabled'}`, 'success');
            } else {
                showToast('Failed to update preference', 'error');
            }
        } catch (error) {
            showToast('Failed to update preference', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <button
            onClick={toggleAlerts}
            disabled={loading}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: enabled ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${enabled ? '#4ade80' : 'var(--border-light)'}`,
                borderRadius: '20px',
                padding: '0.5rem 1rem',
                color: enabled ? '#4ade80' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.3s'
            }}
        >
            {enabled ? <Bell size={18} /> : <BellOff size={18} />}
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                {enabled ? 'Alerts On' : 'Alerts Off'}
            </span>
        </button>
    );
};

const Wishlist = () => {
    const { wishlist, removeFromWishlist, moveToCart } = useApp();

    if (wishlist.length === 0) {
        return (
            <div style={{ minHeight: '100vh', paddingTop: '120px', textAlign: 'center' }}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>YOUR WISHLIST</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your wishlist is empty</p>
                    <Link to="/shop" className="btn-primary">Discover Products</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '3rem', margin: 0 }}>YOUR WISHLIST</h1>
                    <PriceAlertToggle />
                </div>

                <div className="product-grid">
                    {wishlist.map((product) => (
                        <div key={product.id} className="product-card relative">
                            <div className="product-image-container">
                                <Link to={`/product/${product.id}`}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-image"
                                        style={{ filter: 'grayscale(100%)' }}
                                    />
                                </Link>

                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
                                    <button
                                        onClick={() => removeFromWishlist(product.id)}
                                        style={{
                                            background: 'rgba(0,0,0,0.8)',
                                            border: 'none',
                                            color: 'white',
                                            cursor: 'pointer',
                                            padding: '0.5rem',
                                            borderRadius: '50%',
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            fontSize: '1.25rem'
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <div style={{ padding: '1.25rem' }}>
                                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '0.5rem' }}>{product.name}</h3>
                                    <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>₹{product.price}</p>
                                </Link>
                                <button
                                    onClick={() => moveToCart(product)}
                                    className="btn-primary"
                                    style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem' }}
                                >
                                    MOVE TO CART
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;

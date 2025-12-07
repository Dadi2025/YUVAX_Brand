import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const Cart = () => {
    const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useApp();

    if (cart.length === 0) {
        return (
            <div style={{ minHeight: '100vh', paddingTop: '120px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <img
                        src="/src/assets/images/empty-cart.png"
                        alt="Empty Cart"
                        style={{ width: '250px', marginBottom: '2rem', filter: 'drop-shadow(0 0 20px rgba(74, 222, 128, 0.1))' }}
                    />
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Your cart feels so light!
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.2rem' }}>
                        Let's add some style to it. Explore our latest collections.
                    </p>
                    <Link
                        to="/shop"
                        className="btn-primary"
                        style={{
                            padding: '1rem 3rem',
                            fontSize: '1.1rem',
                            borderRadius: '50px',
                            boxShadow: '0 0 20px rgba(74, 222, 128, 0.2)'
                        }}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const shipping = 99;
    const total = getCartTotal() + shipping;

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>YOUR CART</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                    {/* Cart Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {cart.map((item) => (
                            <div key={`${item.id}-${item.size}`} style={{
                                display: 'grid',
                                gridTemplateColumns: '120px 1fr auto',
                                gap: '1.5rem',
                                padding: '1.5rem',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border-light)',
                                borderRadius: '8px'
                            }}>
                                <img src={item.image} alt={item.name} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '4px' }} />

                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.name}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Size: {item.size}</p>
                                    <p style={{ color: 'var(--accent-cyan)', fontSize: '1.125rem', fontWeight: 'bold' }}>₹{item.price}</p>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '0.25rem' }}>
                                            <button
                                                onClick={() => updateCartQuantity(item.id, item.size, item.quantity - 1)}
                                                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.25rem 0.75rem', fontSize: '1.25rem' }}
                                            >
                                                −
                                            </button>
                                            <span style={{ minWidth: '2rem', textAlign: 'center' }}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateCartQuantity(item.id, item.size, item.quantity + 1)}
                                                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.25rem 0.75rem', fontSize: '1.25rem' }}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id, item.size)}
                                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.875rem' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>₹{item.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '8px',
                        padding: '2rem',
                        position: 'sticky',
                        top: '120px',
                        height: 'fit-content'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>ORDER SUMMARY</h2>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                            <span>₹{getCartTotal()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                            <span>₹{shipping}</span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                                <span>Total</span>
                                <span style={{ color: 'var(--accent-cyan)' }}>₹{total}</span>
                            </div>
                        </div>

                        <Link to="/checkout" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                            PROCEED TO CHECKOUT
                        </Link>
                        <Link to="/shop" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

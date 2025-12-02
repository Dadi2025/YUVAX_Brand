import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

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
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>YOUR WISHLIST</h1>

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

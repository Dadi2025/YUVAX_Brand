import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const inWishlist = isInWishlist(product?.id);

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <Link to={`/product/${product.id}`} className="product-card group relative" style={{ textDecoration: 'none', display: 'block' }}>
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          style={{ filter: 'grayscale(100%)', width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Quick Actions */}
        <div className="product-actions">
          <button
            onClick={handleWishlistToggle}
            style={{
              color: inWishlist ? 'var(--accent-purple)' : 'white',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem'
            }}
          >
            {inWishlist ? '❤️' : '♡'}
          </button>
          <button
            onClick={handleAddToCart}
            style={{
              color: 'black',
              background: 'var(--accent-cyan)',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}
          >
            ADD TO CART
          </button>
        </div>

        {/* Badges */}
        {product.isNewArrival && (
          <div style={{ padding: '0.75rem', position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 'bold', background: 'var(--accent-cyan)', color: 'black', padding: '0.25rem 0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>New</span>
          </div>
        )}
        {discount > 0 && (
          <div style={{ padding: '0.75rem', position: 'absolute', top: 0, right: 0, zIndex: 10 }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 'bold', background: 'var(--accent-purple)', color: 'white', padding: '0.25rem 0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {discount}% OFF
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: '1.25rem' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 500, letterSpacing: '0.025em', color: 'white' }}>{product.name}</h3>
        </div>
        <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>₹{product.price}</span>
            {product.originalPrice && (
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '0.5rem' }}>₹{product.originalPrice}</span>
            )}
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{product.category}</p>

        {/* Rating */}
        {product.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '0.875rem' }}>
              {'⭐'.repeat(Math.floor(product.rating))}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({product.reviews})</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          {product.sizes?.slice(0, 4).map(size => (
            <span key={size} style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', border: '1px solid var(--border-light)', borderRadius: '4px' }}>{size}</span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

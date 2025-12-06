import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './ProductCard.css';

const ProductCard = ({ product, compact = false }) => {
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

  // Compact mode for chat widget
  if (compact) {
    return (
      <Link to={`/product/${product.id}`} className="product-card" style={{ display: 'flex', flexDirection: 'row', height: '100px', padding: 0 }}>
        <img src={product.image} alt={product.name} style={{ width: '80px', height: '100%', objectFit: 'cover' }} />
        <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4 className="product-name" style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{product.name}</h4>
          <span className="price-current" style={{ fontSize: '1rem' }}>₹{product.price}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card group">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />

        {/* Badges - Top Left */}
        <div className="badge-container">
          {product.isNewArrival && (
            <span className="badge badge-new">New</span>
          )}
          {discount > 0 && (
            <span className="badge badge-discount">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button - Top Right */}
        <button
          onClick={handleWishlistToggle}
          className={`btn-wishlist-icon ${inWishlist ? 'active' : ''}`}
          title="Add to Wishlist"
        >
          {inWishlist ? '❤️' : '♡'}
        </button>

        {/* Quick Actions Overlay - Bottom */}
        <div className="product-actions-overlay">
          {/* Size Selector for Quick Add (Future enhancement: interactive) */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '5px' }}>
              {product.sizes.slice(0, 5).map(size => (
                <span key={size} style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>{size}</span>
              ))}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="btn-quick-add"
          >
            ADD TO CART
          </button>
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name" title={product.name}>{product.name}</h3>

        <div className="product-price-row">
          <span className="price-current">₹{product.price}</span>
          {product.originalPrice && (
            <span className="price-original">₹{product.originalPrice}</span>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="product-category">{product.category}</p>

          {/* Rating */}
          {product.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ color: '#FFD700', fontSize: '0.8rem' }}>★</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{product.rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

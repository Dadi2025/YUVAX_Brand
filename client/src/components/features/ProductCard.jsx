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
    <Link to={`/product/${product.id}`} className="product-card group block">
      <div className="product-image-container relative overflow-hidden rounded-md bg-gray-100 aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
          {product.isNewArrival && (
            <span className="badge-new shadow-sm">New</span>
          )}
          {discount > 0 && (
            <span className="badge-sale shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm ${inWishlist ? 'text-red-500' : 'text-gray-400'}`}
          title="Add to Wishlist"
        >
          {inWishlist ? '❤️' : '♡'}
        </button>

        {/* Quick Actions Overlay */}
        <div className="product-quick-actions">
          {/* Actions handled by CSS hover in enhancements.css */}
          <button onClick={handleAddToCart} className="quick-action-btn" title="Quick Add">
            <span>+</span>
          </button>
          <button onClick={(e) => { e.preventDefault(); window.location.href = `/product/${product.id}` }} className="quick-action-btn" title="View Details">
            <span>↗</span>
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1 px-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-sm uppercase tracking-wide truncate pr-2 text-main">{product.name}</h3>
          <span className="font-bold text-sm">₹{product.price}</span>
        </div>

        <div className="flex justify-between items-center text-xs text-muted">
          <p className="uppercase tracking-wider">{product.category}</p>
          {product.originalPrice && (
            <span className="line-through text-gray-400">₹{product.originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

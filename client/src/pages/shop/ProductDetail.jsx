import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/features/ProductCard';
import ProductRecommendations from '../../components/features/ProductRecommendations';
import SizeGuide from '../../components/features/SizeGuide';
import SizeCalculator from '../../components/features/SizeCalculator';
import ReviewForm from '../../components/features/ReviewForm';
import ReviewList from '../../components/features/ReviewList';
import CompleteLook from '../../components/features/CompleteLook';
import VirtualTryOn from '../../components/features/VirtualTryOn';
import DeliveryCheck from '../../components/features/DeliveryCheck';

const ProductDetail = () => {
    const { id } = useParams();
    const { products, addToCart, addToWishlist, isInWishlist } = useApp();
    const product = products.find(p => p.id === parseInt(id));
    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [showSizeCalculator, setShowSizeCalculator] = useState(false);
    const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
    const [refreshReviews, setRefreshReviews] = useState(0);

    if (!product) {
        return <div style={{ minHeight: '100vh', paddingTop: '120px', textAlign: 'center' }}>Product not found</div>;
    }

    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                {/* Breadcrumb */}
                <div style={{ marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <Link to="/" style={{ color: 'inherit' }}>Home</Link> /
                    <Link to="/shop" style={{ color: 'inherit', margin: '0 0.5rem' }}>Shop</Link> /
                    <span style={{ color: 'white' }}>{product.name}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
                    {/* Images */}
                    <div>
                        <div style={{ marginBottom: '1rem' }}>
                            <img
                                src={product.images?.[selectedImage] || product.image}
                                alt={product.name}
                                style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {product.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`${product.name} ${idx + 1}`}
                                        onClick={() => setSelectedImage(idx)}
                                        style={{
                                            width: '80px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            border: selectedImage === idx ? '2px solid var(--accent-cyan)' : '2px solid transparent'
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>₹{product.price}</span>
                            {product.originalPrice && (
                                <>
                                    <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.originalPrice}</span>
                                    <span style={{ background: 'var(--accent-purple)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>{product.description}</p>

                        {/* Size Selector */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Select Size</h3>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={() => setShowSizeCalculator(true)}
                                        style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}
                                    >
                                        Calculate My Size
                                    </button>
                                    <button
                                        onClick={() => setShowSizeGuide(true)}
                                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}
                                    >
                                        Size Guide
                                    </button>
                                    <button
                                        onClick={() => setShowVirtualTryOn(true)}
                                        style={{ background: 'none', border: 'none', color: 'var(--accent-purple)', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                    >
                                        <span>✨</span> Try It On
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            background: selectedSize === size ? 'var(--accent-cyan)' : 'transparent',
                                            color: selectedSize === size ? 'black' : 'white',
                                            border: `1px solid ${selectedSize === size ? 'var(--accent-cyan)' : 'var(--border-light)'}`,
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Quantity</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '0.5rem', width: 'fit-content' }}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '1.25rem' }}
                                >
                                    −
                                </button>
                                <span style={{ minWidth: '3rem', textAlign: 'center', fontSize: '1.125rem' }}>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '1.25rem' }}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <button
                                onClick={() => addToCart(product, selectedSize, quantity)}
                                className="btn-primary"
                                style={{ flex: 1, padding: '1rem' }}
                            >
                                ADD TO CART
                            </button>
                            <button
                                onClick={() => addToWishlist(product)}
                                className="btn-secondary"
                                style={{ padding: '1rem 1.5rem' }}
                            >
                                {isInWishlist(product.id) ? '❤️' : '♡'}
                            </button>
                        </div>

                        {/* Product Details */}
                        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Category:</span> <span>{product.category}</span>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Stock:</span> <span style={{ color: product.stock > 10 ? 'var(--accent-cyan)' : 'var(--accent-purple)' }}>{product.stock} available</span>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-muted)' }}>Rating:</span> <span>⭐ {product.rating} ({product.reviews} reviews)</span>
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Rating:</span> <span>⭐ {product.rating} ({product.reviews} reviews)</span>
                                </div>
                            </div>

                            {/* Delivery Check */}
                            <DeliveryCheck />
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>YOU MAY ALSO LIKE</h2>
                        <div className="product-grid">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Complete the Look */}
                <CompleteLook currentProduct={product} />

                {/* Customer Reviews Section */}
                <div style={{ marginTop: '4rem' }}>
                    <ReviewList productId={product.id} key={refreshReviews} />

                    <div style={{ marginTop: '3rem' }}>
                        <ReviewForm
                            productId={product.id}
                            onReviewSubmitted={() => setRefreshReviews(prev => prev + 1)}
                        />
                    </div>
                </div>

                {/* Complete the Look - Product Recommendations */}
                <ProductRecommendations productId={product.id} />
            </div>

            {/* Size Guide Modal */}
            <SizeGuide
                isOpen={showSizeGuide}
                onClose={() => setShowSizeGuide(false)}
                category={product.category}
            />

            {showSizeCalculator && (
                <SizeCalculator
                    isOpen={showSizeCalculator}
                    onClose={() => setShowSizeCalculator(false)}
                    onSizeRecommended={(size) => {
                        setSelectedSize(size);
                        setShowSizeCalculator(false);
                    }}
                />
            )}

            {showVirtualTryOn && (
                <VirtualTryOn
                    product={product}
                    isOpen={showVirtualTryOn}
                    onClose={() => setShowVirtualTryOn(false)}
                />
            )}
        </div>
    );
};

export default ProductDetail;

import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import SocialShareButtons from '../../components/referral/SocialShareButtons';
import FrequentlyBoughtTogether from '../../components/features/FrequentlyBoughtTogether';
import './ProductDetail.css'; // Import custom styles

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, addToWishlist, isInWishlist } = useApp();
    const product = products.find(p => p.id === parseInt(id));
    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [showSizeCalculator, setShowSizeCalculator] = useState(false);
    const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
    const [refreshReviews, setRefreshReviews] = useState(0);
    const [showShareOptions, setShowShareOptions] = useState(false);

    if (!product) {
        return <div style={{ minHeight: '100vh', paddingTop: '120px', textAlign: 'center' }}>Product not found</div>;
    }

    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    const handleBuyNow = () => {
        addToCart(product, selectedSize, quantity);
        navigate('/cart');
    };

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
                        <div className="product-image-container" style={{ marginBottom: '1rem' }}>
                            <img
                                src={product.images?.[selectedImage] || product.image}
                                alt={product.name}
                                className="product-image-main"
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

                        <div style={{ marginBottom: '2rem', position: 'relative' }}>
                            <button
                                onClick={() => setShowShareOptions(!showShareOptions)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--text-main)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem'
                                }}
                            >
                                <span>🔗</span> Share Product
                            </button>
                            {showShareOptions && (
                                <div className="share-options-modal">
                                    <SocialShareButtons
                                        url={window.location.href}
                                        text={`Check out this amazing ${product.name} on YUVA X!`}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Size Selector */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 className="section-label">Select Size</h3>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                    >

                                        {size}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setShowSizeCalculator(true)}
                                    className="size-helper-btn"
                                    title="Calculate My Size"
                                >
                                    📏 Calculate Size
                                </button>
                                <button
                                    onClick={() => setShowSizeGuide(true)}
                                    className="size-helper-btn"
                                    title="Size Guide"
                                >
                                    📋 Size Guide
                                </button>
                            </div>
                        </div>

                        {/* Quantity */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Quantity</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '0.5rem', width: 'fit-content' }}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="quantity-btn"
                                >
                                    −
                                </button>
                                <span className="quantity-display">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="quantity-btn"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Delivery Check - Moved Here */}
                        <div style={{ marginBottom: '2rem' }}>
                            <DeliveryCheck onTryOn={() => setShowVirtualTryOn(true)} />
                        </div>

                        {/* Actions */}
                        <div className="product-actions-grid">
                            <button
                                onClick={() => addToCart(product, selectedSize, quantity)}
                                className="action-btn btn-add-cart"
                                data-testid="add-to-cart-btn"
                            >
                                ADD TO CART
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="action-btn btn-buy-now"
                            >
                                BUY NOW
                            </button>
                            <button
                                onClick={() => addToWishlist(product)}
                                className="action-btn btn-wishlist"
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

                            {/* Delivery Check Moved Up */}
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

                {/* Frequently Bought Together */}
                <FrequentlyBoughtTogether productId={product.id} />

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


            </div>

            {/* Size Guide Modal */}
            <SizeGuide
                isOpen={showSizeGuide}
                onClose={() => setShowSizeGuide(false)}
                category={product.category}
                productSizeChart={product.sizeChart}
            />

            {
                showSizeCalculator && (
                    <SizeCalculator
                        isOpen={showSizeCalculator}
                        onClose={() => setShowSizeCalculator(false)}
                        onSizeRecommended={(size) => {
                            setSelectedSize(size);
                            setShowSizeCalculator(false);
                        }}
                    />
                )
            }

            {
                showVirtualTryOn && (
                    <VirtualTryOn
                        product={product}
                        isOpen={showVirtualTryOn}
                        onClose={() => setShowVirtualTryOn(false)}
                    />
                )
            }
        </div >
    );
};

export default ProductDetail;

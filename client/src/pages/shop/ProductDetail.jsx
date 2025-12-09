
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
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, addToWishlist, isInWishlist } = useApp();
    const product = products.find(p => p.id === parseInt(id) || p._id === id || p.id === id);
    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [showSizeCalculator, setShowSizeCalculator] = useState(false);
    const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
    const [refreshReviews, setRefreshReviews] = useState(0);
    const [showShareOptions, setShowShareOptions] = useState(false);

    if (!product) {
        return <div className="product-detail-page text-center">Product not found</div>;
    }

    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    const handleBuyNow = () => {
        addToCart(product, selectedSize, quantity);
        navigate('/cart');
    };

    return (
        <div className="product-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <Link to="/" className="breadcrumb-link">Home</Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to="/shop" className="breadcrumb-link">Shop</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{product.name}</span>
                </div>

                <div className="product-layout-grid">
                    {/* Images Column */}
                    <div className="product-gallery">
                        <div className="product-image-container">
                            <img
                                src={product.images?.[selectedImage] || product.image}
                                alt={product.name}
                                className="product-image-main"
                            />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="image-thumbnails">
                                {product.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`${product.name} ${idx + 1}`}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info Column */}
                    <div className="product-info-col">
                        <h1 className="product-title">{product.name}</h1>
                        <div className="product-price-row">
                            <span className="current-price">₹{product.price}</span>
                            {product.originalPrice && (
                                <>
                                    <span className="original-price">₹{product.originalPrice}</span>
                                    <span className="discount-tag">
                                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        <p className="product-description">{product.description}</p>

                        <div className="share-btn-container">
                            <button
                                onClick={() => setShowShareOptions(!showShareOptions)}
                                className="share-trigger-btn"
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
                        <div className="attribute-section">
                            <div className="attribute-header">
                                <span className="attribute-label">Select Size</span>
                                <div className="flex gap-4">
                                    <button onClick={() => setShowSizeCalculator(true)} className="size-guide-btn">Calculate Size</button>
                                    <button onClick={() => setShowSizeGuide(true)} className="size-guide-btn">Size Guide</button>
                                </div>
                            </div>
                            <div className="size-grid">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="attribute-section">
                            <span className="attribute-label block mb-2">Quantity</span>
                            <div className="quantity-wrapper">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn">−</button>
                                <span className="qty-display">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="qty-btn">+</button>
                            </div>
                        </div>

                        {/* Delivery Check */}
                        <DeliveryCheck onTryOn={() => setShowVirtualTryOn(true)} />

                        {/* Actions */}
                        <div className="main-actions">
                            <button onClick={() => addToCart(product, selectedSize, quantity)} className="btn-add-cart">Add to Cart</button>
                            <button onClick={handleBuyNow} className="btn-buy-now">Buy Now</button>
                            <button onClick={() => addToWishlist(product)} className="btn-wishlist-toggle">
                                {isInWishlist(product.id) ? '❤️' : '♡'}
                            </button>
                        </div>

                        {/* Meta Data */}
                        <div className="product-meta">
                            <div className="meta-row"><span>Category:</span> {product.category}</div>
                            <div className="meta-row"><span>Stock:</span> {product.stock > 10 ? 'In Stock' : `${product.stock} left`}</div>
                            <div className="meta-row"><span>Rating:</span> ⭐ {product.rating} ({product.reviews} reviews)</div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="section-margin">
                        <h2 className="section-title">You May Also Like</h2>
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
                    <h2 className="section-title">Customer Reviews</h2>
                    <ReviewList productId={product.id} key={refreshReviews} />
                    <div style={{ marginTop: '3rem' }}>
                        <ReviewForm
                            productId={product.id}
                            onReviewSubmitted={() => setRefreshReviews(prev => prev + 1)}
                        />
                    </div>
                </div>

            </div>

            {/* Modals */}
            <SizeGuide
                isOpen={showSizeGuide}
                onClose={() => setShowSizeGuide(false)}
                category={product.category}
                productSizeChart={product.sizeChart}
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
        </div >
    );
};

export default ProductDetail;

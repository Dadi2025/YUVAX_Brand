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
        return <div style={{ minHeight: '100vh', paddingTop: '120px', textAlign: 'center' }}>Product not found</div>;
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
                    {/* Images */}
                    <div>
                        <div className="product-image-container">
                            <img
                                src={product.images?.[selectedImage] || product.image}
                                alt={product.name}
                                className="product-image-main"
                            />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="image-gallery">
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

                    {/* Product Info */}
                    <div>
                        <h1 className="product-title">{product.name}</h1>
                        <div className="product-price-container">
                            <span className="current-price">₹{product.price}</span>
                            {product.originalPrice && (
                                <>
                                    <span className="original-price">₹{product.originalPrice}</span>
                                    <span className="discount-badge">
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
                        <div className="size-section">
                            <h3 className="section-label">Select Size</h3>
                            <div className="size-selector">
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
                        <div className="quantity-section">
                            <h3 className="quantity-label">Quantity</h3>
                            <div className="quantity-control">
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
                        <div className="meta-info">
                            <div className="meta-item">
                                <span className="meta-label">Category:</span> <span>{product.category}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Stock:</span> <span className={`stock-status ${product.stock > 10 ? 'in-stock' : ''}`}>{product.stock} available</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Rating:</span> <span>⭐ {product.rating} ({product.reviews} reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="section-title">YOU MAY ALSO LIKE</h2>
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

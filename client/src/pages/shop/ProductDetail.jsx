
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
    const { products, addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
    const product = products.find(p => p.id === parseInt(id) || p._id === id || p.id === id);

    // State
    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
    const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || 'Black');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeAccordion, setActiveAccordion] = useState('description');

    // Feature Modals State
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [showSizeCalculator, setShowSizeCalculator] = useState(false);
    const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
    const [refreshReviews, setRefreshReviews] = useState(0);
    const [showShareOptions, setShowShareOptions] = useState(false);

    if (!product) {
        return <div className="product-detail-page text-center pt-20">Product not found</div>;
    }

    const inWishlist = isInWishlist(product.id);
    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    const handleBuyNow = () => {
        addToCart(product, selectedSize, quantity);
        navigate('/cart');
    };

    const toggleAccordion = (section) => {
        setActiveAccordion(activeAccordion === section ? null : section);
    };

    const toggleWishlist = () => {
        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="product-detail-page">
            <div className="container">
                {/* Breadcrumb - Clean & Minimal */}
                <div className="breadcrumb">
                    <Link to="/" className="breadcrumb-link">Home</Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to="/shop" className="breadcrumb-link">Shop</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{product.name}</span>
                </div>

                <div className="product-layout-grid">
                    {/* LEFT COLUMN: Gallery */}
                    <div className="product-gallery">
                        <div className="product-image-container relative">
                            {product.isNewArrival && <span className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider z-10">New Arrival</span>}
                            <img
                                src={product.images?.[selectedImage] || product.image}
                                alt={product.name}
                                className="product-image-main"
                            />
                            <button
                                onClick={() => setShowShareOptions(!showShareOptions)}
                                className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-all z-10"
                                title="Share"
                            >
                                🔗
                            </button>
                            {showShareOptions && (
                                <div className="absolute top-14 right-4 z-20">
                                    <SocialShareButtons
                                        url={window.location.href}
                                        text={`Check out ${product.name} on YUVA X`}
                                    />
                                </div>
                            )}
                        </div>

                        {product.images && product.images.length > 1 && (
                            <div className="image-thumbnails">
                                {product.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`thumbnail-wrapper ${selectedImage === idx ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(idx)}
                                    >
                                        <img src={img} alt="" className="thumbnail-img" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Product Info & Actions */}
                    <div className="product-info-col">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-accent-primary">{product.category}</span>
                            {product.stock < 10 && <span className="text-xs font-semibold text-red-500">Only {product.stock} left!</span>}
                        </div>

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

                        {/* Rating Summary */}
                        <div className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => document.getElementById('reviews-section').scrollIntoView({ behavior: 'smooth' })}>
                            <div className="flex text-yellow-400 text-sm">
                                {'★'.repeat(Math.round(product.rating))}
                                {'☆'.repeat(5 - Math.round(product.rating))}
                            </div>
                            <span className="text-sm text-gray-500 underline">{product.reviews} Reviews</span>
                        </div>

                        <div className="divider-line"></div>

                        {/* Color Selection */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="attribute-section">
                                <span className="attribute-label">Color: <span className="text-black font-normal ml-2">{selectedColor}</span></span>
                                <div className="color-grid">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`color-swatch-btn ${selectedColor === color ? 'active' : ''}`}
                                            title={color}
                                            style={{ backgroundColor: color.toLowerCase() }}
                                        >
                                            {selectedColor === color && <span className="check-icon">✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        <div className="attribute-section">
                            <div className="attribute-header">
                                <span className="attribute-label">Size: <span className="text-black font-normal ml-2">{selectedSize}</span></span>
                                <div className="flex gap-3 text-xs">
                                    <button onClick={() => setShowSizeCalculator(true)} className="underline hover:text-black text-gray-500">Wait, what's my size?</button>
                                    <span className="text-gray-300">|</span>
                                    <button onClick={() => setShowSizeGuide(true)} className="underline hover:text-black text-gray-500">Size Guide</button>
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

                        {/* Delivery Check & Try On */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <DeliveryCheck onTryOn={() => setShowVirtualTryOn(true)} />
                        </div>

                        {/* Main Actions */}
                        <div className="main-actions-group">
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>

                            <button onClick={() => addToCart(product, selectedSize, quantity)} className="btn-action btn-add-cart">
                                Add to Cart
                            </button>

                            <button onClick={handleBuyNow} className="btn-action btn-buy-now">
                                Buy Now
                            </button>

                            <button onClick={toggleWishlist} className={`btn-wishlist ${inWishlist ? 'active' : ''}`}>
                                {inWishlist ? '❤️' : '♡'}
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="trust-badges-row">
                            <div className="trust-item">
                                <span className="icon">🚚</span>
                                <span className="label">Free Shipping</span>
                            </div>
                            <div className="trust-item">
                                <span className="icon">🛡️</span>
                                <span className="label">Secure Payment</span>
                            </div>
                            <div className="trust-item">
                                <span className="icon">↩️</span>
                                <span className="label">Easy Returns</span>
                            </div>
                        </div>

                        {/* Information Accordions */}
                        <div className="info-accordions">
                            <div className="accordion-item">
                                <button className="accordion-header" onClick={() => toggleAccordion('description')}>
                                    <span>DESCRIPTION</span>
                                    <span>{activeAccordion === 'description' ? '−' : '+'}</span>
                                </button>
                                {activeAccordion === 'description' && (
                                    <div className="accordion-content">
                                        <p>{product.description}</p>
                                        <ul className="mt-4 list-disc pl-4 text-sm text-gray-600 space-y-1">
                                            <li>Premium Quality Material</li>
                                            <li>Designed for Modern Lifestyle</li>
                                            <li>Authentic YUVA X Branding</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="accordion-item">
                                <button className="accordion-header" onClick={() => toggleAccordion('shipping')}>
                                    <span>SHIPPING & RETURNS</span>
                                    <span>{activeAccordion === 'shipping' ? '−' : '+'}</span>
                                </button>
                                {activeAccordion === 'shipping' && (
                                    <div className="accordion-content text-sm text-gray-600">
                                        <p>Free shipping on all orders above ₹999.</p>
                                        <p className="mt-2">Easy returns within 7 days of delivery. No questions asked.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="section-margin">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="section-title text-2xl">Complete The Vibe</h2>
                            <Link to="/shop" className="text-sm underline hover:text-accent-primary">View All</Link>
                        </div>
                        <div className="product-grid">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Additional Features */}
                <CompleteLook currentProduct={product} />
                <FrequentlyBoughtTogether productId={product.id} />

                {/* Reviews */}
                <div id="reviews-section" className="mt-16 pt-10 border-t">
                    <h2 className="section-title mb-8">Customer Reviews</h2>
                    <ReviewList productId={product.id} key={refreshReviews} />
                    <div className="mt-8">
                        <ReviewForm
                            productId={product.id}
                            onReviewSubmitted={() => setRefreshReviews(prev => prev + 1)}
                        />
                    </div>
                </div>

            </div>

            {/* Feature Modals */}
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductRecommendations = ({ productId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecommendations();
    }, [productId]);

    const fetchRecommendations = async () => {
        try {
            const res = await fetch(`/api/products/${productId}/recommendations`);
            if (res.ok) {
                const data = await res.json();
                setRecommendations(data);
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    const scroll = (direction) => {
        const container = document.getElementById('recommendations-container');
        const scrollAmount = 300;
        if (direction === 'left') {
            container.scrollLeft -= scrollAmount;
            setScrollPosition(container.scrollLeft - scrollAmount);
        } else {
            container.scrollLeft += scrollAmount;
            setScrollPosition(container.scrollLeft + scrollAmount);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading recommendations...</p>
            </div>
        );
    }

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <div style={{ marginTop: '4rem', paddingBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                Complete the Look
            </h2>

            <div style={{ position: 'relative' }}>
                {/* Left Arrow */}
                {scrollPosition > 0 && (
                    <button
                        onClick={() => scroll('left')}
                        style={{
                            position: 'absolute',
                            left: '-20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            background: 'rgba(0,0,0,0.8)',
                            border: '1px solid var(--accent-cyan)',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <ChevronLeft size={24} style={{ color: 'var(--accent-cyan)' }} />
                    </button>
                )}

                {/* Products Container */}
                <div
                    id="recommendations-container"
                    style={{
                        display: 'flex',
                        gap: '1.5rem',
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        padding: '1rem 0',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    {recommendations.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => navigate(`/product/${product.id}`)}
                            style={{
                                minWidth: '250px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border-light)',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'var(--border-light)';
                            }}
                        >
                            {/* Product Image */}
                            <div style={{ position: 'relative', paddingTop: '125%', overflow: 'hidden' }}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>

                            {/* Product Info */}
                            <div style={{ padding: '1rem' }}>
                                <h3 style={{
                                    fontSize: '1rem',
                                    marginBottom: '0.5rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {product.name}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                                        ₹{product.price}
                                    </span>
                                    {product.originalPrice && (
                                        <span style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--text-muted)',
                                            textDecoration: 'line-through'
                                        }}>
                                            ₹{product.originalPrice}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    style={{
                        position: 'absolute',
                        right: '-20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        background: 'rgba(0,0,0,0.8)',
                        border: '1px solid var(--accent-cyan)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <ChevronRight size={24} style={{ color: 'var(--accent-cyan)' }} />
                </button>
            </div>

            <style>{`
                #recommendations-container::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default ProductRecommendations;

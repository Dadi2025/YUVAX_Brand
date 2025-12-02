import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp } from 'lucide-react';

const ReviewList = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews/product/${productId}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return (
            <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        fill={star <= rating ? 'var(--accent-cyan)' : 'none'}
                        stroke={star <= rating ? 'var(--accent-cyan)' : 'var(--text-muted)'}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading reviews...</div>;
    }

    if (reviews.length === 0) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review this product!</p>
            </div>
        );
    }

    return (
        <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                Customer Reviews ({reviews.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '8px',
                            padding: '1.5rem'
                        }}
                    >
                        {/* Review Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'var(--accent-cyan)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        color: 'black'
                                    }}>
                                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 'bold' }}>{review.user?.name || 'Anonymous'}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                {renderStars(review.rating)}
                            </div>
                        </div>

                        {/* Review Comment */}
                        <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>{review.comment}</p>

                        {/* Review Photos */}
                        {review.photos && review.photos.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                {review.photos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={`http://localhost:5001${photo}`}
                                        alt={`Review photo ${index + 1}`}
                                        onClick={() => setSelectedImage(`http://localhost:5001${photo}`)}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            border: '1px solid var(--border-light)',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Helpful Button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                            <button
                                style={{
                                    background: 'none',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--text-muted)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem'
                                }}
                            >
                                <ThumbsUp size={16} />
                                Helpful ({review.helpful || 0})
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    onClick={() => setSelectedImage(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        padding: '2rem'
                    }}
                >
                    <img
                        src={selectedImage}
                        alt="Review"
                        style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default ReviewList;

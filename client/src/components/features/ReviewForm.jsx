import React, { useState } from 'react';
import { Star, Upload, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
    const { user, showToast } = useApp();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [photos, setPhotos] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (photos.length + files.length > 3) {
            showToast('Maximum 3 photos allowed', 'error');
            return;
        }

        setPhotos([...photos, ...files]);

        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removePhoto = (index) => {
        setPhotos(photos.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            showToast('Please login to submit a review', 'error');
            return;
        }

        if (rating === 0) {
            showToast('Please select a rating', 'error');
            return;
        }

        if (!comment.trim()) {
            showToast('Please write a review', 'error');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('product', productId);
            formData.append('rating', rating);
            formData.append('comment', comment);

            photos.forEach(photo => {
                formData.append('photos', photo);
            });

            const token = localStorage.getItem('yuva-token');
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                showToast('Review submitted successfully!', 'success');
                setRating(0);
                setComment('');
                setPhotos([]);
                setPreviews([]);
                if (onReviewSubmitted) onReviewSubmitted();
            } else {
                const data = await res.json();
                showToast(data.message || 'Failed to submit review', 'error');
            }
        } catch (error) {
            showToast('Failed to submit review', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <p style={{ color: 'var(--text-muted)' }}>Please login to write a review</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Write a Review</h3>


            {/* Rating */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Your Rating</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <div
                            key={star}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                size={32}
                                style={{ transition: 'all 0.2s', pointerEvents: 'none' }}
                                fill={(hoverRating || rating) >= star ? 'var(--accent-cyan)' : 'none'}
                                stroke={(hoverRating || rating) >= star ? 'var(--accent-cyan)' : 'var(--text-muted)'}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Comment */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Your Review</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    maxLength={1000}
                    style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '1rem',
                        resize: 'vertical'
                    }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {comment.length}/1000 characters
                </p>
            </div>

            {/* Photo Upload */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    Add Photos (Optional - Max 3)
                </label>

                {previews.length > 0 && (
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        {previews.map((preview, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                                <img src={preview} alt={`Preview ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                                <button
                                    type="button"
                                    onClick={() => removePhoto(index)}
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        background: 'var(--accent-purple)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <X size={16} color="white" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {photos.length < 3 && (
                    <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px dashed var(--border-light)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}>
                        <Upload size={20} />
                        <span>Upload Photos</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoChange}
                            style={{ display: 'none' }}
                        />
                    </label>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '1rem' }}
            >
                {loading ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
            </button>
        </form>
    );
};

export default ReviewForm;

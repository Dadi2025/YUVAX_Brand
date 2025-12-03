import React, { useState } from 'react';
import { X, Upload, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const CreatePost = ({ onClose, onPostCreated }) => {
    const { products, showToast } = useApp();
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [caption, setCaption] = useState('');
    const [taggedProducts, setTaggedProducts] = useState([]);
    const [showProductSelector, setShowProductSelector] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                showToast('Image size must be less than 10MB', 'error');
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleProductTag = (productId) => {
        if (taggedProducts.includes(productId)) {
            setTaggedProducts(taggedProducts.filter(id => id !== productId));
        } else {
            setTaggedProducts([...taggedProducts, productId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            showToast('Please select an image', 'error');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('caption', caption);
            formData.append('taggedProducts', JSON.stringify(taggedProducts));

            const token = localStorage.getItem('yuva-token');
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                showToast('Post created successfully!', 'success');
                onPostCreated();
            } else {
                const data = await res.json();
                showToast(data.message || 'Failed to create post', 'error');
            }
        } catch (error) {
            showToast('Failed to create post', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: '#1a1a1a',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative',
                border: '1px solid var(--border-light)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--border-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    background: '#1a1a1a',
                    zIndex: 1
                }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Create Post</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                    {/* Image Upload */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            Photo *
                        </label>

                        {imagePreview ? (
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        width: '100%',
                                        maxHeight: '400px',
                                        objectFit: 'cover',
                                        borderRadius: '8px'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(null);
                                        setImagePreview(null);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: 'rgba(0,0,0,0.7)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <X size={20} color="white" />
                                </button>
                            </div>
                        ) : (
                            <label style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '3rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '2px dashed var(--border-light)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}>
                                <Upload size={48} color="var(--accent-cyan)" />
                                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                                    Click to upload image
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Max 10MB
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        )}
                    </div>

                    {/* Caption */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            Caption
                        </label>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Share your style story..."
                            maxLength={1000}
                            style={{
                                width: '100%',
                                minHeight: '100px',
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
                            {caption.length}/1000 characters
                        </p>
                    </div>

                    {/* Tag Products */}
                    <div style={{ marginBottom: '2rem' }}>
                        <button
                            type="button"
                            onClick={() => setShowProductSelector(!showProductSelector)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-light)',
                                borderRadius: '4px',
                                padding: '0.75rem 1rem',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                width: '100%',
                                justifyContent: 'center'
                            }}
                        >
                            <Tag size={20} />
                            Tag Products ({taggedProducts.length})
                        </button>

                        {showProductSelector && (
                            <div style={{
                                marginTop: '1rem',
                                maxHeight: '200px',
                                overflow: 'auto',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border-light)',
                                borderRadius: '4px',
                                padding: '1rem'
                            }}>
                                {products.slice(0, 20).map(product => (
                                    <label
                                        key={product.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.5rem',
                                            cursor: 'pointer',
                                            borderRadius: '4px',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={taggedProducts.includes(product.id)}
                                            onChange={() => toggleProductTag(product.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                        <span style={{ fontSize: '0.875rem' }}>{product.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || !image}
                        className="btn-primary"
                        style={{ width: '100%', padding: '1rem' }}
                    >
                        {loading ? 'POSTING...' : 'POST'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;

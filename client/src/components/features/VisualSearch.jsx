import React, { useState } from 'react';
import { X, Upload, Camera, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const VisualSearch = ({ isOpen, onClose }) => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size must be less than 5MB');
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setResults(null);
        }
    };

    const handleSearch = async () => {
        if (!image) {
            alert('Please select an image first');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', image);

            const res = await fetch('/api/visual-search', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setResults(data);
            } else {
                alert('Visual search failed. Please try again.');
            }
        } catch (error) {
            console.error('Visual search error:', error);
            alert('Visual search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setImage(null);
        setImagePreview(null);
        setResults(null);
    };

    if (!isOpen) return null;

    return (
        <div style={{
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
            padding: '2rem',
            overflow: 'auto'
        }}>
            <div style={{
                background: '#1a1a1a',
                borderRadius: '12px',
                width: '100%',
                maxWidth: results ? '1200px' : '600px',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative',
                border: '1px solid var(--border-light)',
                transition: 'max-width 0.3s ease'
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Camera size={24} color="var(--accent-cyan)" />
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Visual Search</h2>
                    </div>
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

                {/* Content */}
                <div style={{ padding: '2rem' }}>
                    {!results ? (
                        /* Upload Section */
                        <div>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center' }}>
                                Upload an image to find similar products
                            </p>

                            {imagePreview ? (
                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                                width: '100%',
                                                maxHeight: '400px',
                                                objectFit: 'contain',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border-light)'
                                            }}
                                        />
                                        <button
                                            onClick={handleReset}
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

                                    <button
                                        onClick={handleSearch}
                                        disabled={loading}
                                        className="btn-primary"
                                        style={{
                                            width: '100%',
                                            maxWidth: '400px',
                                            margin: '2rem auto 0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            padding: '1rem'
                                        }}
                                    >
                                        <Search size={20} />
                                        {loading ? 'SEARCHING...' : 'SEARCH SIMILAR PRODUCTS'}
                                    </button>
                                </div>
                            ) : (
                                <label style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '4rem 2rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '2px dashed var(--border-light)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    maxWidth: '500px',
                                    margin: '0 auto'
                                }}>
                                    <Upload size={64} color="var(--accent-cyan)" />
                                    <p style={{ marginTop: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}>
                                        Click to upload image
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                        Supports JPG, PNG, WEBP (Max 5MB)
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
                    ) : (
                        /* Results Section */
                        <div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '2rem',
                                paddingBottom: '1rem',
                                borderBottom: '1px solid var(--border-light)'
                            }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                                        Similar Products Found
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        Detected color: <span style={{
                                            color: 'var(--accent-cyan)',
                                            fontWeight: 'bold',
                                            textTransform: 'capitalize'
                                        }}>{results.detectedColor}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="btn-secondary"
                                    style={{ padding: '0.75rem 1.5rem' }}
                                >
                                    New Search
                                </button>
                            </div>

                            {results.results && results.results.length > 0 ? (
                                <div className="product-grid">
                                    {results.results.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    <p>No similar products found. Try a different image.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisualSearch;

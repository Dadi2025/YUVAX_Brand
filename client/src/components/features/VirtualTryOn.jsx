import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Download } from 'lucide-react';

const VirtualTryOn = ({ product, isOpen, onClose }) => {
    const [userImage, setUserImage] = useState(null);
    const [userImagePreview, setUserImagePreview] = useState(null);
    const [overlayOpacity, setOverlayOpacity] = useState(0.9);
    const [overlaySize, setOverlaySize] = useState(50);
    const [overlayPosition, setOverlayPosition] = useState({ x: 50, y: 30 });
    const canvasRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDownload = () => {
        if (!userImagePreview || !product.image) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const overlay = new Image();

        img.src = userImagePreview;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            overlay.src = product.image;
            overlay.crossOrigin = "anonymous";
            overlay.onload = () => {
                const w = (canvas.width * overlaySize) / 100;
                const h = (overlay.height / overlay.width) * w;
                const x = (canvas.width * overlayPosition.x) / 100 - w / 2;
                const y = (canvas.height * overlayPosition.y) / 100 - h / 2;

                ctx.globalAlpha = overlayOpacity;
                ctx.drawImage(overlay, x, y, w, h);

                const link = document.createElement('a');
                link.download = 'virtual-tryon.png';
                link.href = canvas.toDataURL();
                link.click();
            };
        };
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
            padding: '2rem'
        }}>
            <div style={{
                background: '#1a1a1a',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '900px',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Camera size={24} color="var(--accent-purple)" />
                        <div>
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Virtual Try-On</h2>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                                {product.name}
                            </p>
                        </div>
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
                    {!userImagePreview ? (
                        /* Upload Section */
                        <div>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center' }}>
                                Upload your photo to see how this product looks on you
                            </p>

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
                                transition: 'all 0.3s'
                            }}>
                                <Upload size={64} color="var(--accent-purple)" />
                                <p style={{ marginTop: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}>
                                    Click to upload your photo
                                </p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Best results with front-facing photos
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    ) : (
                        /* Try-On Section */
                        <div>
                            {/* Preview Area */}
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '600px',
                                margin: '0 auto 2rem',
                                aspectRatio: '3/4',
                                background: '#000',
                                borderRadius: '8px',
                                overflow: 'hidden'
                            }}>
                                {/* User Image */}
                                <img
                                    src={userImagePreview}
                                    alt="User"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    }}
                                />

                                {/* Product Overlay */}
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{
                                        position: 'absolute',
                                        left: `${overlayPosition.x}%`,
                                        top: `${overlayPosition.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        width: `${overlaySize}%`,
                                        opacity: overlayOpacity,
                                        pointerEvents: 'none',
                                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                                    }}
                                />
                            </div>

                            {/* Controls */}
                            <div style={{
                                background: 'rgba(255,255,255,0.03)',
                                padding: '1.5rem',
                                borderRadius: '8px',
                                marginBottom: '1rem'
                            }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Adjust Overlay</h3>

                                {/* Opacity Control */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                        Opacity: {Math.round(overlayOpacity * 100)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={overlayOpacity}
                                        onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                {/* Size Control */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                        Size: {overlaySize}%
                                    </label>
                                    <input
                                        type="range"
                                        min="20"
                                        max="100"
                                        step="5"
                                        value={overlaySize}
                                        onChange={(e) => setOverlaySize(parseInt(e.target.value))}
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                {/* Position Controls */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                            Horizontal Position
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value={overlayPosition.x}
                                            onChange={(e) => setOverlayPosition({ ...overlayPosition, x: parseInt(e.target.value) })}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                            Vertical Position
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value={overlayPosition.y}
                                            onChange={(e) => setOverlayPosition({ ...overlayPosition, y: parseInt(e.target.value) })}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => {
                                        setUserImage(null);
                                        setUserImagePreview(null);
                                    }}
                                    className="btn-secondary"
                                    style={{ flex: 1, padding: '1rem' }}
                                >
                                    Try Different Photo
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="btn-primary"
                                    style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    <Download size={20} />
                                    Download Image
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VirtualTryOn;

import React, { useRef, useState, useEffect } from 'react';

const VirtualTryOn = ({ isOpen, onClose, productImage }) => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const [captured, setCaptured] = useState(null);

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isOpen]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please allow camera permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const takeSnapshot = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');

        // Draw video frame
        ctx.drawImage(videoRef.current, 0, 0);

        // Draw product overlay (centered)
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = productImage;
        img.onload = () => {
            // Calculate aspect ratio to fit overlay nicely
            const scale = 0.5; // Overlay takes 50% of width
            const w = canvas.width * scale;
            const h = (img.height / img.width) * w;
            const x = (canvas.width - w) / 2;
            const y = (canvas.height - h) / 2 + 100; // Offset slightly down (chest area)

            ctx.drawImage(img, x, y, w, h);
            setCaptured(canvas.toDataURL('image/png'));
        };
        // Fallback if image load fails or for immediate capture without overlay logic complexity in canvas for now
        // For this demo, we might just capture the video frame and overlay HTML element is better for "Live" view
        // But for "Snapshot", we need to draw it.
        // Let's simplify: Just capture video frame for now, user sees overlay in UI.
        setCaptured(canvas.toDataURL('image/png'));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
            <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-lg w-full max-w-2xl overflow-hidden relative shadow-[0_0_50px_rgba(0,243,255,0.1)]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-[var(--accent-cyan)] hover:text-black transition-colors"
                >
                    ✕
                </button>

                <div className="p-4 border-b border-[var(--border-light)] flex justify-between items-center">
                    <h3 className="text-xl font-bold font-[var(--font-display)]">Virtual Try-On</h3>
                    <span className="text-xs bg-[var(--accent-purple)] text-white px-2 py-1 rounded uppercase tracking-wider">Beta</span>
                </div>

                <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
                    {error ? (
                        <div className="text-center p-8">
                            <div className="text-4xl mb-4">📷</div>
                            <p className="text-red-500 mb-4">{error}</p>
                            <button onClick={startCamera} className="btn-secondary">Retry Camera</button>
                        </div>
                    ) : captured ? (
                        <img src={captured} alt="Captured" className="w-full h-full object-cover" />
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover transform -scale-x-100" // Mirror effect
                            />
                            {/* Product Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <img
                                    src={productImage}
                                    alt="Try On"
                                    className="w-1/2 opacity-90 drop-shadow-2xl"
                                    style={{ transform: 'translateY(10%)' }} // Position slightly lower
                                />
                            </div>
                            <div className="absolute bottom-4 left-0 w-full text-center text-white/70 text-xs pointer-events-none">
                                Align yourself with the product
                            </div>
                        </>
                    )}
                </div>

                <div className="p-6 flex justify-center gap-4">
                    {captured ? (
                        <>
                            <button
                                onClick={() => setCaptured(null)}
                                className="btn-secondary"
                            >
                                Retake
                            </button>
                            <a
                                href={captured}
                                download="yuva-tryon.png"
                                className="btn-primary flex items-center gap-2"
                            >
                                <span>⬇️</span> Save Photo
                            </a>
                        </>
                    ) : (
                        <button
                            onClick={takeSnapshot}
                            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-110 transition-transform"
                        >
                            <div className="w-12 h-12 rounded-full bg-[var(--accent-cyan)]"></div>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VirtualTryOn;

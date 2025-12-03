import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

const SizeCalculator = ({ isOpen, onClose, onSizeRecommended }) => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('cm'); // cm or ft
    const [result, setResult] = useState(null);

    if (!isOpen) return null;

    const calculateSize = () => {
        let h = parseFloat(height);
        const w = parseFloat(weight);

        if (!h || !w) return;

        // Convert feet to cm if needed
        if (unit === 'ft') {
            h = h * 30.48;
        }

        // Simple heuristic logic (can be refined)
        let recommendedSize = 'M';

        // BMI-ish logic combined with height
        if (h < 160) {
            if (w < 50) recommendedSize = 'XS';
            else if (w < 60) recommendedSize = 'S';
            else recommendedSize = 'M';
        } else if (h < 170) {
            if (w < 60) recommendedSize = 'S';
            else if (w < 70) recommendedSize = 'M';
            else recommendedSize = 'L';
        } else if (h < 180) {
            if (w < 70) recommendedSize = 'M';
            else if (w < 80) recommendedSize = 'L';
            else recommendedSize = 'XL';
        } else {
            if (w < 80) recommendedSize = 'L';
            else if (w < 90) recommendedSize = 'XL';
            else recommendedSize = 'XXL';
        }

        setResult(recommendedSize);
    };

    const handleApply = () => {
        if (result && onSizeRecommended) {
            onSizeRecommended(result);
            onClose();
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
                padding: '2rem',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '400px',
                position: 'relative',
                border: '1px solid var(--border-light)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        background: 'rgba(74, 222, 128, 0.1)',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        color: '#4ade80'
                    }}>
                        <Ruler size={30} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Find Your Size</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Enter your details for a recommendation</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Height</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder={unit === 'cm' ? "175" : "5.9"}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '4px',
                                    color: 'white'
                                }}
                            />
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                style={{
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '4px',
                                    color: 'white'
                                }}
                            >
                                <option value="cm">cm</option>
                                <option value="ft">ft</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Weight (kg)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="70"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-light)',
                                borderRadius: '4px',
                                color: 'white'
                            }}
                        />
                    </div>

                    {result ? (
                        <div style={{
                            background: 'rgba(74, 222, 128, 0.1)',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            textAlign: 'center',
                            border: '1px solid rgba(74, 222, 128, 0.2)'
                        }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Recommended Size</p>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4ade80' }}>{result}</div>
                            <button
                                onClick={handleApply}
                                style={{
                                    marginTop: '1rem',
                                    background: '#4ade80',
                                    color: 'black',
                                    border: 'none',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '20px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Apply Size
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={calculateSize}
                            className="btn-primary"
                            style={{ width: '100%', padding: '1rem' }}
                            disabled={!height || !weight}
                        >
                            Calculate Size
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SizeCalculator;

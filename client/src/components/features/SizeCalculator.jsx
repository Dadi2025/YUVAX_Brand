import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const SizeCalculator = ({ category, onBack }) => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [recommendedSize, setRecommendedSize] = useState(null);

    const calculateSize = () => {
        const h = parseInt(height);
        const w = parseInt(weight);

        if (!h || !w) {
            alert('Please enter both height and weight');
            return;
        }

        // Simple size calculation algorithm based on height and weight
        let size = 'M'; // default

        if (category === 'Joggers') {
            // For joggers, focus more on weight
            if (w < 60) size = 'S';
            else if (w < 70) size = 'M';
            else if (w < 80) size = 'L';
            else if (w < 90) size = 'XL';
            else size = 'XXL';
        } else {
            // For tops (Hoodies, Tshirts), consider both height and weight
            const bmi = w / ((h / 100) ** 2);

            if (h < 165) {
                if (bmi < 20) size = 'S';
                else if (bmi < 23) size = 'M';
                else if (bmi < 26) size = 'L';
                else size = 'XL';
            } else if (h < 175) {
                if (bmi < 19) size = 'S';
                else if (bmi < 22) size = 'M';
                else if (bmi < 25) size = 'L';
                else if (bmi < 28) size = 'XL';
                else size = 'XXL';
            } else {
                if (bmi < 20) size = 'M';
                else if (bmi < 23) size = 'L';
                else if (bmi < 26) size = 'XL';
                else size = 'XXL';
            }
        }

        setRecommendedSize(size);
    };

    return (
        <div>
            <button
                onClick={onBack}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-cyan)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem'
                }}
            >
                <ArrowLeft size={16} /> Back to Size Chart
            </button>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Find Your Perfect Size</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Enter your measurements and we'll recommend the best size for you
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Height Input */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Height (cm)
                    </label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="e.g., 175"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '4px',
                            color: 'white',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                {/* Weight Input */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Weight (kg)
                    </label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="e.g., 70"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '4px',
                            color: 'white',
                            fontSize: '1rem'
                        }}
                    />
                </div>
            </div>

            <button
                onClick={calculateSize}
                className="btn-primary"
                style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem' }}
            >
                CALCULATE MY SIZE
            </button>

            {/* Recommended Size Result */}
            {recommendedSize && (
                <div style={{
                    padding: '2rem',
                    background: 'rgba(0,243,255,0.1)',
                    border: '2px solid var(--accent-cyan)',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Your Recommended Size
                    </p>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
                        {recommendedSize}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        This is a recommendation based on your measurements. For the best fit, please refer to the size chart.
                    </p>
                </div>
            )}

            {/* Tips */}
            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <strong>💡 Tip:</strong> If you're between sizes, we recommend sizing up for a more relaxed fit or sizing down for a slimmer fit.
                </p>
            </div>
        </div>
    );
};

export default SizeCalculator;

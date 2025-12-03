import React, { useState } from 'react';

const SizeCalculator = ({ isOpen, onClose, onSelectSize }) => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [fit, setFit] = useState('regular'); // tight, regular, loose
    const [result, setResult] = useState(null);

    if (!isOpen) return null;

    const calculateSize = () => {
        if (!height || !weight) return;

        const h = parseInt(height);
        const w = parseInt(weight);

        // Simplified logic for demo purposes
        // In a real app, this would use specific brand size charts
        let recommendedSize = 'M';
        let confidence = 85;

        // Basic BMI-ish logic + Height checks
        if (h < 160) {
            recommendedSize = w < 50 ? 'XS' : w < 60 ? 'S' : 'M';
        } else if (h < 170) {
            recommendedSize = w < 60 ? 'S' : w < 70 ? 'M' : 'L';
        } else if (h < 180) {
            recommendedSize = w < 70 ? 'M' : w < 80 ? 'L' : 'XL';
        } else {
            recommendedSize = w < 80 ? 'L' : w < 90 ? 'XL' : 'XXL';
        }

        // Adjust for fit preference
        if (fit === 'tight') {
            // Maybe suggest size down if on the edge, or just note it
            confidence += 5;
        } else if (fit === 'loose') {
            // Suggest size up logic could go here
            // For now, we'll keep the base size but adjust confidence text
        }

        setResult({ size: recommendedSize, confidence });
    };

    const handleApply = () => {
        if (result) {
            onSelectSize(result.size);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-lg w-full max-w-md p-6 relative animate-scale-in shadow-[0_0_50px_rgba(0,243,255,0.1)]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white"
                >
                    ✕
                </button>

                <h3 className="text-xl font-bold mb-1 font-[var(--font-display)]">Find Your Perfect Fit</h3>
                <p className="text-[var(--text-muted)] text-sm mb-6">Answer 3 simple questions to get a size recommendation.</p>

                {!result ? (
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Height (cm)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="e.g. 175"
                                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[var(--border-light)] rounded px-3 py-2.5 text-sm focus:border-[var(--accent-cyan)] outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Weight (kg)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="e.g. 70"
                                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[var(--border-light)] rounded px-3 py-2.5 text-sm focus:border-[var(--accent-cyan)] outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Fit Preference</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['tight', 'regular', 'loose'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFit(f)}
                                        className={`py-2 rounded text-sm capitalize transition-colors ${fit === f
                                                ? 'bg-[var(--accent-cyan)] text-black font-bold'
                                                : 'bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.1)]'
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={calculateSize}
                            disabled={!height || !weight}
                            className="w-full btn-primary py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Calculate My Size
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-4 animate-fade-in">
                        <div className="w-20 h-20 rounded-full bg-[rgba(0,243,255,0.1)] border-2 border-[var(--accent-cyan)] flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl font-bold text-[var(--accent-cyan)]">{result.size}</span>
                        </div>
                        <h4 className="text-lg font-bold mb-1">We recommend Size {result.size}</h4>
                        <p className="text-[var(--text-muted)] text-sm mb-6">Based on your measurements and {fit} fit preference ({result.confidence}% match).</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setResult(null)}
                                className="flex-1 py-2.5 rounded border border-[var(--border-light)] text-sm hover:border-white transition-colors"
                            >
                                Recalculate
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex-1 btn-primary py-2.5 text-sm"
                            >
                                Select Size {result.size}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SizeCalculator;

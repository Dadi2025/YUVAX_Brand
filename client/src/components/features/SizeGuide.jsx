import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import SizeCalculator from './SizeCalculator';

const SizeGuide = ({ isOpen, onClose, category }) => {
    const [showCalculator, setShowCalculator] = useState(false);

    if (!isOpen) return null;

    // Size charts for different categories
    const sizeCharts = {
        Hoodies: {
            measurements: ['Chest (inches)', 'Length (inches)', 'Shoulder (inches)'],
            sizes: {
                S: ['36-38', '26', '17'],
                M: ['38-40', '27', '18'],
                L: ['40-42', '28', '19'],
                XL: ['42-44', '29', '20'],
                XXL: ['44-46', '30', '21']
            }
        },
        Tshirts: {
            measurements: ['Chest (inches)', 'Length (inches)', 'Shoulder (inches)'],
            sizes: {
                S: ['36-38', '27', '16.5'],
                M: ['38-40', '28', '17.5'],
                L: ['40-42', '29', '18.5'],
                XL: ['42-44', '30', '19.5'],
                XXL: ['44-46', '31', '20.5']
            }
        },
        Joggers: {
            measurements: ['Waist (inches)', 'Length (inches)', 'Hip (inches)'],
            sizes: {
                S: ['28-30', '39', '36-38'],
                M: ['30-32', '40', '38-40'],
                L: ['32-34', '41', '40-42'],
                XL: ['34-36', '42', '42-44'],
                XXL: ['36-38', '43', '44-46']
            }
        },
        default: {
            measurements: ['Chest (inches)', 'Length (inches)', 'Shoulder (inches)'],
            sizes: {
                S: ['36-38', '26-27', '17'],
                M: ['38-40', '27-28', '18'],
                L: ['40-42', '28-29', '19'],
                XL: ['42-44', '29-30', '20'],
                XXL: ['44-46', '30-31', '21']
            }
        }
    };

    const chart = sizeCharts[category] || sizeCharts.default;

    return (
        <div
            style={{
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
                padding: '2rem'
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'var(--bg-dark)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    maxWidth: '800px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    position: 'relative'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '2rem',
                    borderBottom: '1px solid var(--border-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    background: 'var(--bg-dark)',
                    zIndex: 10
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Size Guide</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Find your perfect fit</p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '2rem' }}>
                    {!showCalculator ? (
                        <>
                            {/* Size Chart */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Ruler size={20} style={{ color: 'var(--accent-cyan)' }} />
                                    Size Chart - {category}
                                </h3>

                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        overflow: 'hidden'
                                    }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(0,243,255,0.1)' }}>
                                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Size</th>
                                                {chart.measurements.map((measurement, idx) => (
                                                    <th key={idx} style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid var(--border-light)' }}>
                                                        {measurement}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(chart.sizes).map(([size, measurements]) => (
                                                <tr key={size} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                                    <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{size}</td>
                                                    {measurements.map((measurement, idx) => (
                                                        <td key={idx} style={{ padding: '1rem', textAlign: 'center' }}>{measurement}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* How to Measure */}
                            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>How to Measure</h3>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <li style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span style={{ color: 'var(--accent-cyan)' }}>•</span>
                                        <span><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal</span>
                                    </li>
                                    <li style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span style={{ color: 'var(--accent-cyan)' }}>•</span>
                                        <span><strong>Length:</strong> Measure from the highest point of the shoulder to the bottom hem</span>
                                    </li>
                                    <li style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span style={{ color: 'var(--accent-cyan)' }}>•</span>
                                        <span><strong>Shoulder:</strong> Measure from one shoulder point to the other across the back</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Find My Size Button */}
                            <button
                                onClick={() => setShowCalculator(true)}
                                className="btn-primary"
                                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                            >
                                FIND MY SIZE
                            </button>
                        </>
                    ) : (
                        <SizeCalculator category={category} onBack={() => setShowCalculator(false)} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SizeGuide;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const CompleteLook = ({ currentProduct }) => {
    const { products } = useApp();
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        if (products.length > 0 && currentProduct) {
            // Simple logic: Find products in the same category, excluding the current one
            // In a real app, this could be more sophisticated (e.g., matching tags like "summer", "formal")
            const related = products
                .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
                .slice(0, 4); // Limit to 4 items

            // If not enough same-category items, just fill with others for demo
            if (related.length < 4) {
                const others = products
                    .filter(p => p.id !== currentProduct.id && !related.includes(p))
                    .slice(0, 4 - related.length);
                setRelatedProducts([...related, ...others]);
            } else {
                setRelatedProducts(related);
            }
        }
    }, [products, currentProduct]);

    if (relatedProducts.length === 0) return null;

    return (
        <div style={{ marginTop: '4rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>
                Complete The Look
            </h3>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.5rem'
            }}>
                {relatedProducts.map(product => (
                    <Link
                        to={`/shop/${product.id}`}
                        key={product.id}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            transition: 'transform 0.3s ease',
                            height: '100%'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ height: '250px', overflow: 'hidden' }}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {product.name}
                                </h4>
                                <p style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>
                                    ₹{product.price}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CompleteLook;

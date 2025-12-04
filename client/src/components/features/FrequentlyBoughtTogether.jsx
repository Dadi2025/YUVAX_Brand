import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';

const FrequentlyBoughtTogether = ({ productId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFrequentlyBought = async () => {
            try {
                const { data } = await axios.get(`/api/recommendations/frequently-bought/${productId}`);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching frequently bought:', error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchFrequentlyBought();
        }
    }, [productId]);

    if (loading || products.length === 0) {
        return null;
    }

    return (
        <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Frequently Bought Together</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem'
            }}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default FrequentlyBoughtTogether;

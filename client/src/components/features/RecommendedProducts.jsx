import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';

const RecommendedProducts = ({ title = "You May Also Like", userId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const userInfo = localStorage.getItem('userInfo');
                const token = userInfo ? JSON.parse(userInfo).token : null;

                const config = token ? {
                    headers: { Authorization: `Bearer ${token}` }
                } : {};

                const { data } = await axios.get('/api/recommendations/for-you', config);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                // Fallback to trending if personalized fails
                try {
                    const { data } = await axios.get('/api/recommendations/trending');
                    setProducts(data);
                } catch (err) {
                    console.error('Error fetching trending:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [userId]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>Loading recommendations...</div>;
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>{title}</h2>
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

export default RecommendedProducts;

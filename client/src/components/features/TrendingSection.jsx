import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';
import { TrendingUp } from 'lucide-react';

const TrendingSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const { data } = await axios.get('/api/recommendations/trending');
                setProducts(data);
            } catch (error) {
                console.error('Error fetching trending:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    if (loading) return null; // Silent loading
    if (products.length === 0) return null;

    return (
        <section className="trending-section">
            <div className="flex items-center gap-3 mb-6 px-1">
                <TrendingUp size={28} className="text-black" />
                <h2 className="text-2xl font-black uppercase tracking-tight">Trending Now</h2>
            </div>

            <div className="trending-scroll-container">
                {products.map(product => (
                    <div key={product.id} className="trending-item">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TrendingSection;

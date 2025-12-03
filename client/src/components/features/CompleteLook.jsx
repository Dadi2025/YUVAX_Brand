import React from 'react';
import { useApp } from '../../context/AppContext';
import ProductCard from './ProductCard';

const CompleteLook = ({ currentProduct }) => {
    const { products } = useApp();

    if (!currentProduct) return null;

    // Logic to find complementary products
    const getComplementaryCategory = (category) => {
        const map = {
            'Men': ['Accessories', 'Footwear'], // Simplified for demo: usually would map Shirt -> Jeans
            'Women': ['Accessories', 'Footwear'],
            'Accessories': ['Men', 'Women'],
            'Footwear': ['Men', 'Women']
        };
        return map[category] || [];
    };

    // For a more realistic "Complete the Look", we'd map specific sub-categories
    // e.g., T-Shirt -> Jeans, Sneakers
    // Since we might only have broad categories in this demo data, we'll try to find
    // products from different categories or just "Best Sellers" if no specific match.

    let recommendations = products.filter(p =>
        p.id !== currentProduct.id &&
        p.category !== currentProduct.category // Suggest something different to "complete" the look
    );

    // If we don't have enough cross-category items, just show other items
    if (recommendations.length < 2) {
        recommendations = products.filter(p => p.id !== currentProduct.id);
    }

    // Limit to 4 items
    const displayProducts = recommendations.slice(0, 4);

    if (displayProducts.length === 0) return null;

    return (
        <div className="mt-16 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold font-[var(--font-display)]">Complete the Look</h2>
                    <p className="text-[var(--text-muted)] text-sm">Curated picks to style with this item.</p>
                </div>
                {/* Optional: Add All to Cart button could go here */}
            </div>

            <div className="product-grid">
                {displayProducts.map((product, index) => (
                    <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompleteLook;

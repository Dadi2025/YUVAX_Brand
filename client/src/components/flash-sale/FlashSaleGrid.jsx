import React from 'react';
import { ShoppingCart } from 'lucide-react';
import StockIndicator from './StockIndicator';
import '../../styles/flash-sale.css';

const FlashSaleGrid = ({ products }) => {
    if (!products || products.length === 0) return null;

    return (
        <div className="flash-grid">
            {products.map((item) => (
                <div key={item._id} className="flash-card">
                    <div className="flash-badge">-{item.discount}%</div>

                    <img
                        src={item.image || 'https://via.placeholder.com/300x300?text=Product'}
                        alt={item.title}
                        className="flash-image"
                    />

                    <div className="flash-details">
                        <h3 className="flash-title">{item.title}</h3>

                        <div className="flash-prices">
                            <span className="flash-price">₹{item.flashPrice}</span>
                            <span className="original-price">₹{item.originalPrice}</span>
                        </div>

                        <StockIndicator total={item.totalStock} sold={item.sold} />

                        <button className="flash-button">
                            Add to Cart
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FlashSaleGrid;

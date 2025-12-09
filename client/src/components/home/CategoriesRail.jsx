import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoriesRail.css';

const CATEGORIES = [
    { id: 'new', label: 'New', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop', filter: 'new' }, // High fashion model
    { id: 'men', label: 'Men', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=600&auto=format&fit=crop', filter: 'men' }, // Sharp men's portrait
    { id: 'women', label: 'Women', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop', filter: 'women' }, // High quality portrait
    { id: 'street', label: 'Street', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop', filter: 'streetwear' }, // Cool menswear street
    { id: 'tech', label: 'Tech', image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=600&auto=format&fit=crop', filter: 'techwear' }, // Clean minimal tech/clothing
    { id: 'acc', label: 'Access..', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d60f?q=80&w=600&auto=format&fit=crop', filter: 'accessories' }, // Premium minimalist watch
    { id: 'sale', label: 'Sale', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop', filter: 'sale', isSale: true }, // Shopping vibe / clothes rack
];

const CategoriesRail = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (filter) => {
        navigate(`/shop?category=${filter}`);
    };

    return (
        <div className="categories-rail">
            <h3 style={{
                textAlign: 'center',
                color: '#000000', // Pure Black
                fontSize: '1.1rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
                fontWeight: '800' // Extra Bold
            }}>
                Top Collections
            </h3>
            <div className="categories-rail-content">
                {CATEGORIES.map((cat) => (
                    <div
                        key={cat.id}
                        className={`category-item ${cat.isSale ? 'sale' : ''}`}
                        onClick={() => handleCategoryClick(cat.filter)}
                    >
                        <div className="category-icon-wrapper">
                            <img src={cat.image} alt={cat.label} className="category-image" />
                        </div>
                        <span className="category-label">{cat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesRail;

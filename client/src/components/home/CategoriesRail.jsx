import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoriesRail.css';

const CATEGORIES = [
    { id: 'new', label: 'New', image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=200&auto=format&fit=crop', filter: 'new' },
    { id: 'men', label: 'Men', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=200&auto=format&fit=crop', filter: 'men' },
    { id: 'women', label: 'Women', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200&auto=format&fit=crop', filter: 'women' },
    { id: 'street', label: 'Street', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop', filter: 'streetwear' },
    { id: 'tech', label: 'Tech', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop', filter: 'techwear' },
    { id: 'acc', label: 'Access..', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d60f?q=80&w=200&auto=format&fit=crop', filter: 'accessories' },
    { id: 'sale', label: 'Sale', image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=200&auto=format&fit=crop', filter: 'sale', isSale: true },
];

const CategoriesRail = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (filter) => {
        navigate(`/shop?category=${filter}`);
    };

    return (
        <div className="categories-rail">
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

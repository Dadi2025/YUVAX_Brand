import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Sparkles, Clock } from 'lucide-react';
import './SearchHeader.css';

const SearchHeader = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/shop?search=${encodeURIComponent(query)}&sort=newest`);
        }
    };

    const handleQuickSearch = (term) => {
        navigate(`/shop?search=${encodeURIComponent(term)}&sort=popular`);
    };

    return (
        <div className="search-header-container">
            <div className="container">
                <div className="search-header-content">
                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="header-search-form">
                        <div className="header-search-input-wrapper">
                            <Search className="header-search-icon" size={20} />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for products, brands and more..."
                                className="header-search-input"
                            />
                        </div>
                    </form>

                    {/* Quick Trending Options */}
                    <div className="header-quick-links">
                        <span className="quick-label">Trending:</span>
                        <button type="button" onClick={() => handleQuickSearch('New Arrivals')} className="quick-link-btn">
                            <Sparkles size={14} /> New Arrivals
                        </button>
                        <button type="button" onClick={() => handleQuickSearch('Best Sellers')} className="quick-link-btn">
                            <TrendingUp size={14} /> Best Sellers
                        </button>
                        <button type="button" onClick={() => handleQuickSearch('Summer Collection')} className="quick-link-btn">
                            <Clock size={14} /> Summer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchHeader;

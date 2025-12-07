import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import './GlobalSearch.css';

const GlobalSearch = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // default sort
    const navigate = useNavigate();
    const inputRef = useRef(null);

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/shop?search=${encodeURIComponent(query)}&sort=${sortBy}`);
            onClose();
            setQuery(''); // Reset query but keep sort preference? Or reset both. Let's reset query.
        }
    };

    if (!isOpen) return null;

    return (
        <div className="global-search-overlay" onClick={onClose}>
            <div className="global-search-container" onClick={e => e.stopPropagation()}>
                <button className="global-search-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <form onSubmit={handleSearch} className="global-search-form">
                    <div className="search-input-wrapper">
                        <Search className="search-icon-large" size={28} />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for products, collections..."
                            className="global-search-input"
                        />
                    </div>

                    {/* Quick Sort Options */}
                    <div className="search-sort-options">
                        <span className="sort-label">Sort By:</span>

                        <button
                            type="button"
                            className={`sort-chip ${sortBy === 'newest' ? 'active' : ''}`}
                            onClick={() => setSortBy('newest')}
                        >
                            <Clock size={14} /> Newest
                        </button>

                        <button
                            type="button"
                            className={`sort-chip ${sortBy === 'price-low' ? 'active' : ''}`}
                            onClick={() => setSortBy('price-low')}
                        >
                            <ArrowUp size={14} /> Price Low
                        </button>

                        <button
                            type="button"
                            className={`sort-chip ${sortBy === 'price-high' ? 'active' : ''}`}
                            onClick={() => setSortBy('price-high')}
                        >
                            <ArrowDown size={14} /> Price High
                        </button>

                        <button
                            type="button"
                            className={`sort-chip ${sortBy === 'popular' ? 'active' : ''}`}
                            onClick={() => setSortBy('popular')}
                        >
                            <TrendingUp size={14} /> Popular
                        </button>
                    </div>

                    <button type="submit" className="global-search-submit">
                        SEARCH
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GlobalSearch;

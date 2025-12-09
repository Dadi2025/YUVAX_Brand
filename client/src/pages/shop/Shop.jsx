import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { categories, priceRanges, genders, sizes, colors } from '../../data/products';
import ProductCard from '../../components/features/ProductCard';
import useVoiceSearch from '../../hooks/useVoiceSearch';
import { useApp } from '../../context/AppContext';
import './Shop.css';

const Shop = () => {
    const location = useLocation();
    const { products } = useApp();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedGender, setSelectedGender] = useState('All');
    const [selectedSize, setSelectedSize] = useState('All');
    const [selectedColor, setSelectedColor] = useState('All');
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const { isListening, transcript, isSupported, startListening } = useVoiceSearch();

    // Get search query from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get('search');
        if (search) {
            setSearchQuery(search);
        }
        const sort = params.get('sort');
        if (sort) {
            setSortBy(sort);
        }
    }, [location.search]);

    // Update search when voice transcript changes
    useEffect(() => {
        if (transcript) {
            setSearchQuery(transcript);
        }
    }, [transcript]);

    // Filter products
    let filteredProducts = Array.isArray(products) ? products : [];

    if (selectedCategory !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
    }

    if (selectedGender !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.gender === selectedGender);
    }

    if (selectedSize !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.sizes && p.sizes.includes(selectedSize));
    }

    if (selectedColor !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.colors && p.colors.includes(selectedColor));
    }

    if (selectedPriceRange) {
        filteredProducts = filteredProducts.filter(p =>
            p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
        );
    }

    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Sort products
    if (sortBy === 'price-low') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
        filteredProducts = [...filteredProducts].sort((a, b) => b.isNewArrival - a.isNewArrival);
    } else if (sortBy === 'popular') {
        filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
    }

    return (
        <div className="shop-page">
            <div className="container">
                <h1 className="shop-title">ALL COLLECTIONS</h1>

                <div className="shop-layout">
                    {/* Filters Sidebar */}
                    <aside className="shop-sidebar">
                        {/* Search */}
                        <div className="filter-group">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="filter-search-input"
                            />
                        </div>

                        {/* Voice Search */}
                        {isSupported && (
                            <div className="filter-group">
                                <button
                                    onClick={startListening}
                                    disabled={isListening}
                                    className={`voice-search-btn ${isListening ? 'listening' : ''}`}
                                >
                                    <span className="text-xl">🎤</span>
                                    {isListening ? 'Listening...' : 'Voice Search'}
                                </button>
                            </div>
                        )}

                        {/* Gender Filter */}
                        <div className="filter-group">
                            <h3 className="filter-title">Gender</h3>
                            {genders.map(gender => (
                                <button
                                    key={gender}
                                    onClick={() => {
                                        setSelectedGender(gender);
                                        setSelectedCategory('All'); // Reset category when gender changes
                                    }}
                                    className={`filter-btn ${selectedGender === gender ? 'active' : ''}`}
                                >
                                    {gender}
                                </button>
                            ))}
                        </div>

                        {/* Categories - Gender Based Logic simplified for UI */}
                        <div className="filter-group">
                            <h3 className="filter-title">Category</h3>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Size Filter */}
                        <div className="filter-group">
                            <h3 className="filter-title">Size</h3>
                            <div className="filter-grid">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(selectedSize === size ? 'All' : size)}
                                        className={`filter-chip ${selectedSize === size ? 'active' : ''}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Filter */}
                        <div className="filter-group">
                            <h3 className="filter-title">Color</h3>
                            <div className="filter-grid">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(selectedColor === color ? 'All' : color)}
                                        className={`filter-chip ${selectedColor === color ? 'active' : ''}`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="filter-group">
                            <h3 className="filter-title">Price</h3>
                            {priceRanges.map(range => (
                                <button
                                    key={range.label}
                                    onClick={() => setSelectedPriceRange(selectedPriceRange?.label === range.label ? null : range)}
                                    className={`filter-btn ${selectedPriceRange?.label === range.label ? 'active' : ''}`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>

                        {/* Clear Filters */}
                        <button
                            onClick={() => {
                                setSelectedCategory('All');
                                setSelectedGender('All');
                                setSelectedSize('All');
                                setSelectedColor('All');
                                setSelectedPriceRange(null);
                                setSearchQuery('');
                            }}
                            className="btn-clear-filters"
                        >
                            Clear Filters
                        </button>
                    </aside>

                    {/* Products Grid */}
                    <main>
                        <div className="flex justify-between items-center mb-8">
                            <p className="text-gray-500 font-medium">{filteredProducts.length} Results</p>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-transparent border border-gray-200 py-2 pl-4 pr-8 rounded-md focus:outline-none focus:border-black cursor-pointer"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="popular">Popularity</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="product-grid">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-lg">
                                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                                <button
                                    className="mt-4 text-black font-bold border-b border-black pb-1 hover:text-accent-secondary hover:border-accent-secondary"
                                    onClick={() => {
                                        setSelectedCategory('All');
                                        setSelectedGender('All');
                                        setSelectedSize('All');
                                        setSelectedColor('All');
                                        setSelectedPriceRange(null);
                                        setSearchQuery('');
                                    }}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;

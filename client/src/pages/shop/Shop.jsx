import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { categories, priceRanges, genders, sizes, colors } from '../../data/products';
import ProductCard from '../../components/features/ProductCard';
import useVoiceSearch from '../../hooks/useVoiceSearch';
import { useApp } from '../../context/AppContext';

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
    }

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>ALL COLLECTIONS</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '3rem' }}>
                    {/* Filters Sidebar */}
                    <div>
                        {/* Search */}
                        <div style={{ marginBottom: '2rem' }}>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '4px',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* Voice Search */}
                        {isSupported && (
                            <div style={{ marginBottom: '2rem' }}>
                                <button
                                    onClick={startListening}
                                    disabled={isListening}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: isListening ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '4px',
                                        color: isListening ? 'black' : 'white',
                                        cursor: isListening ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    <span style={{ fontSize: '1.25rem' }}>🎤</span>
                                    {isListening ? 'Listening...' : 'Voice Search'}
                                </button>
                            </div>
                        )}

                        {/* Categories */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category</h3>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '0.5rem 0',
                                        background: 'none',
                                        border: 'none',
                                        color: selectedCategory === cat ? 'var(--accent-cyan)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Gender Filter */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Gender</h3>
                            {genders.map(gender => (
                                <button
                                    key={gender}
                                    onClick={() => setSelectedGender(gender)}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '0.5rem 0',
                                        background: 'none',
                                        border: 'none',
                                        color: selectedGender === gender ? 'var(--accent-cyan)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {gender}
                                </button>
                            ))}
                        </div>

                        {/* Size Filter */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Size</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(selectedSize === size ? 'All' : size)}
                                        style={{
                                            padding: '0.25rem 0.5rem',
                                            background: selectedSize === size ? 'var(--accent-cyan)' : 'transparent',
                                            border: '1px solid var(--border-light)',
                                            color: selectedSize === size ? 'black' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Filter */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Color</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(selectedColor === color ? 'All' : color)}
                                        style={{
                                            padding: '0.25rem 0.5rem',
                                            background: selectedColor === color ? 'var(--accent-cyan)' : 'transparent',
                                            border: '1px solid var(--border-light)',
                                            color: selectedColor === color ? 'black' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Price</h3>
                            {priceRanges.map(range => (
                                <button
                                    key={range.label}
                                    onClick={() => setSelectedPriceRange(selectedPriceRange?.label === range.label ? null : range)}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '0.5rem 0',
                                        background: 'none',
                                        border: 'none',
                                        color: selectedPriceRange?.label === range.label ? 'var(--accent-cyan)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem'
                                    }}
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
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'none',
                                border: '1px solid var(--border-light)',
                                color: 'white',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase'
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>

                    {/* Products Grid */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <p style={{ color: 'var(--text-muted)' }}>{filteredProducts.length} products</p>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '4px',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="product-grid">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>No products found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { categories, genders, sizes, colors } from '../../data/products';

const ManageProducts = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useApp();
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'T-Shirts',
        gender: 'Unisex',
        price: '',
        originalPrice: '',
        image: '',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black'],
        description: '',
        stock: '',
        sizeChart: [],
        completeTheLook: []
    });

    if (!products) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
            stock: parseInt(formData.stock),
            images: [formData.image],
            sizeChart: formData.sizeChart,
            completeTheLook: formData.completeTheLook
        };

        if (editingProduct) {
            updateProduct(editingProduct.id, productData);
            setEditingProduct(null);
        } else {
            addProduct(productData);
        }

        setShowForm(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'T-Shirts',
            gender: 'Unisex',
            price: '',
            originalPrice: '',
            image: '',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Black'],
            description: '',
            stock: '',
            sizeChart: [],
            completeTheLook: []
        });
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            gender: product.gender,
            price: product.price.toString(),
            originalPrice: product.originalPrice?.toString() || '',
            image: product.image,
            sizes: product.sizes,
            colors: product.colors,
            description: product.description,
            stock: product.stock.toString(),
            sizeChart: product.sizeChart || [],
            completeTheLook: product.completeTheLook || []
        });
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Manage Products</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingProduct(null);
                        resetForm();
                    }}
                    className="btn-primary"
                >
                    {showForm ? 'Cancel' : '+ Add New Product'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Product Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Category *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white' }}
                            >
                                {categories.filter(c => c !== 'All').map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Gender *</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white' }}
                            >
                                {genders.filter(g => g !== 'All').map(gender => (
                                    <option key={gender} value={gender}>{gender}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Price (₹) *</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                min="0"
                                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Original Price (₹)</label>
                            <input
                                type="number"
                                value={formData.originalPrice}
                                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                min="0"
                                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Stock *</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                required
                                min="0"
                                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white' }}
                            />
                        </div>
                    </div>

                    {/* Sizes Selection */}
                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Available Sizes</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {sizes.map(size => (
                                <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: formData.sizes.includes(size) ? 'rgba(45, 212, 191, 0.2)' : 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '4px', border: formData.sizes.includes(size) ? '1px solid var(--accent-cyan)' : '1px solid var(--border-light)' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.sizes.includes(size)}
                                        onChange={() => {
                                            const newSizes = formData.sizes.includes(size)
                                                ? formData.sizes.filter(s => s !== size)
                                                : [...formData.sizes, size];
                                            setFormData({ ...formData, sizes: newSizes });
                                        }}
                                        style={{ display: 'none' }}
                                    />
                                    {size}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Colors Selection */}
                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Available Colors</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {colors.map(color => (
                                <label key={color} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: formData.colors.includes(color) ? 'rgba(192, 132, 252, 0.2)' : 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '4px', border: formData.colors.includes(color) ? '1px solid var(--accent-purple)' : '1px solid var(--border-light)' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.colors.includes(color)}
                                        onChange={() => {
                                            const newColors = formData.colors.includes(color)
                                                ? formData.colors.filter(c => c !== color)
                                                : [...formData.colors, color];
                                            setFormData({ ...formData, colors: newColors });
                                        }}
                                        style={{ display: 'none' }}
                                    />
                                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: color.toLowerCase() === 'neon cyan' ? '#00f3ff' : color.toLowerCase() }}></span>
                                    {color}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Image URL *</label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            required
                            placeholder="https://example.com/image.jpg"
                            style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white' }}
                        />
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={3}
                            style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'white' }}
                        />
                    </div>

                    {/* Size Chart Inputs */}
                    {formData.sizes.length > 0 && (
                        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Size Guide Measurements (Inches)</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                {formData.sizes.map(size => {
                                    const sizeData = formData.sizeChart.find(s => s.size === size) || { size, chest: '', waist: '', length: '', shoulder: '' };

                                    const handleSizeChange = (field, value) => {
                                        const newChart = [...formData.sizeChart.filter(s => s.size !== size)];
                                        newChart.push({ ...sizeData, [field]: value });
                                        setFormData({ ...formData, sizeChart: newChart });
                                    };

                                    return (
                                        <div key={size} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '4px' }}>
                                            <strong style={{ display: 'block', marginBottom: '0.5rem' }}>{size}</strong>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                                <input placeholder="Chest" type="number" value={sizeData.chest || ''} onChange={(e) => handleSizeChange('chest', e.target.value)} style={{ padding: '0.25rem', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px' }} />
                                                <input placeholder="Waist" type="number" value={sizeData.waist || ''} onChange={(e) => handleSizeChange('waist', e.target.value)} style={{ padding: '0.25rem', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px' }} />
                                                <input placeholder="Length" type="number" value={sizeData.length || ''} onChange={(e) => handleSizeChange('length', e.target.value)} style={{ padding: '0.25rem', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px' }} />
                                                <input placeholder="Shoulder" type="number" value={sizeData.shoulder || ''} onChange={(e) => handleSizeChange('shoulder', e.target.value)} style={{ padding: '0.25rem', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px' }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Complete The Look */}
                    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                        <h4 style={{ marginBottom: '1rem' }}>Complete The Look (Cross-Sell)</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Select products to display as recommendations.</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                            {products.filter(p => p.id !== editingProduct?.id).map(p => (
                                <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.5rem', background: formData.completeTheLook.includes(p._id) ? 'var(--accent-purple)' : '#333', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={Array.isArray(formData.completeTheLook) && formData.completeTheLook.includes(p._id)}
                                        onChange={() => {
                                            const current = Array.isArray(formData.completeTheLook) ? formData.completeTheLook : [];
                                            const newLinks = current.includes(p._id)
                                                ? current.filter(id => id !== p._id)
                                                : [...current, p._id];
                                            setFormData({ ...formData, completeTheLook: newLinks });
                                        }}
                                        style={{ display: 'none' }}
                                    />
                                    <img src={p.image} alt="" style={{ width: '20px', height: '20px', objectFit: 'cover', borderRadius: '2px' }} />
                                    {p.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}>
                        {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                </form>
            )}

            {/* Products List */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Product</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Category</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Gender</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Price</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Stock</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} style={{ borderTop: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <a href={`/product/${product._id || product.id}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit' }}>
                                            <img src={product.image} alt={product.name} style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                            <span>{product.name}</span>
                                        </a>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>{product.category}</td>
                                <td style={{ padding: '1rem' }}>{product.gender}</td>
                                <td style={{ padding: '1rem' }}>₹{product.price}</td>
                                <td style={{ padding: '1rem' }}>{product.stock}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEdit(product)}
                                            style={{ padding: '0.5rem 1rem', background: 'var(--accent-cyan)', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            style={{ padding: '0.5rem 1rem', background: 'var(--accent-purple)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProducts;

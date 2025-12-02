// Comprehensive product catalog for YUVA X with gender categories
export const defaultProducts = [
    // Men's Hoodies
    {
        id: 1,
        name: 'Cyberpunk Hoodie',
        category: 'Hoodies',
        gender: 'Men',
        price: 2499,
        originalPrice: 3499,
        image: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?q=80&w=1000&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1578681994506-b8f463449011?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Neon Cyan', 'Purple'],
        description: 'Premium cyberpunk-inspired hoodie with neon accents. Made from high-quality cotton blend for maximum comfort.',
        isNewArrival: true,
        rating: 4.5,
        reviews: 24,
        stock: 15
    },
    {
        id: 2,
        name: 'Tech Noir Hoodie',
        category: 'Hoodies',
        gender: 'Men',
        price: 2299,
        originalPrice: 2999,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Gray'],
        description: 'Minimalist tech-inspired hoodie with subtle geometric patterns.',
        isNewArrival: false,
        rating: 4.3,
        reviews: 18,
        stock: 20
    },

    // Men's T-Shirts
    {
        id: 3,
        name: 'Holographic Tee',
        category: 'T-Shirts',
        gender: 'Men',
        price: 899,
        originalPrice: 1299,
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Black', 'Cyan'],
        description: 'Futuristic t-shirt with holographic print. Breathable fabric perfect for Indian summers.',
        isNewArrival: true,
        rating: 4.7,
        reviews: 42,
        stock: 30
    },
    {
        id: 4,
        name: 'Neon Grid Tee',
        category: 'T-Shirts',
        gender: 'Men',
        price: 799,
        originalPrice: 999,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy'],
        description: 'Geometric grid pattern with neon highlights. Premium cotton fabric.',
        isNewArrival: false,
        rating: 4.4,
        reviews: 31,
        stock: 25
    },

    // Men's Pants
    {
        id: 5,
        name: 'Neon Cargo Pants',
        category: 'Pants',
        gender: 'Men',
        price: 1899,
        originalPrice: 2499,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop'],
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Black', 'Olive', 'Gray'],
        description: 'Tactical cargo pants with multiple pockets. Durable and stylish.',
        isNewArrival: false,
        rating: 4.6,
        reviews: 28,
        stock: 18
    },
    {
        id: 6,
        name: 'Tech Joggers',
        category: 'Pants',
        gender: 'Men',
        price: 1699,
        originalPrice: 2199,
        image: 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?q=80&w=1000&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1555689502-c4b22d76c56f?q=80&w=1000&auto=format&fit=crop'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Charcoal'],
        description: 'Comfortable tech joggers with zippered pockets. Perfect for casual wear.',
        isNewArrival: true,
        rating: 4.5,
        reviews: 35,
        stock: 22
    },

    // Unisex Accessories
    {
        id: 7,
        name: 'Techwear Vest',
        category: 'Accessories',
        gender: 'Unisex',
        price: 3499,
        originalPrice: 4499,
        image: 'https://images.unsplash.com/photo-1559563458-527698bf5295?q=80&w=1000&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1559563458-527698bf5295?q=80&w=1000&auto=format&fit=crop'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black'],
        description: 'Multi-pocket techwear vest. Water-resistant material with adjustable straps.',
        isNewArrival: false,
        rating: 4.8,
        reviews: 16,
        stock: 10
    },
    {
        id: 8,
        name: 'Cyber Backpack',
        category: 'Accessories',
        gender: 'Unisex',
        price: 2999,
        originalPrice: 3999,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'],
        sizes: ['One Size'],
        colors: ['Black', 'Gray'],
        description: 'Futuristic backpack with LED strips. USB charging port included.',
        isNewArrival: true,
        rating: 4.9,
        reviews: 52,
        stock: 12
    },

    // Women's T-Shirts
    {
        id: 9,
        name: 'Matrix Oversized Tee',
        category: 'T-Shirts',
        gender: 'Women',
        price: 999,
        originalPrice: 1499,
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'White'],
        description: 'Oversized fit with matrix-inspired graphics. 100% cotton.',
        isNewArrival: true,
        rating: 4.6,
        reviews: 38,
        stock: 28
    },
    {
        id: 10,
        name: 'Urban Utility Jacket',
        category: 'Hoodies',
        gender: 'Women',
        price: 3299,
        originalPrice: 4299,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop'],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Black', 'Olive', 'Navy'],
        description: 'Multi-functional utility jacket with removable hood. Weather-resistant.',
        isNewArrival: false,
        rating: 4.7,
        reviews: 21,
        stock: 14
    }
];

export const categories = ['All', 'Hoodies', 'T-Shirts', 'Pants', 'Accessories'];

export const genders = ['All', 'Men', 'Women', 'Unisex'];

export const priceRanges = [
    { label: 'Under ₹1000', min: 0, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: '₹2000 - ₹3000', min: 2000, max: 3000 },
    { label: 'Above ₹3000', min: 3000, max: 999999 }
];

export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];

export const colors = ['Black', 'White', 'Gray', 'Neon Cyan', 'Purple', 'Olive', 'Navy'];

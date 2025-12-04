import React from 'react';
import Hero from '../components/layout/Hero';
import ProductCard from '../components/features/ProductCard';
import FlashSaleBanner from '../components/flash-sale/FlashSaleBanner';
import FlashSaleGrid from '../components/flash-sale/FlashSaleGrid';
import { useApp } from '../context/AppContext';

const Home = () => {
  const { products } = useApp();
  const featuredProducts = (Array.isArray(products) ? products : []).slice(0, 4);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Hero />

      {/* Flash Sale Section */}
      <section className="container" style={{ marginTop: '2rem' }}>
        <FlashSaleBanner endTime={new Date(Date.now() + 86400000).toISOString()} />
        <FlashSaleGrid products={[
          {
            _id: 'fs1',
            title: 'Neon Cyber Jacket',
            flashPrice: 2499,
            originalPrice: 4999,
            discount: 50,
            totalStock: 100,
            sold: 85,
            image: 'https://images.unsplash.com/photo-1551488852-d814c937d101?w=500&q=80'
          },
          {
            _id: 'fs2',
            title: 'Holographic Sneakers',
            flashPrice: 1999,
            originalPrice: 3999,
            discount: 50,
            totalStock: 50,
            sold: 12,
            image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80'
          },
          {
            _id: 'fs3',
            title: 'LED Visor Glasses',
            flashPrice: 999,
            originalPrice: 1999,
            discount: 50,
            totalStock: 200,
            sold: 150,
            image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&q=80'
          },
          {
            _id: 'fs4',
            title: 'Cyberpunk Hoodie',
            flashPrice: 1499,
            originalPrice: 2999,
            discount: 50,
            totalStock: 75,
            sold: 45,
            image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&q=80'
          }
        ]} />
      </section>

      <section className="section-padding container">
        <div className="section-header">
          <div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>LATEST DROPS</h2>
            <div style={{ height: '2px', width: '5rem', background: 'white' }}></div>
          </div>
        </div>

        <div className="product-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container">
          <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', letterSpacing: '-0.025em' }}>JOIN THE MOVEMENT</h2>
            <p style={{ color: '#888', fontSize: '1.125rem', marginBottom: '3rem', maxWidth: '36rem', margin: '0 auto 3rem auto', fontWeight: 300 }}>
              Sign up for early access to new collections and exclusive drops.
              Be the first to wear the future.
            </p>
            <div className="newsletter-input-group">
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

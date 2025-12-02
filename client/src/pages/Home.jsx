import React from 'react';
import Hero from '../components/layout/Hero';
import ProductCard from '../components/features/ProductCard';
import { useApp } from '../context/AppContext';

const Home = () => {
  const { products } = useApp();
  const featuredProducts = (Array.isArray(products) ? products : []).slice(0, 4);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Hero />

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

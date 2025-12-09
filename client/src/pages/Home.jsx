import React from 'react';
import Hero from '../components/layout/Hero';
import CategoriesRail from '../components/home/CategoriesRail';
import TrustBar from '../components/home/TrustBar';

import ProductCard from '../components/features/ProductCard';
import FlashSaleBanner from '../components/flash-sale/FlashSaleBanner';
import FlashSaleGrid from '../components/flash-sale/FlashSaleGrid';
import { useApp } from '../context/AppContext';
import loyaltyService from '../services/loyaltyService';
import TrendingSection from '../components/features/TrendingSection';
import RecommendedProducts from '../components/features/RecommendedProducts';
import SearchHeader from '../components/layout/SearchHeader';
import './Home.css';

const Home = () => {
  const { products } = useApp();
  const featuredProducts = (Array.isArray(products) ? products : []).slice(0, 4);
  const [flashSales, setFlashSales] = React.useState([]);
  const [loadingFlash, setLoadingFlash] = React.useState(true);

  React.useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const sales = await loyaltyService.getActiveFlashSales();
        setFlashSales(sales);
      } catch (err) {
        console.error('Error fetching flash sales:', err);
      } finally {
        setLoadingFlash(false);
      }
    };
    fetchFlashSales();
  }, []);

  // Find the earliest ending sale for the banner timer
  const earliestEndTime = flashSales.length > 0
    ? flashSales.reduce((min, p) => p.endTime < min ? p.endTime : min, flashSales[0].endTime)
    : null;

  return (
    <div className="home-page">
      <SearchHeader />
      <Hero />

      {/* Categories Rail */}
      <CategoriesRail />

      {/* Flash Sale Section */}
      {flashSales.length > 0 && (
        <section className="container flash-sale-section">
          <FlashSaleBanner endTime={earliestEndTime} />
          <FlashSaleGrid products={flashSales} />
        </section>
      )}

      <section className="section-padding container">
        <div className="section-header">
          <div>
            <h2 className="section-title">LATEST DROPS</h2>
            <div className="latest-drops-separator"></div>
          </div>
        </div>

        <div className="product-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="container section-margin">
        <TrendingSection />
      </section>

      {/* Personalized Recommendations */}
      <section className="container section-margin">
        <RecommendedProducts title="Recommended For You" />
      </section>

      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">JOIN THE MOVEMENT</h2>
            <p className="newsletter-desc">
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

      {/* Trust Signals */}
      <TrustBar />
    </div>
  );
};

export default Home;

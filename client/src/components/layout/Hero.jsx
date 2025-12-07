import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="absolute inset-0 z-0 opacity-20"
        style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      <div className="container hero-grid relative z-10">
        <div>
          <span style={{ color: 'var(--accent-cyan)', letterSpacing: '0.3em', fontSize: '0.875rem', fontWeight: 'bold', display: 'block', marginBottom: '1.5rem' }}>EST. 2025 // NEO-INDIA</span>
          <h1 className="hero-title">
            FUTURE <br />
            <span className="text-gradient">WEAR</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '28rem', lineHeight: '1.75', fontWeight: 300 }}>
            Minimalist streetwear for the digital age.
            Engineered for comfort, designed for the future.
          </p>

          <div className="flex gap-6">
            <button className="btn-primary" onClick={() => navigate('/shop')}>Shop Now</button>
            <button className="btn-secondary" onClick={() => navigate('/shop')}>Lookbook</button>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5', background: '#1a1a1a' }}>
            <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top right, rgba(0, 243, 255, 0.1), rgba(188, 19, 254, 0.1))', mixBlendMode: 'overlay' }}></div>
            <img
              src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1000&auto=format&fit=crop"
              alt="Hero Fashion"
              className="w-full h-full object-cover"
              style={{ filter: 'grayscale(100%)' }}
            />

            <div className="absolute bottom-8 left-8 z-20">
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)' }}>COLLECTION 01</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>GENESIS</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroBanner from '../../assets/images/hero-banner.png';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="absolute inset-0 z-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, var(--accent-secondary) 0%, transparent 50%)' }}>
      </div>

      <div className="container hero-grid relative z-10">
        <div className="flex flex-col justify-center">
          <span className="text-sm font-bold tracking-widest mb-4 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-black"></span>
            NEW SEASON // DROP 01
          </span>
          <h1 className="hero-title mb-6">
            OWN YOUR <br />
            <span className="text-gradient">VIBE</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md font-medium">
            Street-ready fits designed for the bold.
            Limited drops. Premium cuts. No compromises.
          </p>

          <div className="flex gap-4">
            <button className="btn-primary" onClick={() => navigate('/shop')}>
              Shop The Drop
            </button>
            <button className="btn-secondary" onClick={() => navigate('/style-wall')}>
              View Lookbook
            </button>
          </div>
        </div>

        <div className="relative hidden md:block group">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5', borderRadius: 'var(--radius-lg)' }}>
            <img
              src={heroBanner}
              alt="Hero Fashion"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>

            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Featured</p>
                  <p className="font-bold text-black">Urban Utility Jacket</p>
                </div>
                <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

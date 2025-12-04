import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Flame } from 'lucide-react';

const FlashSale = ({ products = [] }) => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        // Set end time to midnight (24 hours from now)
        const endTime = new Date();
        endTime.setHours(24, 0, 0, 0);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div style={{
            background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '3rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Pattern */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }} />

            {/* Header */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                textAlign: 'center',
                marginBottom: '2rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Flame size={32} color="white" />
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                        Flash Sale
                    </h2>
                    <Flame size={32} color="white" />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.125rem' }}>
                    Deals end at midnight! Hurry up!
                </p>

                {/* Countdown Timer */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    marginTop: '1.5rem'
                }}>
                    {[
                        { label: 'Hours', value: timeLeft.hours },
                        { label: 'Minutes', value: timeLeft.minutes },
                        { label: 'Seconds', value: timeLeft.seconds }
                    ].map((item, index) => (
                        <div key={index} style={{
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '12px',
                            padding: '1rem 1.5rem',
                            minWidth: '80px'
                        }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
                                {String(item.value).padStart(2, '0')}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
            }}>
                {products.slice(0, 4).map((product) => (
                    <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'transform 0.2s',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ position: 'relative' }}>
                            <img
                                src={product.image}
                                alt={product.name}
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                            />
                            {product.discount && (
                                <div style={{
                                    position: 'absolute',
                                    top: '0.5rem',
                                    right: '0.5rem',
                                    background: '#ff6b6b',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.875rem',
                                    fontWeight: 'bold'
                                }}>
                                    -{product.discount}%
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>
                                {product.name}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ff6b6b' }}>
                                    ₹{product.salePrice || product.price}
                                </span>
                                {product.salePrice && (
                                    <span style={{ fontSize: '0.875rem', textDecoration: 'line-through', color: '#999' }}>
                                        ₹{product.price}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FlashSale;

import React from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            name: 'Arjun Mehta',
            location: 'Mumbai',
            rating: 5,
            text: 'Absolutely love the quality! The cyberpunk aesthetic is on point. Fast delivery and great customer service.',
            avatar: 'AM'
        },
        {
            name: 'Kavya Sharma',
            location: 'Delhi',
            rating: 5,
            text: 'Best streetwear brand in India! The fit is perfect and the designs are unique. Highly recommend!',
            avatar: 'KS'
        },
        {
            name: 'Rohan Patel',
            location: 'Bangalore',
            rating: 5,
            text: 'Premium quality at affordable prices. The hoodies are super comfortable and the prints are amazing.',
            avatar: 'RP'
        }
    ];

    const renderStars = (rating) => {
        return Array(rating).fill('⭐').join('');
    };

    return (
        <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                    <div className="testimonial-text">
                        "{testimonial.text}"
                    </div>
                    <div className="testimonial-author">
                        <div className="testimonial-avatar">
                            {testimonial.avatar}
                        </div>
                        <div className="testimonial-info">
                            <div className="testimonial-name">{testimonial.name}</div>
                            <div className="testimonial-location">{testimonial.location}</div>
                            <div className="testimonial-rating">
                                {renderStars(testimonial.rating)}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Testimonials;

import React, { useState } from 'react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How do I track my order?",
            answer: "You can track your order by going to the 'Track Order' page and entering your order ID, or by visiting your profile if you are logged in."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for all unworn items with original tags. You can initiate a return from your order history."
        },
        {
            question: "Do you ship internationally?",
            answer: "Currently, we only ship within India. We are planning to expand globally soon."
        },
        {
            question: "How can I find my size?",
            answer: "Check our 'Size Guide' on each product page. We also have an interactive size calculator to help you find the perfect fit."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit/debit cards, UPI, Net Banking, and Cash on Delivery (COD)."
        }
    ];

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>FREQUENTLY ASKED QUESTIONS</h1>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {faqs.map((faq, index) => (
                            <div key={index} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden' }}>
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    style={{
                                        width: '100%',
                                        padding: '1.5rem',
                                        textAlign: 'left',
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        fontSize: '1.125rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    {faq.question}
                                    <span style={{ color: 'var(--accent-cyan)' }}>{openIndex === index ? '−' : '+'}</span>
                                </button>
                                {openIndex === index && (
                                    <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;

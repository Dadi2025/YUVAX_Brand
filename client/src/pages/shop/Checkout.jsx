import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useApp } from '../../context/AppContext';
import { getAddressFromPincode } from '../../utils/pincodeService';

const Checkout = () => {
    const { cart, getCartTotal, user, placeOrder, showToast } = useApp();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [shippingInfo, setShippingInfo] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India'
    });
    const [paymentMethod, setPaymentMethod] = useState('upi');

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    const shipping = 99;
    const total = getCartTotal() + shipping;

    // Sanitize input
    const sanitizeInput = (value) => {
        return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
    };

    // Validate shipping information
    const validateShipping = () => {
        const newErrors = {};

        if (!shippingInfo.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (shippingInfo.name.length > 100) {
            newErrors.name = 'Name must be less than 100 characters';
        }

        if (!shippingInfo.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(shippingInfo.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        if (!shippingInfo.address.trim()) {
            newErrors.address = 'Address is required';
        } else if (shippingInfo.address.length > 200) {
            newErrors.address = 'Address must be less than 200 characters';
        }

        if (!shippingInfo.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!shippingInfo.state.trim()) {
            newErrors.state = 'State is required';
        }

        if (!shippingInfo.postalCode.trim()) {
            newErrors.postalCode = 'Postal code is required';
        } else if (!/^\d{6}$/.test(shippingInfo.postalCode)) {
            newErrors.postalCode = 'Postal code must be 6 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = async (field, value) => {
        setShippingInfo(prev => ({ ...prev, [field]: sanitizeInput(value) }));

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }

        // Auto-fill address on Pincode change
        if (field === 'postalCode' && value.length === 6) {
            try {
                const addressData = await getAddressFromPincode(value);
                setShippingInfo(prev => ({
                    ...prev,
                    city: addressData.city,
                    state: addressData.state,
                    country: addressData.country,
                    postalCode: value // Ensure pincode is preserved
                }));
                // Clear errors for auto-filled fields
                setErrors(prev => ({ ...prev, city: '', state: '', postalCode: '' }));
            } catch (error) {
                setErrors(prev => ({ ...prev, postalCode: 'Invalid Pincode' }));
            }
        }
    };

    const handleContinueToPayment = () => {
        if (validateShipping()) {
            setStep(2);
        } else {
            showToast('Please fix the errors in the form', 'error');
        }
    };

    const handlePlaceOrder = async () => {
        if (!validateShipping()) {
            setStep(1);
            showToast('Please fix the errors in the form', 'error');
            return;
        }

        setLoading(true);
        try {
            if (paymentMethod === 'razorpay') {
                const res = await loadRazorpay();
                if (!res) {
                    showToast('Razorpay SDK failed to load', 'error');
                    return;
                }

                // Create Order on Server
                const token = localStorage.getItem('token');
                const result = await fetch('/api/payment/create-razorpay-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ amount: total })
                });

                const data = await result.json();

                const options = {
                    key: "rzp_test_placeholder", // Enter the Key ID generated from the Dashboard
                    amount: data.amount,
                    currency: data.currency,
                    name: "YUVA X",
                    description: "Test Transaction",
                    image: "https://example.com/your_logo",
                    order_id: data.id,
                    handler: async function (response) {
                        // Verify Payment
                        try {
                            const verifyRes = await fetch('/api/payment/verify-payment', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            });

                            const verifyData = await verifyRes.json();

                            if (verifyData.message === 'Payment verified successfully') {
                                // Place actual order
                                const orderDetails = {
                                    shippingAddress: shippingInfo,
                                    paymentMethod: 'Razorpay',
                                    paymentResult: {
                                        id: response.razorpay_payment_id,
                                        status: 'COMPLETED',
                                        email_address: user.email
                                    }
                                };
                                const order = await placeOrder(orderDetails);
                                navigate(`/order-confirmation?orderId=${order._id || order.id}`);
                            } else {
                                showToast('Payment verification failed', 'error');
                            }
                        } catch (error) {
                            console.error(error);
                            showToast('Payment verification failed', 'error');
                        }
                    },
                    prefill: {
                        name: shippingInfo.name,
                        email: user.email,
                        contact: shippingInfo.phone
                    },
                    notes: {
                        address: shippingInfo.address
                    },
                    theme: {
                        color: "#00f3ff"
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();

            } else {
                // Existing Logic for COD/Other
                const orderDetails = {
                    shippingAddress: shippingInfo,
                    paymentMethod: paymentMethod
                };
                const order = await placeOrder(orderDetails);
                navigate(`/order-confirmation?orderId=${order._id || order.id}`);
            }
        } catch (error) {
            console.error('Order placement error:', error);
            showToast('Order placement failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const ErrorMessage = ({ message }) => (
        message ? <span style={{ color: '#ff4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{message}</span> : null
    );

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>CHECKOUT</h1>

                {/* Progress Steps */}
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', justifyContent: 'center' }}>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '50%',
                                background: step >= s ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)',
                                color: step >= s ? 'black' : 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>
                                {s}
                            </div>
                            <span style={{ color: step >= s ? 'white' : 'var(--text-muted)' }}>
                                {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                    {/* Main Content */}
                    <div>
                        {step === 1 && (
                            <div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Shipping Information</h2>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={shippingInfo.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: `1px solid ${errors.name ? '#ff4444' : 'var(--border-light)'}`,
                                                borderRadius: '4px',
                                                color: 'white'
                                            }}
                                        />
                                        <ErrorMessage message={errors.name} />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Phone Number (10 digits)"
                                            value={shippingInfo.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            maxLength={10}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: `1px solid ${errors.phone ? '#ff4444' : 'var(--border-light)'}`,
                                                borderRadius: '4px',
                                                color: 'white'
                                            }}
                                        />
                                        <ErrorMessage message={errors.phone} />
                                    </div>
                                    <div>
                                        <textarea
                                            placeholder="Address"
                                            value={shippingInfo.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            rows={3}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: `1px solid ${errors.address ? '#ff4444' : 'var(--border-light)'}`,
                                                borderRadius: '4px',
                                                color: 'white'
                                            }}
                                        />
                                        <ErrorMessage message={errors.address} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="City"
                                                value={shippingInfo.city}
                                                onChange={(e) => handleInputChange('city', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: `1px solid ${errors.city ? '#ff4444' : 'var(--border-light)'}`,
                                                    borderRadius: '4px',
                                                    color: 'white'
                                                }}
                                            />
                                            <ErrorMessage message={errors.city} />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="State"
                                                value={shippingInfo.state}
                                                onChange={(e) => handleInputChange('state', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: `1px solid ${errors.state ? '#ff4444' : 'var(--border-light)'}`,
                                                    borderRadius: '4px',
                                                    color: 'white'
                                                }}
                                            />
                                            <ErrorMessage message={errors.state} />
                                        </div>
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Pincode (6 digits)"
                                            value={shippingInfo.postalCode}
                                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                            maxLength={6}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: `1px solid ${errors.postalCode ? '#ff4444' : 'var(--border-light)'}`,
                                                borderRadius: '4px',
                                                color: 'white'
                                            }}
                                        />
                                        <ErrorMessage message={errors.postalCode} />
                                    </div>
                                </div>
                                <button onClick={handleContinueToPayment} className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>
                                    CONTINUE TO PAYMENT
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Payment Method</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {['razorpay', 'cod'].map(method => (
                                        <div
                                            key={method}
                                            onClick={() => setPaymentMethod(method)}
                                            style={{
                                                padding: '1.5rem',
                                                border: `2px solid ${paymentMethod === method ? 'var(--accent-cyan)' : 'var(--border-light)'}`,
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                background: paymentMethod === method ? 'rgba(0,243,255,0.05)' : 'transparent'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', border: '2px solid var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {paymentMethod === method && <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: 'var(--accent-cyan)' }} />}
                                                </div>
                                                <div>
                                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                                        {method === 'razorpay' ? 'Pay Online (UPI/Card)' : 'Cash on Delivery'}
                                                    </h3>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                        {method === 'razorpay' ? 'Secure payment via Razorpay' : 'Pay when you receive'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1 }}>BACK</button>
                                    <button onClick={() => setStep(3)} className="btn-primary" style={{ flex: 1 }}>REVIEW ORDER</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Review Order</h2>
                                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Shipping To:</h3>
                                    <p>{shippingInfo.name}</p>
                                    <p>{shippingInfo.phone}</p>
                                    <p>{shippingInfo.address}</p>
                                    <p>{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.postalCode}</p>
                                    <p>{shippingInfo.country}</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Payment Method:</h3>
                                    <p>{paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => setStep(2)} className="btn-secondary" style={{ flex: 1 }} disabled={loading}>BACK</button>
                                    <button onClick={handlePlaceOrder} className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                                        {loading ? 'PROCESSING...' : 'PLACE ORDER'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '2rem', height: 'fit-content', position: 'sticky', top: '120px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Order Summary</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            {cart.map(item => (
                                <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: '1rem' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>{item.name}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Size: {item.size} × {item.quantity}</p>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>₹{item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                                <span>₹{getCartTotal()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                                <span>₹{shipping}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                                <span>Total</span>
                                <span style={{ color: 'var(--accent-cyan)' }}>₹{total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

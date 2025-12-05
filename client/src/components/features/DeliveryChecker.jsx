import React, { useState } from 'react';

const DeliveryChecker = () => {
    const [pincode, setPincode] = useState('');
    const [status, setStatus] = useState(null); // null, 'loading', 'express', 'standard', 'invalid'
    const [msg, setMsg] = useState('');

    const checkDelivery = async (e) => {
        e.preventDefault();
        if (pincode.length !== 6) {
            setStatus('invalid');
            setMsg('Please enter a valid 6-digit pincode');
            return;
        }

        setStatus('loading');

        try {
            const res = await fetch(`/api/pincode/${pincode}`);
            const data = await res.json();

            if (res.ok && data.serviceable) {
                if (data.deliveryDays <= 2) {
                    setStatus('express');
                    setMsg(`⚡ YUVA Now: Delivery in ${data.deliveryDays} day${data.deliveryDays > 1 ? 's' : ''}`);
                } else {
                    setStatus('standard');
                    setMsg(`Standard Delivery: ${data.deliveryDays} days${data.isCodAvailable ? ' • COD Available' : ''}`);
                }
            } else {
                setStatus('invalid');
                setMsg(data.message || 'Delivery not available for this pincode');
            }
        } catch (error) {
            console.error('Pincode check error:', error);
            setStatus('invalid');
            setMsg('Unable to check delivery. Please try again.');
        }
    };

    return (
        <div className="mb-8">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-2">
                Check Delivery
            </label>
            <form onSubmit={checkDelivery} className="flex gap-2">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">📍</span>
                    <input
                        type="text"
                        value={pincode}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setPincode(val);
                            setStatus(null);
                        }}
                        placeholder="Enter Pincode"
                        className="w-full bg-[rgba(255,255,255,0.05)] border border-[var(--border-light)] rounded px-3 py-2 pl-9 text-sm focus:border-[var(--accent-cyan)] outline-none transition-colors"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!pincode || status === 'loading'}
                    className="text-xs font-bold text-[var(--accent-cyan)] hover:text-white px-2 disabled:opacity-50"
                >
                    {status === 'loading' ? 'Checking...' : 'Check'}
                </button>
            </form>

            {status && status !== 'loading' && (
                <div className={`mt-2 text-xs flex items-center gap-2 animate-fade-in ${status === 'express' ? 'text-[var(--accent-cyan)]' :
                    status === 'standard' ? 'text-[var(--text-muted)]' : 'text-red-500'
                    }`}>
                    <span>{status === 'express' ? '🚀' : status === 'standard' ? '🚚' : '⚠️'}</span>
                    <span>{msg}</span>
                </div>
            )}
        </div>
    );
};

export default DeliveryChecker;

import React, { useState } from 'react';
import { X } from 'lucide-react';
import ReturnRequestForm from './ReturnRequestForm';
import '../../styles/returns.css';

const OrderReturnModal = ({ order, onClose, onSuccess }) => {
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (returnData) => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem('yuva-token');
            const res = await fetch('/api/returns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(returnData)
            });

            const data = await res.json();

            if (res.ok) {
                alert('Return request submitted successfully!');
                if (onSuccess) onSuccess(data);
                onClose();
            } else {
                alert(data.message || 'Failed to submit return request');
            }
        } catch (error) {
            console.error('Return request error:', error);
            alert('Failed to submit return request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '2rem'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--bg-dark)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{
                    position: 'sticky',
                    top: 0,
                    background: 'var(--bg-dark)',
                    borderBottom: '1px solid var(--border-light)',
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 1
                }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Return/Exchange Request</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <ReturnRequestForm
                        order={order}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderReturnModal;

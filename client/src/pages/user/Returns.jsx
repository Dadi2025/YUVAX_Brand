import React, { useState } from 'react';
import MyReturns from '../../components/returns/MyReturns';
import ReturnRequestForm from '../../components/returns/ReturnRequestForm';
import { ArrowLeft, Plus } from 'lucide-react';

const Returns = () => {
    const [view, setView] = useState('list'); // 'list' or 'create'
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Mock data
    const mockReturns = [
        {
            _id: 'RET12345678',
            order: { orderNumber: 'ORD98765' },
            createdAt: new Date().toISOString(),
            status: 'approved',
            items: [{ product: 'PROD1', quantity: 1 }],
            statusHistory: [
                { status: 'requested', label: 'Requested' },
                { status: 'approved', label: 'Approved' }
            ]
        }
    ];

    // Mock order for return creation
    const mockOrder = {
        _id: 'ORD98765',
        orderNumber: 'ORD98765',
        items: [
            { _id: '1', name: 'Neon Cyber Jacket', price: 4999, quantity: 1, product: 'PROD1' },
            { _id: '2', name: 'Holographic Pants', price: 2999, quantity: 1, product: 'PROD2' }
        ]
    };

    const handleCreateReturn = () => {
        // In real app, this would likely come from an order details page or a selector
        setSelectedOrder(mockOrder);
        setView('create');
    };

    const handleSubmitReturn = (data) => {
        console.log('Return submitted:', data);
        alert('Return request submitted successfully!');
        setView('list');
    };

    return (
        <div className="returns-container">
            <div className="returns-header">
                {view === 'create' ? (
                    <button
                        onClick={() => setView('list')}
                        style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        <ArrowLeft size={20} /> Back to Returns
                    </button>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <h2>My Returns</h2>
                        <button
                            onClick={handleCreateReturn}
                            style={{
                                background: '#00ffff',
                                color: 'black',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            <Plus size={18} /> Request Return
                        </button>
                    </div>
                )}
            </div>

            {view === 'list' ? (
                <MyReturns returns={mockReturns} />
            ) : (
                <ReturnRequestForm order={selectedOrder} onSubmit={handleSubmitReturn} />
            )}
        </div>
    );
};

export default Returns;

import React, { useState } from 'react';
import MyReturns from '../../components/returns/MyReturns';
import ReturnRequestForm from '../../components/returns/ReturnRequestForm';
import { ArrowLeft, Plus } from 'lucide-react';
import loyaltyService from '../../services/loyaltyService';
import api from '../../services/api'; // Direct api access for orders if needed

const Returns = () => {
    const [view, setView] = useState('list'); // 'list' or 'create'
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]); // To select order for return

    // Fetch returns
    React.useEffect(() => {
        const fetchReturns = async () => {
            try {
                const data = await loyaltyService.getMyReturns();
                setReturns(data);
            } catch (err) {
                console.error('Error fetching returns:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReturns();
    }, [view]); // Refresh when view changes (after submission)

    // Fetch eligible orders when switching to create view
    const handleCreateReturn = async () => {
        try {
            // In a real app, we'd have an endpoint for "orders eligible for return"
            // For now, we'll just fetch recent orders
            const response = await api.get('/orders/my-orders');
            setOrders(response.data);
            setView('create');
        } catch (err) {
            console.error('Error fetching orders:', err);
            alert('Failed to load orders');
        }
    };

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
    };

    const handleSubmitReturn = async (data) => {
        try {
            await loyaltyService.createReturnRequest(data);
            alert('Return request submitted successfully!');
            setView('list');
            setSelectedOrder(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit return request');
        }
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
                loading ? <div style={{ color: 'white', textAlign: 'center' }}>Loading...</div> : <MyReturns returns={returns} />
            ) : (
                selectedOrder ? (
                    <ReturnRequestForm order={selectedOrder} onSubmit={handleSubmitReturn} />
                ) : (
                    <div className="returns-list">
                        <h3>Select an Order to Return</h3>
                        {orders.map(order => (
                            <div key={order._id} className="return-card" style={{ cursor: 'pointer' }} onClick={() => handleSelectOrder(order)}>
                                <div className="return-card-header">
                                    <div>Order #{order.orderNumber}</div>
                                    <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div>{order.items.length} Items • ₹{order.totalAmount}</div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default Returns;

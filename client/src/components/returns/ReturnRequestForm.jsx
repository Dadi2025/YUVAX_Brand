import React, { useState } from 'react';
import { Package, CheckCircle } from 'lucide-react';
import '../../styles/returns.css';

const ReturnRequestForm = ({ order, onSubmit }) => {
    const [selectedItems, setSelectedItems] = useState({});
    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');
    const [returnType, setReturnType] = useState('refund');

    const handleItemToggle = (itemId) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const itemsToReturn = order.items.filter(item => selectedItems[item._id]).map(item => ({
            product: item.product,
            quantity: item.quantity,
            reason: reason
        }));

        if (itemsToReturn.length === 0) {
            alert('Please select at least one item to return');
            return;
        }

        onSubmit({
            orderId: order._id,
            items: itemsToReturn,
            returnType,
            reasonDetails: details
        });
    };

    return (
        <div className="return-form">
            <h3>Request Return for Order #{order.orderNumber}</h3>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Select Items to Return</label>
                    {order.items.map(item => (
                        <div key={item._id} className="item-selection">
                            <input
                                type="checkbox"
                                className="item-checkbox"
                                checked={!!selectedItems[item._id]}
                                onChange={() => handleItemToggle(item._id)}
                            />
                            <div className="item-details">
                                <div style={{ fontWeight: '600' }}>{item.name}</div>
                                <div style={{ fontSize: '0.9rem', color: '#888' }}>Qty: {item.quantity} • ₹{item.price}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-group">
                    <label className="form-label">Reason for Return</label>
                    <select
                        className="form-select"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                    >
                        <option value="">Select a reason</option>
                        <option value="wrong_size">Size doesn't fit</option>
                        <option value="wrong_item">Received wrong item</option>
                        <option value="defective">Item is defective/damaged</option>
                        <option value="not_as_described">Not as described</option>
                        <option value="changed_mind">Changed my mind</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Additional Details</label>
                    <textarea
                        className="form-textarea"
                        rows="3"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Please provide more details about the issue..."
                    ></textarea>
                </div>

                <div className="form-group">
                    <label className="form-label">Resolution Preference</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="returnType"
                                value="refund"
                                checked={returnType === 'refund'}
                                onChange={() => setReturnType('refund')}
                            />
                            Refund to Wallet
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="returnType"
                                value="exchange"
                                checked={returnType === 'exchange'}
                                onChange={() => setReturnType('exchange')}
                            />
                            Exchange Item
                        </label>
                    </div>
                </div>

                <button type="submit" className="submit-btn">
                    Submit Return Request
                </button>
            </form>
        </div>
    );
};

export default ReturnRequestForm;

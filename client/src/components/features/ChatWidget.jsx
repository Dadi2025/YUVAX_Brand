import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import axios from 'axios';
import ProductCard from './ProductCard';
import '../../styles/chat.css';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState({});
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load chat history when opened
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            loadChatHistory();
        }
    }, [isOpen]);

    const loadChatHistory = async () => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (!userInfo) return;

            const { token } = JSON.parse(userInfo);
            const { data } = await axios.get('/api/chat/history', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessages(data);

            // Load products for suggestions
            const productIds = data
                .filter(msg => msg.productSuggestions && msg.productSuggestions.length > 0)
                .flatMap(msg => msg.productSuggestions);

            if (productIds.length > 0) {
                await loadProducts(productIds);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    const loadProducts = async (productIds) => {
        try {
            const { data } = await axios.get('/api/products');
            const productMap = {};
            data.forEach(product => {
                if (productIds.includes(product.id)) {
                    productMap[product.id] = product;
                }
            });
            setProducts(prev => ({ ...prev, ...productMap }));
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || loading) return;

        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            alert('Please login to use the chat assistant');
            return;
        }

        const { token } = JSON.parse(userInfo);
        const messageText = inputMessage.trim();
        setInputMessage('');
        setLoading(true);

        try {
            const { data } = await axios.post(
                '/api/chat/message',
                { message: messageText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessages(prev => [...prev, data.userMessage, data.botMessage]);

            // Load products if bot suggested any
            if (data.botMessage.productSuggestions && data.botMessage.productSuggestions.length > 0) {
                await loadProducts(data.botMessage.productSuggestions);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <button
                    className="chat-widget-button"
                    onClick={() => setIsOpen(true)}
                    title="Chat with us"
                >
                    <MessageCircle size={24} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-widget-window">
                    {/* Header */}
                    <div className="chat-header">
                        <div>
                            <h3>YUVA X Assistant</h3>
                            <p>Online • Ready to help</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="chat-close-btn">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chat-messages">
                        {messages.length === 0 && (
                            <div className="chat-welcome">
                                <MessageCircle size={48} />
                                <h4>Welcome to YUVA X!</h4>
                                <p>Ask me anything about products, orders, or style advice.</p>
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div key={index}>
                                <div className={`chat-message ${msg.sender}`}>
                                    <div className="message-content">
                                        {msg.message.split('\n').map((line, i) => (
                                            <p key={i}>{line}</p>
                                        ))}
                                    </div>
                                    <div className="message-time">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>

                                {/* Product Suggestions */}
                                {msg.productSuggestions && msg.productSuggestions.length > 0 && (
                                    <div className="chat-product-suggestions">
                                        {msg.productSuggestions.map(productId => (
                                            products[productId] && (
                                                <div key={productId} className="chat-product-card">
                                                    <ProductCard product={products[productId]} compact />
                                                </div>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="chat-message bot">
                                <div className="message-content">
                                    <Loader className="spinning" size={20} />
                                    <span>Typing...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chat-input-container">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type your message..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                        <button
                            className="chat-send-btn"
                            onClick={sendMessage}
                            disabled={loading || !inputMessage.trim()}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;

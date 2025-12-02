import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    // Cart State
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('yuva-cart');
        return saved ? JSON.parse(saved) : [];
    });

    // Wishlist State
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('yuva-wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    // User State - Store minimal data in localStorage, token in localStorage (for persistence)
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('yuva-user');
        return saved ? JSON.parse(saved) : null;
    });

    // Orders State
    const [orders, setOrders] = useState([]);

    // Toast State
    const [toast, setToast] = useState(null);

    // Helper function to get auth headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('yuva-token');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    };

    // Helper function to handle API errors
    const handleApiError = (error, res, skipLogout = false) => {
        if (error.message === 'Failed to fetch') {
            return 'Network error. Please check your connection.';
        }
        if (res) {
            if (res.status === 401 && !skipLogout) {
                // Token expired or invalid - only logout if not during login/signup
                logout();
                return 'Session expired. Please login again.';
            }
            if (res.status === 401 && skipLogout) {
                return 'Invalid credentials. Please try again.';
            }
            if (res.status === 403) {
                return 'You do not have permission to perform this action.';
            }
            if (res.status === 429) {
                return 'Too many requests. Please try again later.';
            }
        }
        return error.message || 'An error occurred. Please try again.';
    };

    // Fetch user orders
    const fetchMyOrders = async () => {
        if (!user) return;
        try {
            const res = await fetch(`/api/orders/myorders/${user._id || user.id}`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            } else if (res.status === 401) {
                logout();
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        if (user) {
            if (!user.isAdmin) {
                // Only fetch personal orders for non-admin users
                fetchMyOrders();
            }
            // If admin, do nothing here - let the admin dashboard fetch all orders
        } else {
            // No user logged in, clear orders
            setOrders([]);
        }
    }, [user]);

    // Products State
    const [products, setProducts] = useState([]);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setProducts(data);
                    } else {
                        console.error('Products data is not an array:', data);
                        setProducts([]);
                    }
                } else {
                    throw new Error('Failed to load products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                showToast('Failed to load products', 'error');
            }
        };

        fetchProducts();
    }, []);

    // Persist cart to localStorage
    useEffect(() => {
        localStorage.setItem('yuva-cart', JSON.stringify(cart));
    }, [cart]);

    // Persist wishlist to localStorage
    useEffect(() => {
        localStorage.setItem('yuva-wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    // Persist user to localStorage (without token)
    useEffect(() => {
        if (user) {
            const { token, ...userWithoutToken } = user;
            localStorage.setItem('yuva-user', JSON.stringify(userWithoutToken));
            // Store token in localStorage for persistence
            if (token) {
                localStorage.setItem('yuva-token', token);
            }
        } else {
            localStorage.removeItem('yuva-user');
            localStorage.removeItem('yuva-token');
        }
    }, [user]);

    // Toast Function
    const showToast = (message, type = 'info') => {
        setToast({ message, type, id: Date.now() });
        setTimeout(() => setToast(null), 3000);
    };

    // Cart Functions
    const addToCart = (product, size = 'M', quantity = 1) => {
        const existingItem = cart.find(item => item.id === product.id && item.size === size);

        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id && item.size === size
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
            showToast('Quantity updated in cart', 'success');
        } else {
            setCart([...cart, { ...product, size, quantity }]);
            showToast('Added to cart!', 'success');
        }
    };

    const removeFromCart = (productId, size) => {
        setCart(cart.filter(item => !(item.id === productId && item.size === size)));
        showToast('Removed from cart', 'info');
    };

    const updateCartQuantity = (productId, size, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId, size);
            return;
        }
        setCart(cart.map(item =>
            item.id === productId && item.size === size
                ? { ...item, quantity }
                : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    // Wishlist Functions
    const addToWishlist = (product) => {
        if (!wishlist.find(item => item.id === product.id)) {
            setWishlist([...wishlist, product]);
            showToast('Added to wishlist!', 'success');
        } else {
            showToast('Already in wishlist', 'info');
        }
    };

    const removeFromWishlist = (productId) => {
        setWishlist(wishlist.filter(item => item.id !== productId));
        showToast('Removed from wishlist', 'info');
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const moveToCart = (product) => {
        addToCart(product);
        removeFromWishlist(product.id);
    };

    // Auth Functions
    const login = async (email, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Store token IMMEDIATELY before setting user to avoid race condition
                if (data.token) {
                    localStorage.setItem('yuva-token', data.token);
                }
                setUser(data);
                showToast('Welcome back!', 'success');
                return data;
            } else {
                const errorMessage = handleApiError(new Error(data.message), res, true);
                showToast(errorMessage, 'error');
                throw new Error(errorMessage);
            }
        } catch (error) {
            const errorMessage = handleApiError(error, null, true);
            showToast(errorMessage, 'error');
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await res.json();

            if (res.ok) {
                // Store token IMMEDIATELY before setting user to avoid race condition
                if (data.token) {
                    localStorage.setItem('yuva-token', data.token);
                }
                setUser(data);
                showToast('Account created successfully!', 'success');
                return data;
            } else {
                const errorMessage = handleApiError(new Error(data.message), res, true);
                showToast(errorMessage, 'error');
                throw new Error(errorMessage);
            }
        } catch (error) {
            const errorMessage = handleApiError(error, null, true);
            showToast(errorMessage, 'error');
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setOrders([]);
        setCart([]);
        setWishlist([]);
        localStorage.removeItem('yuva-user');
        localStorage.removeItem('yuva-token');
        localStorage.removeItem('yuva-admin');
        showToast('Logged out successfully', 'success');
    };

    const updateUser = (updates) => {
        setUser({ ...user, ...updates });
        showToast('Profile updated!', 'success');
    };

    // Order Functions
    const placeOrder = async (orderDetails) => {
        try {
            const orderData = {
                orderItems: cart.map(item => ({
                    name: item.name,
                    qty: item.quantity,
                    image: item.image,
                    price: item.price,
                    product: item._id || item.id,
                    size: item.size
                })),
                shippingAddress: {
                    address: orderDetails.shippingAddress.address,
                    city: orderDetails.shippingAddress.city,
                    postalCode: orderDetails.shippingAddress.postalCode,
                    country: orderDetails.shippingAddress.country
                },
                paymentMethod: orderDetails.paymentMethod,
                itemsPrice: getCartTotal(),
                taxPrice: 0,
                shippingPrice: 99,
                totalPrice: getCartTotal() + 99,
                userId: user._id
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(orderData),
            });

            const data = await res.json();

            if (res.ok) {
                setOrders([data, ...orders]);
                clearCart();
                showToast('Order placed successfully!', 'success');
                return data;
            } else {
                const errorMessage = handleApiError(new Error(data.message), res);
                showToast(errorMessage, 'error');
                throw new Error(errorMessage);
            }
        } catch (error) {
            const errorMessage = handleApiError(error);
            showToast(errorMessage, 'error');
            throw error;
        }
    };

    const getUserOrders = () => {
        return orders;
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                const updatedOrder = await res.json();
                setOrders(orders.map(order =>
                    order._id === orderId || order.id === orderId ? updatedOrder : order
                ));
                showToast(`Order status updated to ${status}`, 'success');
                return updatedOrder;
            } else {
                const data = await res.json();
                const errorMessage = handleApiError(new Error(data.message), res);
                showToast(errorMessage, 'error');
                throw new Error(errorMessage);
            }
        } catch (error) {
            const errorMessage = handleApiError(error);
            showToast(errorMessage, 'error');
            throw error;
        }
    };

    // Admin: Fetch all orders
    const fetchAllOrders = async () => {
        try {
            const res = await fetch('/api/orders', {
                headers: getAuthHeaders()
            });

            if (res.ok) {
                const data = await res.json();
                setOrders(data);
                return data;
            } else {
                const data = await res.json();
                const errorMessage = handleApiError(new Error(data.message), res);
                showToast(errorMessage, 'error');
                throw new Error(errorMessage);
            }
        } catch (error) {
            const errorMessage = handleApiError(error);
            showToast(errorMessage, 'error');
            throw error;
        }
    };

    // Product Management Functions
    const addProduct = async (productData) => {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(productData)
            });

            if (res.ok) {
                const newProduct = await res.json();
                setProducts([...products, newProduct]);
                showToast('Product added successfully!', 'success');
                return newProduct;
            } else {
                const data = await res.json();
                const errorMessage = handleApiError(new Error(data.message), res);
                showToast(errorMessage, 'error');
                throw new Error(errorMessage);
            }
        } catch (error) {
            const errorMessage = handleApiError(error);
            showToast(errorMessage, 'error');
            throw error;
        }
    };

    const updateProduct = async (id, productData) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(productData)
            });

            if (res.ok) {
                const updatedProduct = await res.json();
                setProducts(products.map(p => p.id === id ? updatedProduct : p));
                showToast('Product updated successfully!', 'success');
                return updatedProduct;
            } else {
                const data = await res.json();
                const errorMessage = handleApiError(new Error(data.message), res);
                showToast(errorMessage, 'error');
                throw new Error(errorMessage);
            }
        } catch (error) {
            const errorMessage = handleApiError(error);
            showToast(errorMessage, 'error');
            throw error;
        }
    };

    const deleteProduct = async (id) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
                showToast('Product deleted successfully!', 'success');
            } else {
                const data = await res.json();
                const errorMessage = handleApiError(new Error(data.message), res);
                showToast(errorMessage, 'error');
                throw new Error(errorMessage);
            }
        } catch (error) {
            const errorMessage = handleApiError(error);
            showToast(errorMessage, 'error');
            throw error;
        }
    };

    const getProductById = (id) => {
        return products.find(p => p.id === parseInt(id));
    };

    const value = {
        // Cart
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartCount,

        // Wishlist
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        moveToCart,

        // Products
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,

        // Auth
        user,
        login,
        logout,
        signup,
        updateUser,

        // Orders
        orders,
        placeOrder,
        getUserOrders,
        updateOrderStatus,
        fetchAllOrders,

        // Toast
        toast,
        showToast,

        // Helpers
        getAuthHeaders
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;

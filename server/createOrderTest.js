const BASE_URL = 'http://localhost:5000/api';

const createOrderTest = async () => {
    try {
        // 1. Login/Register User
        let user;
        let token;

        console.log('Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'curluser2@test.com', password: 'password123' })
        });

        if (loginRes.ok) {
            const data = await loginRes.json();
            user = data;
            token = data.token;
            console.log('Logged in as:', user.name);
        } else {
            console.log('Login failed, trying to register...');
            const regRes = await fetch(`${BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Curl User 2',
                    email: 'curluser2@test.com',
                    password: 'password123'
                })
            });

            if (!regRes.ok) {
                const err = await regRes.text();
                throw new Error(`Registration failed: ${err}`);
            }

            const data = await regRes.json();
            user = data;
            token = data.token;
            console.log('Registered and logged in as:', user.name);
        }

        // 2. Create Order
        console.log('Creating order with pincode 110001...');
        const orderData = {
            orderItems: [{
                name: 'Test Product',
                qty: 1,
                image: 'http://example.com/image.jpg',
                price: 100,
                product: '692d76499bd3751b4e2c4193' // Valid product ID
            }],
            shippingAddress: {
                address: '123 Test St',
                city: 'Test City',
                postalCode: '110001',
                country: 'India'
            },
            paymentMethod: 'cod',
            itemsPrice: 100,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: 100,
            userId: user._id
        };

        const orderRes = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (!orderRes.ok) {
            const err = await orderRes.text();
            throw new Error(`Order creation failed: ${err}`);
        }

        const order = await orderRes.json();
        console.log('Order created:', order._id);

        if (order.assignedAgent) {
            console.log('✅ SUCCESS: Order assigned to agent:', order.assignedAgent);
        } else {
            console.log('❌ FAILURE: Order NOT assigned to any agent');
        }

    } catch (error) {
        console.error('Error:', error);
    }
};

createOrderTest();

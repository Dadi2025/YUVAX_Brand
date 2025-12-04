// Simulated WhatsApp Service
// In a real production app, you would use Twilio, Meta Cloud API, or a BSP like Interakt/Wati

export const sendWhatsAppMessage = async (to, templateName, data) => {
    // Check if WhatsApp is enabled (simulated toggle)
    const isEnabled = process.env.WHATSAPP_ENABLED !== 'false';

    if (!isEnabled) {
        return;
    }

    console.log('----------------------------------------');
    console.log('📱 WHATSAPP SIMULATION');
    console.log(`To: ${to}`);
    console.log(`Template: ${templateName}`);
    console.log('Data:', JSON.stringify(data, null, 2));

    let message = '';
    switch (templateName) {
        case 'order_confirmation':
            message = `Hello ${data.name}! 🛍️\nYour order #${data.orderId} has been confirmed! 🎉\nAmount: ₹${data.amount}\nWe will notify you when it ships.`;
            break;
        case 'order_shipped':
            message = `Great news ${data.name}! 🚚\nYour order #${data.orderId} has been shipped.\nTrack it here: ${data.trackingLink || 'https://yuvax.com/track'}`;
            break;
        case 'order_delivered':
            message = `Delivered! 📦\nYour order #${data.orderId} has been delivered.\nHope you love it! ❤️\nReview us: https://yuvax.com/review/${data.productId}`;
            break;
        default:
            message = 'Notification from YUVA X';
    }

    console.log('Message Body:');
    console.log(message);
    console.log('----------------------------------------');

    // Simulate API delay
    return new Promise(resolve => setTimeout(resolve, 500));
};

export const sendOrderConfirmation = async (order) => {
    return sendWhatsAppMessage(order.user.phone || '919999999999', 'order_confirmation', {
        name: order.user.name,
        orderId: order._id.toString().slice(-6),
        amount: order.totalPrice
    });
};

export const sendShippingUpdate = async (order) => {
    return sendWhatsAppMessage(order.user.phone || '919999999999', 'order_shipped', {
        name: order.user.name,
        orderId: order._id.toString().slice(-6)
    });
};

export const sendDeliveryUpdate = async (order) => {
    return sendWhatsAppMessage(order.user.phone || '919999999999', 'order_delivered', {
        name: order.user.name,
        orderId: order._id.toString().slice(-6),
        productId: order.orderItems[0].product
    });
};

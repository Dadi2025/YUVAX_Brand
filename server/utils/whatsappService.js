/**
 * Mock WhatsApp Service
 * Simulates sending WhatsApp messages by logging to console.
 */

export const sendOrderConfirmation = async (phone, orderId) => {
    console.log('------------------------------------------------');
    console.log(`[WhatsApp Mock] Sending Message to: ${phone}`);
    console.log(`[WhatsApp Mock] Message: Hi! Your order #${orderId} has been placed successfully. Thank you for shopping with YUVA X!`);
    console.log('------------------------------------------------');
    return true;
};

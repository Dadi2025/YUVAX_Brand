import { sendOrderConfirmation } from './whatsappService.js';

export const sendPriceDropWhatsApp = async (phone, productName, oldPrice, newPrice, productId) => {
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

    console.log('------------------------------------------------');
    console.log(`[WhatsApp Mock] Price Drop Alert`);
    console.log(`To: ${phone}`);
    console.log(`Message: 🎉 Price Drop Alert!`);
    console.log(`${productName}`);
    console.log(`Was: ₹${oldPrice} → Now: ₹${newPrice} (${discount}% OFF)`);
    console.log(`Shop now: http://localhost:5173/product/${productId}`);
    console.log('------------------------------------------------');

    return true;
};

export default { sendPriceDropWhatsApp };

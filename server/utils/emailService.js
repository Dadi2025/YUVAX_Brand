import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
    // For development, use a test account or configure with real SMTP
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

export const sendPriceDropEmail = async (userEmail, userName, product, oldPrice, newPrice) => {
    try {
        const transporter = createTransporter();

        const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

        const mailOptions = {
            from: `"YUVA X" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `🎉 Price Drop Alert: ${product.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #00f3ff 0%, #a855f7 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0;">YUVA X</h1>
                        <p style="color: white; margin: 10px 0 0 0;">Price Drop Alert!</p>
                    </div>
                    
                    <div style="padding: 30px; background: #f9f9f9;">
                        <h2 style="color: #333;">Hi ${userName},</h2>
                        <p style="color: #666; font-size: 16px;">Great news! A product in your wishlist has dropped in price:</p>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #333; margin-top: 0;">${product.name}</h3>
                            <img src="${product.image}" alt="${product.name}" style="max-width: 200px; border-radius: 4px;" />
                            
                            <div style="margin: 20px 0;">
                                <p style="color: #999; text-decoration: line-through; margin: 0;">₹${oldPrice}</p>
                                <p style="color: #00f3ff; font-size: 24px; font-weight: bold; margin: 5px 0;">₹${newPrice}</p>
                                <p style="color: #a855f7; font-weight: bold; margin: 0;">${discount}% OFF</p>
                            </div>
                            
                            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/product/${product.id}" 
                               style="display: inline-block; background: linear-gradient(135deg, #00f3ff 0%, #a855f7 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                                BUY NOW
                            </a>
                        </div>
                        
                        <p style="color: #999; font-size: 14px;">Don't miss out on this amazing deal!</p>
                    </div>
                    
                    <div style="background: #333; padding: 20px; text-align: center;">
                        <p style="color: #999; margin: 0; font-size: 12px;">© 2024 YUVA X. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        // In development, log instead of sending
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('------------------------------------------------');
            console.log('[Email Mock] Price Drop Alert');
            console.log(`To: ${userEmail}`);
            console.log(`Subject: ${mailOptions.subject}`);
            console.log(`Product: ${product.name}`);
            console.log(`Old Price: ₹${oldPrice} → New Price: ₹${newPrice} (${discount}% OFF)`);
            console.log('------------------------------------------------');
            return true;
        }

        await transporter.sendMail(mailOptions);
        console.log(`Price drop email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error('Send price drop email error:', error);
        return false;
    }
};

export default { sendPriceDropEmail };

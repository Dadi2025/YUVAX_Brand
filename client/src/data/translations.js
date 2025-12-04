export const translations = {
    en: {
        // Navigation
        shop: 'Shop',
        cart: 'Cart',
        wishlist: 'Wishlist',
        login: 'Login',
        signup: 'Sign Up',
        logout: 'Logout',
        dashboard: 'Dashboard',
        myAccount: 'My Account',
        referEarn: 'Refer & Earn',

        // Home
        welcomeTitle: 'Future-Ready Streetwear',
        welcomeSubtitle: 'Redefine your style with AI-powered fashion',
        shopNow: 'Shop Now',
        exploreCollections: 'Explore Collections',

        // Product
        addToCart: 'Add to Cart',
        addToWishlist: 'Add to Wishlist',
        buyNow: 'Buy Now',
        selectSize: 'Select Size',
        productDetails: 'Product Details',
        reviews: 'Reviews',
        writeReview: 'Write a Review',

        // Cart
        yourCart: 'Your Cart',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        total: 'Total',
        proceedToCheckout: 'Proceed to Checkout',
        emptyCart: 'Your cart is empty',
        continueShopping: 'Continue Shopping',

        // Footer
        aboutUs: 'About Us',
        contactUs: 'Contact Us',
        faq: 'FAQ',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
        trackOrder: 'Track Order',

        // Common
        search: 'Search',
        filter: 'Filter',
        sortBy: 'Sort By',
        price: 'Price',
        category: 'Category',
        size: 'Size',
        color: 'Color',
        quantity: 'Quantity',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        close: 'Close',

        // Referral
        referralCode: 'Referral Code',
        shareCode: 'Share Your Code',
        walletBalance: 'Wallet Balance',
        totalReferrals: 'Total Referrals',
        totalEarnings: 'Total Earnings',
        howItWorks: 'How It Works',
        shareOnWhatsApp: 'Share on WhatsApp',
        copyCode: 'Copy Code',
        copied: 'Copied!',
    },
    hi: {
        // Navigation
        shop: 'खरीदें',
        cart: 'कार्ट',
        wishlist: 'पसंदीदा',
        login: 'लॉगिन',
        signup: 'साइन अप',
        logout: 'लॉगआउट',
        dashboard: 'डैशबोर्ड',
        myAccount: 'मेरा खाता',
        referEarn: 'रेफर करें और कमाएं',

        // Home
        welcomeTitle: 'भविष्य के लिए स्ट्रीटवियर',
        welcomeSubtitle: 'AI-संचालित फैशन के साथ अपनी शैली को फिर से परिभाषित करें',
        shopNow: 'अभी खरीदें',
        exploreCollections: 'कलेक्शन देखें',

        // Product
        addToCart: 'कार्ट में जोड़ें',
        addToWishlist: 'पसंदीदा में जोड़ें',
        buyNow: 'अभी खरीदें',
        selectSize: 'साइज़ चुनें',
        productDetails: 'उत्पाद विवरण',
        reviews: 'समीक्षाएं',
        writeReview: 'समीक्षा लिखें',

        // Cart
        yourCart: 'आपका कार्ट',
        subtotal: 'उप-योग',
        shipping: 'शिपिंग',
        total: 'कुल',
        proceedToCheckout: 'चेकआउट पर जाएं',
        emptyCart: 'आपका कार्ट खाली है',
        continueShopping: 'खरीदारी जारी रखें',

        // Footer
        aboutUs: 'हमारे बारे में',
        contactUs: 'संपर्क करें',
        faq: 'सामान्य प्रश्न',
        privacyPolicy: 'गोपनीयता नीति',
        termsOfService: 'सेवा की शर्तें',
        trackOrder: 'ऑर्डर ट्रैक करें',

        // Common
        search: 'खोजें',
        filter: 'फ़िल्टर',
        sortBy: 'क्रमबद्ध करें',
        price: 'कीमत',
        category: 'श्रेणी',
        size: 'साइज़',
        color: 'रंग',
        quantity: 'मात्रा',
        loading: 'लोड हो रहा है...',
        error: 'त्रुटि',
        success: 'सफलता',
        submit: 'जमा करें',
        cancel: 'रद्द करें',
        save: 'सहेजें',
        delete: 'हटाएं',
        edit: 'संपादित करें',
        view: 'देखें',
        close: 'बंद करें',

        // Referral
        referralCode: 'रेफरल कोड',
        shareCode: 'अपना कोड शेयर करें',
        walletBalance: 'वॉलेट बैलेंस',
        totalReferrals: 'कुल रेफरल',
        totalEarnings: 'कुल कमाई',
        howItWorks: 'यह कैसे काम करता है',
        shareOnWhatsApp: 'WhatsApp पर शेयर करें',
        copyCode: 'कोड कॉपी करें',
        copied: 'कॉपी हो गया!',
    }
};

// Translation function
export const t = (key, lang = 'en') => {
    return translations[lang][key] || translations.en[key] || key;
};

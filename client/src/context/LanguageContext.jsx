import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState('en');

    useEffect(() => {
        // Load saved language preference
        const savedLang = localStorage.getItem('yuva-language');
        if (savedLang) {
            setCurrentLanguage(savedLang);
        }
    }, []);

    const changeLanguage = (lang) => {
        setCurrentLanguage(lang);
        localStorage.setItem('yuva-language', lang);
    };

    const value = {
        currentLanguage,
        changeLanguage,
        isHindi: currentLanguage === 'hi'
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

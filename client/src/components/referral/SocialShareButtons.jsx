import React from 'react';
import { Share2, Mail, Facebook, Twitter } from 'lucide-react';

const SocialShareButtons = ({ referralCode, url, text }) => {
    const shareUrl = url || `${window.location.origin}/signup?ref=${referralCode}`;
    const shareText = text || `Join me on YUVA X and get ₹200 off your first order! Use my code: ${referralCode}`;

    const handleShare = (platform) => {
        let url = '';

        switch (platform) {
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'email':
                url = `mailto:?subject=Join me on YUVA X&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
                break;
            default:
                break;
        }

        if (url) window.open(url, '_blank');
    };

    return (
        <div className="share-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
            <button
                className="share-btn share-whatsapp"
                onClick={() => handleShare('whatsapp')}
                title="Share on WhatsApp"
                style={{ background: '#25D366', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
            >
                <Share2 size={18} />
            </button>
            <button
                className="share-btn share-facebook"
                onClick={() => handleShare('facebook')}
                title="Share on Facebook"
                style={{ background: '#1877F2', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
            >
                <Facebook size={18} />
            </button>
            <button
                className="share-btn share-twitter"
                onClick={() => handleShare('twitter')}
                title="Share on Twitter"
                style={{ background: '#1DA1F2', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
            >
                <Twitter size={18} />
            </button>
            <button
                className="share-btn share-email"
                onClick={() => handleShare('email')}
                title="Share via Email"
                style={{ background: '#EA4335', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
            >
                <Mail size={18} />
            </button>
        </div>
    );
};

export default SocialShareButtons;

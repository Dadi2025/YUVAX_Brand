import React from 'react';
import { Share2, Mail, Facebook, Twitter } from 'lucide-react';

const SocialShareButtons = ({ referralCode }) => {
    const shareUrl = `${window.location.origin}/signup?ref=${referralCode}`;
    const shareText = `Join me on YUVA X and get ₹200 off your first order! Use my code: ${referralCode}`;

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
        <div className="share-buttons">
            <button
                className="share-btn share-whatsapp"
                onClick={() => handleShare('whatsapp')}
                title="Share on WhatsApp"
            >
                <Share2 size={24} />
            </button>
            <button
                className="share-btn share-facebook"
                onClick={() => handleShare('facebook')}
                title="Share on Facebook"
            >
                <Facebook size={24} />
            </button>
            <button
                className="share-btn share-twitter"
                onClick={() => handleShare('twitter')}
                title="Share on Twitter"
            >
                <Twitter size={24} />
            </button>
            <button
                className="share-btn share-email"
                onClick={() => handleShare('email')}
                title="Share via Email"
            >
                <Mail size={24} />
            </button>
        </div>
    );
};

export default SocialShareButtons;

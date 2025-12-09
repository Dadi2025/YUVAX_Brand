import React from 'react';
import './TopBar.css';

const TopBar = () => {
    return (
        <div className="top-bar">
            <div className="top-bar-content">
                <span className="top-bar-item">
                    🔥 Free Shipping on All Orders Over ₹999
                </span>
                <span className="top-bar-item">
                    <span className="top-bar-highlight">NEW DROPS</span> EVERY FRIDAY
                </span>
                <span className="top-bar-item">
                    USE CODE <span className="top-bar-hot">NEO10</span> FOR 10% OFF
                </span>
                <span className="top-bar-item">
                    ⚡ LIMITED EDITION STREETWEAR
                </span>
                {/* Duplicate for seamless loop effect if needed, though CSS marquee handles it differently.
                    For a true infinite loop with CSS translate, often need duplicated content.
                */}
                <span className="top-bar-item">
                    🔥 Free Shipping on All Orders Over ₹999
                </span>
                <span className="top-bar-item">
                    <span className="top-bar-highlight">NEW DROPS</span> EVERY FRIDAY
                </span>
                <span className="top-bar-item">
                    USE CODE <span className="top-bar-hot">NEO10</span> FOR 10% OFF
                </span>
            </div>
        </div>
    );
};

export default TopBar;

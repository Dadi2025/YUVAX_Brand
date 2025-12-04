import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = +new Date(endTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        } else {
            timeLeft = { hours: 0, minutes: 0, seconds: 0 };
        }

        return timeLeft;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const pad = (num) => num.toString().padStart(2, '0');

    return (
        <div className="countdown-timer">
            <div className="time-block">
                <span className="time-value">{pad(timeLeft.hours)}</span>
                <span className="time-label">Hrs</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-block">
                <span className="time-value">{pad(timeLeft.minutes)}</span>
                <span className="time-label">Min</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-block">
                <span className="time-value">{pad(timeLeft.seconds)}</span>
                <span className="time-label">Sec</span>
            </div>
        </div>
    );
};

export default CountdownTimer;

import { useState, useEffect } from 'react';
import '../constructor-map.css';

export const Timer = () => {
    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        let intervalId;
        intervalId = setInterval(() => {
            setTime(prevTime => {
                let { hours, minutes, seconds } = prevTime;

                seconds++;
                if (seconds === 60) {
                    seconds = 0;
                    minutes++;
                }
                if (minutes === 60) {
                    minutes = 0;
                    hours++;
                }

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

  
    const formatNumber = (number) => {
        return number.toString().padStart(2, '0');
    };

    return (
        <div className="timer-container">
            <div className="timer-box">
                <div className="timer-display">
                    <span>{formatNumber(time.hours)}</span>
                    <span>:</span>
                    <span>{formatNumber(time.minutes)}</span>
                    <span>:</span>
                    <span>{formatNumber(time.seconds)}</span>
                </div>
            </div>
        </div>
    );
};

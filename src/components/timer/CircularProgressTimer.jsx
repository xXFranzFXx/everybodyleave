import React, { useState, useEffect } from 'react';
import './CircularProgressTimer.css';

const CircularProgressTimer = ({ initialTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const radius = 100;
  const stroke = 15;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const remainingTimeProgress = timeLeft / initialTime;
  const strokeDashoffset = -circumference * (1 - remainingTimeProgress);

  return (
    <div className="timer-container">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="progress-ring"
      >
        <circle
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="progress-ring__bg"
        />
        {/* Green elapsed time circle (static, revealed by the blue one) */}
        <circle
          stroke="url(#gradient-green)"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="progress-ring__circle"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: 0 }} // Always a full circle
        />
        {/* Blue remaining time circle (animates to reveal the green) */}
        <circle
          stroke="url(#gradient-blue)"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="progress-ring__circle"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
        />
        <defs>
          <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0072ff" />
            <stop offset="100%" stopColor="#00c6ff" />
          </linearGradient>
          <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>
      </svg>
      {timeLeft === 0 ? (
        <div className="completion-message">Good Job!</div>
      ) : (
        <div className="time-display">{formatTime(timeLeft)}</div>
      )}
    </div>
  );
};

export default CircularProgressTimer;

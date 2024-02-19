// UtcClock.js

import React, { useState, useEffect } from 'react';
import './UtcClock.css';

const UtcClock = () => {
  const [utcTime, setUtcTime] = useState('');
  const [highlightPeriods, setHighlightPeriods] = useState([
    { start: '2024-02-18T09:00:00Z', end: '2024-02-25T09:00:00Z', message: 'Claim Period 1' },
    { start: '2024-03-04T09:00:00Z', end: '2024-03-10T09:00:00Z', message: 'Claim Period 2' },
    { start: '2024-04-01T09:00:00Z', end: '2024-04-7T09:00:00Z', message: 'Claim Period 3' },
    { start: '2024-05-06T09:00:00Z', end: '2024-05-121T09:00:00Z', message: 'Claim Period 4' },
  ]);
  
  const [isHighlightActive, setHighlightActive] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [identifiedPeriod, setIdentifiedPeriod] = useState('');

  useEffect(() => {
    const updateUtcTime = () => {
      const now = new Date();
      const options = { weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'UTC' };
      const formattedUtcTime = now.toLocaleString('en-US', options);
      setUtcTime(formattedUtcTime);

      // Check if the current time is within any of the specified highlight periods
      const activePeriod = highlightPeriods.find(({ start, end, message }) => {
        const startTime = new Date(start);
        const endTime = new Date(end);
        return now >= startTime && now <= endTime;
      });

      setHighlightActive(!!activePeriod);
      setIdentifiedPeriod(activePeriod ? activePeriod.message : '');
      
      // Update the countdown
      const closestPeriod = findClosestPeriod(now);
      if (closestPeriod) {
        const timeRemaining = closestPeriod.end - now;
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    };

    const intervalId = setInterval(updateUtcTime, 1000); // Update every second

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [highlightPeriods]);

  const findClosestPeriod = (now) => {
    const sortedPeriods = [...highlightPeriods].sort((a, b) => new Date(a.start) - new Date(b.start));

    for (const period of sortedPeriods) {
      const startTime = new Date(period.start);
      const endTime = new Date(period.end);
      if (now < endTime) {
        return period;
      }
    }

    // If no future period found, return the last period (loop to the end of the list)
    return sortedPeriods[sortedPeriods.length - 1];
  };

  return (
    <div className={`utc-clock-banner ${isHighlightActive ? 'highlight' : ''}`}>
      <h2>UTC Time:</h2>
      <p className="utc-time">{utcTime}</p>
      {isHighlightActive && (
        <div className="countdown">
          <p>{`We are in our ${identifiedPeriod}`}</p>
          <p>Period is a Week</p>
        </div>
      )}
      {!isHighlightActive && (
        <>
        <p>There is no Claim Available Now!</p>
        </>
      )}
    </div>
  );
};

export default UtcClock;

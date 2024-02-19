// ErrorPopup.js

import React, { useState, useEffect } from 'react';
import './ErrorPopup.css';

const ErrorPopup = ({ showError } ) => {
  const [isVisible, setIsVisible] = useState(showError);

  useEffect(() => {
    setIsVisible(showError);
  }, [showError]);

  const handleAcknowledge = () => {
    setIsVisible(false);
    window.location.reload();
    document.getElementById('error-popup').classList.add('hide');
  };

  return (
    <div className={`error-popup ${isVisible ? 'visible' : ''}`}>
      <div className="popup-content">
        
        <p>An error occurred. Please acknowledge and reload the page.</p>
        
        <button onClick={handleAcknowledge}>OK</button>
      </div>
    </div>
  );
};

export default ErrorPopup;
import React from 'react';
import './OTMSLoader.css';

const OTMSLoader: React.FC = () => {
  return (
    <div className="otms-loader-container">
      <div className="otms-spinner">
        {[...Array(40)].map((_, i) => (
          <div key={i} className="otms-bar" style={{ transform: `rotate(${i * 9}deg) translateY(-50%)` }} />
        ))}
        <span className="otms-center-text">OTMS</span>
      </div>
    </div>
  );
};

export default OTMSLoader; 
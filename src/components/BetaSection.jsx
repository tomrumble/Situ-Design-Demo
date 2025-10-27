import React from 'react';

const BetaSection = ({ title, children }) => {
  return (
    <div className="beta-section">
      <div className="beta-section-content">
        <h4>{title}</h4>
        <div className="beta-section-text">{children}</div>
      </div>
    </div>
  );
};

export default BetaSection;


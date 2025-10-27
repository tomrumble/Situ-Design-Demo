import React from 'react';

const WarningSection = ({ title, children }) => {
  return (
    <div className="warning-section">
      <div className="warning-section-content">
        <h4>{title}</h4>
        <div className="warning-section-text">{children}</div>
      </div>
    </div>
  );
};

export default WarningSection;


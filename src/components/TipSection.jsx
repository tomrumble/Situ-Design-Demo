import React from 'react';

const TipSection = ({ title, children }) => {
  return (
    <div className="pro-tip">
      <div className="pro-tip-content">
        <h4>{title}</h4>
        <div className="pro-tip-text">{children}</div>
      </div>
    </div>
  );
};

export default TipSection;

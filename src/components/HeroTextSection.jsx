import React from 'react';

const HeroTextSection = ({ title, children, showHeader = true }) => {
  return (
    <div className="hero-text-card">
      {showHeader && (
        <div className="content-header">
          <h3>{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default HeroTextSection;


import React from 'react';

const DemoCard = ({ title, styleState, isUpdated, children, showHeader = true }) => {
  return (
    <div className="demo-card">
      {showHeader && (
        <div className="content-header">
          <h3>{title}</h3>
          <div className={`style-badge ${isUpdated ? 'updated' : ''}`}>
            {isUpdated ? 'Changed' : 'Original'}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default DemoCard;

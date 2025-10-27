import React from 'react';

const DemoInstructions = ({ dataId, children }) => {
  return (
    <div className="demo-card-instructions">
      <div data-id={dataId}>
        {children}
      </div>
    </div>
  );
};

export default DemoInstructions;

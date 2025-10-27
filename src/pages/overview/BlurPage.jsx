import React from 'react';
import DemoCard from '../../components/DemoCard';
import TipSection from '../../components/TipSection';

export const BlurPage = () => {
  return (
    <div className="content-section">
      <div className="content-header">
        <h1>Blur</h1>
        <p>Blur effects and filters</p>
      </div>

      <TipSection title="TRY IT OUT">
        Inspect any layout container below to change its layout properties via the sidebar, and see the changes reflected in real-time. Hold <kbd>Alt</kbd> and <kbd>Click</kbd> containers to edit them.
      </TipSection>

      <DemoCard>
        <h3>Blur</h3>
        <p>Blur effects documentation coming soon.</p>
      </DemoCard>
    </div>
  );
};

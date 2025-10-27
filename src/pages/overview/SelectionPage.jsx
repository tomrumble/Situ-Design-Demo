import React from 'react';
import DemoCard from '../../components/DemoCard';
import TipSection from '../../components/TipSection';

export const SelectionPage = () => {
  return (
    <div className="content-section">
      <div className="content-header">
        <h1>Selection</h1>
        <p>Element selection features</p>
      </div>

      <TipSection title="TRY IT OUT">
        Inspect any layout container below to change its layout properties via the sidebar, and see the changes reflected in real-time. Hold <kbd>Alt</kbd> and <kbd>Click</kbd> containers to edit them.
      </TipSection>

      <DemoCard>
        <h3>Selection</h3>
        <p>Selection tools documentation coming soon.</p>
      </DemoCard>
    </div>
  );
};

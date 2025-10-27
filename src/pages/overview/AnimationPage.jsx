import React from 'react';
import DemoCard from '../../components/DemoCard';
import TipSection from '../../components/TipSection';

export const AnimationPage = () => {
  return (
    <div className="content-section">
      <div className="content-header">
        <h1>Animation</h1>
        <p>Animation properties and keyframes</p>
      </div>

      <TipSection title="TRY IT OUT">
        Inspect any layout container below to change its layout properties via the sidebar, and see the changes reflected in real-time. Hold <kbd>Alt</kbd> and <kbd>Click</kbd> containers to edit them.
      </TipSection>

      <DemoCard>
        <h3>Animation</h3>
        <p>Animation documentation coming soon.</p>
      </DemoCard>
    </div>
  );
};

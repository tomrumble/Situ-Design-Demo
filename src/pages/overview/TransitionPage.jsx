import React from 'react';
import DemoCard from '../../components/DemoCard';
import TipSection from '../../components/TipSection';

export const TransitionPage = () => {
  return (
    <div className="content-section">
      <div className="content-header">
        <h1>Transition</h1>
        <p>CSS transitions and animations</p>
      </div>

      <TipSection title="TRY IT OUT">
        Inspect any layout container below to change its layout properties via the sidebar, and see the changes reflected in real-time. Hold <kbd>Alt</kbd> and <kbd>Click</kbd> containers to edit them.
      </TipSection>

      <DemoCard>
        <h3>Transition</h3>
        <p>Transition documentation coming soon.</p>
      </DemoCard>
    </div>
  );
};

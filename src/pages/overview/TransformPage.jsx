import React from 'react';
import DemoCard from '../../components/DemoCard';
import TipSection from '../../components/TipSection';
import BetaSection from '../../components/BetaSection';

export const TransformPage = () => {
  return (
    <div className="content-section">

      <BetaSection title="Open Beta">
        Situ is currently in open beta, you can sign up for free and start using Situ. We're actively working on improvements and stability and would love to hear your feedback. We don't recommend using the beta for any mission-critical projects. 
      </BetaSection>

      <div className="content-header">
        <h1>Transform</h1>
        <p>Edit transform properties, angles, and more directly in your app. See real-time previews, keep them through reloads, and stage them to Cursor via MCP.</p>
      </div>

      <TipSection title="coming soon">
        Transform editing is coming soon. We're actively working on getting this feature ready for prime time. Keep an eye out for updates!
      </TipSection>
    </div>
  );
};

import React from 'react';
import DemoCard from '../../components/DemoCard';
import TipSection from '../../components/TipSection';
import BetaSection from '../../components/BetaSection';
import WarningSection from '../../components/WarningSection';
import JsonCard from '../../components/JsonCard';
const codeIcon = "/inspector/assets/icons/code.svg";

const sampleDeepLink = {
  file: 'src/components/Button.jsx',
  line: 42,
  column: 12,
  selection: 'button.primary',
};

export const CodePage = () => {
  return (
    <div className="content-section">
      <BetaSection title="Open Beta">
      Situ is currently in open beta, you can sign up for free and start using Situ. We're actively working on improvements and stability and would love to hear your feedback. We don't recommend using the beta for any mission-critical projects. 
      </BetaSection>

       {/* The Problem */}
       <div className="content-header">
        <h1>Open in Cursor</h1>
        <div 
            className="fills-header-image"
            style={{
              backgroundImage: 'url(/inspector/assets/images/open-in-cursor.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              height: '300px',
              width: '100%',
              borderRadius: '12px',
              backgroundColor: '#181818',
              marginTop: '16px',
              marginBottom: '16px',
            }}
          />
          <h3>Stop rummaging through your codebase.</h3>
        <p>Situ can deeplink you straight to your IDE from your selection. It's a simple as selecting an element and clicking the 'Open in Cursor' button and boom — you're looking at the right file, right line, right column.</p>
        <div className="flex-list">
          <div className="flex-list-item">Select any element on the page</div>
          <div className="flex-list-item">Click the <img src={codeIcon} alt="code icon" style={{ width: '20px', height: '20px', verticalAlign: 'middle', marginTop: '2px' }} />button in the toolbar/sidebar</div>
          <div className="flex-list-item">Cursor will open at the right file, line and column</div>
        </div>
      </div>
    </div>
  );
};

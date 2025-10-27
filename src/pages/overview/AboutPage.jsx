import React from 'react';
import TipSection from '../../components/TipSection';
import BetaSection from '../../components/BetaSection';
import WarningSection from '../../components/WarningSection';
import DemoCard from '../../components/DemoCard';
import HeroTextSection from '../../components/HeroTextSection';
const codeIcon = "/inspector/assets/icons/code.svg";

export const AboutPage = () => {
  return (
    <div className="content-section">


    <BetaSection title="Open Beta">
      Situ is currently in open beta, you can sign up for free and start using Situ. We're actively working on improvements and stability and would love to hear your feedback. We don't recommend using the beta for any mission-critical projects. 
      </BetaSection>

      <div className="content-header">
        <h1>A mini-Figma in your localhost</h1>
        <p>Prompts accelerate features, but they lag design. Figma is heavy and its pseudo-code MCP leaves agents guessing. Situ is dev-native — lightweight, instant, and built where you build.</p>
      </div>

      <HeroTextSection>
        <h3>"The missing front-end tool for Cursor"</h3>
        <p>—Con Huynh, Lead Front-end Engineer @ Hypetap</p>
      </HeroTextSection>

      {/* The Problem */}
      <div className="content-header">
        <h2>Selection → Code</h2>
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

<WarningSection title="Requirements">
      Situ is currently compatible with React 18+ projects using Vite 5.0+. It will NOT work as intended with any other frameworks/languages. We intend to support more frameworks in the future.
      </WarningSection>

      {/* The Problem */}
      <div className="content-header">
        <h2>Design → MCP</h2>
        <div 
            className="fills-header-image"
            style={{
                backgroundImage: 'url(/inspector/assets/images/apply-edits.png)',
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
          <h3>Edit the real thing, not a representation of it.</h3>
        <p>Situ brings design editing directly into your development workflow. Edit styles, layout, spacing and more with instant visual feedback, persistance through reloads and an instant MCP envelope of edits to be sent to your agent.</p>
        <div className="flex-list">
          <div className="flex-list-item">Select any element on the page</div>
          <div className="flex-list-item">Make any design changes you like from the <kbd>Design</kbd> tab</div>
          <div className="flex-list-item">Review your edits in the <kbd>Edits</kbd> tab</div>
          <div className="flex-list-item">Click <kbd>Apply Edits</kbd> and paste prompt to agent</div>
        </div>
      </div>

      <TipSection title="strictly dev env only">
      Situ is built from the ground up to <b>only</b> exist in your dev environment. No trace of it can exist in your production environment — all core Situ code is self-contained in the extension and stripped from any builds.
      </TipSection>
    </div>
  );
};


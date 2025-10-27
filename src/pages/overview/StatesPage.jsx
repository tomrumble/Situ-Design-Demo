import React from 'react';
import DemoCard from '../../components/DemoCard';
import TipSection from '../../components/TipSection';
import BetaSection from '../../components/BetaSection';
import WarningSection from '../../components/WarningSection';

export const StatesPage = () => {
  return (
    <div className="content-section">
      
      <WarningSection title="Experimental">
        State editing is still experimental and may not work as expected in all browsers. We're actively working on improvements and stability and this is a key focus area for us.
      </WarningSection>

      <div className="content-header">
        <h1>States</h1>
        <p>Edit CSS pseudo-class states like <code>:hover</code>, <code>:active</code>, and <code>:focus</code> directly in the browser with visual feedback.</p>
      </div>

      <div 
            className="fills-header-image"
            style={{
              backgroundImage: 'url(/inspector/assets/images/ui-states.png)',
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

      {/* Introduction */}
      <div className="content-header">
        <h3>Why States?</h3>
        <p>Interactive elements like buttons, links, and form inputs need state variations. Typing: <em>"Make the button darker on hover with a border radius of 10px and a padding of 10px and a border color of #000000"</em> to an agent is slower than just designing it yourself with full control and real-time feedback.</p>
        <div className="flex-list">
          <div className="flex-list-item">Interact with your changes in real-time across all states</div>
          <div className="flex-list-item">Edit multiple states in one session</div>
          <div className="flex-list-item">All state changes are captured in your edit history</div>
          <div className="flex-list-item">Send state edits to your agent as part of the MCP envelope</div>
        </div>
      </div>

      {/* How It Works */}
      <div className="content-header">
        <h3>How It Works</h3>
        <p>Switch between states in the sidebar, edit properties, and see changes applied instantly.</p>
        <div className="flex-list">
          <div className="flex-list-item">Select any element)</div>
          <div className="flex-list-item">Add a State to the element in the sidebar</div>
          <div className="flex-list-item">Toggle between <code>default</code> and <code>hover</code> states</div>
          <div className="flex-list-item">Edit properties like background color, border, or shadow</div>
          <div className="flex-list-item">Changes preview instantly on the selected element</div>
        </div>
      </div>

      <TipSection title="Demo coming soon">
        We're actively working on a demo for this feature and it will be available soon. In the meantime, you can try it out by selecting an element and clicking the "State" section in the sidebar to switch between <code>default</code> and <code>hover</code> states.
      </TipSection>
    </div>
  );
};

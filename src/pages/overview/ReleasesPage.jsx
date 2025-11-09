import React from 'react';
import TipSection from '../../components/TipSection';
import BetaSection from '../../components/BetaSection';
import WarningSection from '../../components/WarningSection';

export const ReleasesPage = () => {
  return (
    <div className="content-section">
      
      <BetaSection title="Open Beta">
        Situ is currently in open beta, you can sign up for free and start using Situ. We're actively working on improvements and stability and would love to hear your feedback. We don't recommend using the beta for any mission-critical projects. 
      </BetaSection>

      <div className="content-header">
        <h1>Releases</h1>
        <p>Situ is constantly evolving. Here's what we've been focused on and what's coming next. Our roadmap is heavily influenced by community feedback and released as a separate page on this site soon.</p>
      </div>

      {/* Current Release */}
      <div className="content-header">
        <h3>1.0.9 <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 'normal' }}>Current</span></h3>
        <h4><i>Major improvements to drag interactions, padding overlays, and undo/redo system.</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li><strong>Drag Shield Lifecycle:</strong> Fixed drag shield cleanup for gaps and padding overlays - drags are now fully repeatable while element remains selected</li>
            <li><strong>Padding Overlay Parity:</strong> Padding overlays now have full feature parity with gap overlays including Alt+drag for symmetrical adjustment (top/bottom, left/right)</li>
            <li><strong>Shift Snapping:</strong> Shift+drag now snaps both gaps and padding to 4px increments for precise alignment</li>
            <li><strong>Hover Activation:</strong> Improved hover activation to only trigger on dragpoint areas, not the full overlay band</li>
            <li><strong>Click Handling:</strong> Fixed single-click deselection after drag operations - no more double-click required</li>
            <li><strong>Undo/Redo System:</strong> Enhanced undo/redo with proper action isolation and staged edits chip reliability</li>
            <li><strong>Live Overlay Updates:</strong> Gap and padding overlays now update live during undo/redo operations</li>
            <li><strong>Margin/Gap Delineation:</strong> Robust separation between margin and gap handling to prevent mixed spacing</li>
            <li><strong>Staged Edits Chip:</strong> Improved reliability of the staged edits indicator in the bottom-right corner</li>
          </ul>
        </div>
        <TipSection title="Improved Interactions">
          All drag interactions are now more reliable and repeatable. Padding overlays work exactly like gap overlays with full modifier key support.
        </TipSection>
      </div>

      {/* v1.0.8 */}
      <div className="content-header">
        <h3>1.0.8</h3>
        <h4><i>Authentication reliability improvements</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li><strong>Production Backend:</strong> Hardcoded production backend URL for JWKS endpoint to ensure reliable authentication</li>
            <li><strong>Connection Fixes:</strong> Removed localhost fallback to prevent ERR_CONNECTION_REFUSED errors in production</li>
            <li><strong>Reliability:</strong> Improved authentication verification for production deployments</li>
          </ul>
        </div>
      </div>

      {/* v1.0.7 */}
      <div className="content-header">
        <h3>1.0.7</h3>
        <h4><i>Backend URL enforcement</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li><strong>JWKS Endpoint:</strong> Force JWKS fetch to production backend URL, removing localhost/heuristic fallbacks</li>
            <li><strong>Production Reliability:</strong> Ensures production authentication works reliably without fallbacks</li>
          </ul>
        </div>
      </div>

      {/* v1.0.6 */}
      <div className="content-header">
        <h3>1.0.6</h3>
        <h4><i>Smart environment detection</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li><strong>Auto-Detection:</strong> Inspector now automatically detects HTTPS (production) environment and uses production backend URL</li>
            <li><strong>Backward Compatibility:</strong> Fixes ERR_CONNECTION_REFUSED errors for users with existing projects</li>
            <li><strong>Smart Fallback:</strong> Works even if window.__SITU_BACKEND_URL is not set in older projects</li>
          </ul>
        </div>
      </div>

      {/* v1.0.5 */}
      <div className="content-header">
        <h3>1.0.5</h3>
        <h4><i>Automatic project configuration</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li><strong>Auto-Update:</strong> Extension now automatically updates index.html with backend URL on login</li>
            <li><strong>Activation Fix:</strong> Extension updates index.html on activation if user is already logged in</li>
            <li><strong>Error Handling:</strong> Improved error logging for JWKS fetch failures and token verification</li>
            <li><strong>Robust Updates:</strong> Better index.html update logic that handles existing configurations</li>
          </ul>
        </div>
      </div>

      {/* v1.0.4 */}
      <div className="content-header">
        <h3>1.0.4</h3>
        <h4><i>Production authentication fixes</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li><strong>JWKS Endpoint:</strong> JWKS endpoint now uses production backend URL in production mode</li>
            <li><strong>Backend URL Injection:</strong> Added window.__SITU_BACKEND_URL injection into index.html</li>
            <li><strong>Verification:</strong> Inspector authentication verification now works correctly with production backend</li>
            <li><strong>Error Logging:</strong> Improved error logging for attestation token creation and JWKS verification</li>
          </ul>
        </div>
      </div>

      {/* v1.0.3 */}
      <div className="content-header">
        <h3>1.0.3</h3>
        <h4><i>Production attestation fixes</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li><strong>Attestation Token:</strong> Attestation token creation now uses production backend URL in production mode</li>
            <li><strong>Marketplace Fix:</strong> Fixed issue where attestation file was not created after login in marketplace version</li>
          </ul>
        </div>
      </div>

      {/* v1.0.2 */}
      <div className="content-header">
        <h3>1.0.2</h3>
        <h4><i>Marketplace preparation</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li><strong>Extension Icon:</strong> Added extension icon for marketplace listing</li>
            <li><strong>WebSocket Support:</strong> Added WebSocket dependency (ws) for MCP server communication</li>
            <li><strong>Marketplace Categories:</strong> Updated categories (Visualization, Debuggers) for better discoverability</li>
            <li><strong>Keywords:</strong> Enhanced keywords for better search results</li>
            <li><strong>Documentation:</strong> Updated README to reflect free open beta status</li>
          </ul>
        </div>
      </div>

      {/* v1.0.1 */}
      <div className="content-header">
        <h3>1.0.1</h3>
        <h4><i>Production backend migration</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li><strong>Backend URL:</strong> Updated authentication backend URL to production Cloud Run endpoint</li>
            <li><strong>Environment Detection:</strong> Extension now uses production API in production mode, localhost for development</li>
          </ul>
        </div>
      </div>

      {/* v1.0.0 */}
      <div className="content-header">
        <h3>1.0.0</h3>
        <h4><i>Initial release with core inspection and editing capabilities</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li><strong>Element Selection:</strong> Alt+Click to select and inspect React elements</li>
            <li><strong>Visual Inspection:</strong> Hover outlines and preview chips showing element boundaries and dimensions</li>
            <li><strong>Layout Detection:</strong> Automatic gap and padding detection with visual indicators</li>
            <li><strong>Interactive Editing:</strong> Drag to resize gaps, click to input precise values</li>
            <li><strong>Distance Measurements:</strong> Figma-style measurements between elements</li>
            <li><strong>Color Editor:</strong> Built-in color picker with gradient support and HSV controls</li>
            <li><strong>Styles Sidebar:</strong> Real-time style editing and preview with comprehensive property controls</li>
            <li><strong>Source Navigation:</strong> Jump to element source code in VS Code with deep links</li>
            <li><strong>Account System:</strong> Account-based authentication and plan validation</li>
            <li><strong>Auto-Setup:</strong> Automatic project setup for Vite, Webpack, and Create React App projects</li>
            <li><strong>Command Palette:</strong> Full command palette integration for all inspector features</li>
            <li><strong>Secure Storage:</strong> Credential storage using VS Code's secret storage API</li>
          </ul>
        </div>
      </div>

      <TipSection title="Versioning">
        We follow <a href="https://semver.org/" style={{ color: '#3b82f6' }}>Semantic Versioning</a> for all releases. Patch versions (1.0.x) include bug fixes and minor improvements, minor versions (1.x.0) add new features, and major versions (x.0.0) include breaking changes.
      </TipSection>

      <div className="content-header">
        <h3>What's Next</h3>
        <h4><i>Upcoming features and improvements in development:</i></h4>
        <ul className="flex-list" style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li className="flex-list-item">Multi-framework support: Vue, Svelte, and more</li>
          <li className="flex-list-item">Component library detection: Auto-recognize design systems</li>
          <li className="flex-list-item">Team collaboration: Shared edit sessions</li>
          <li className="flex-list-item">Advanced state support: Focus, active, and custom pseudo-classes</li>
          <li className="flex-list-item">Design tokens: Integration with design systems</li>
        </ul>
      </div>

      <TipSection title="Stay Updated">
        Follow our releases and updates. We ship features frequently and respond quickly to user feedback.
      </TipSection>

    </div>
  );
};

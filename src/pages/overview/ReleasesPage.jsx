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
        <h3>1.0.0-open-beta3 <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 'normal' }}>Current</span></h3>
        <h4><i>Latest beta release with state editing, enhanced MCP integration, and improved border/fill editing.</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li>CSS State Detection: Automatic detection of <code>:hover</code> rules from stylesheets</li>
            <li>State Editing: Edit default and hover states with visual preview</li>
            <li>Border Edge Editor: Visual 4-edge border editor with per-edge control</li>
            <li>Enhanced MCP Format: Slim MCP format with <code>action</code>, <code>locator</code>, and <code>scope</code> for AI consumption</li>
            <li>Fill Persistence: Improved gradient editing with stop-level control</li>
            <li>Source Location Tracking: File:line:col tracking for all edits</li>
            <li>Differential Storage: Only changed properties stored in edits</li>
          </ul>
        </div>
        <TipSection title="Experimental">
        State editing is still experimental. Border and fill editing has been completely rebuilt for better reliability.
      </TipSection>
      </div>



      {/* v1.0.0-beta.3 */}
      <div className="content-header">
        <h3>1.0.0-beta.3</h3>
        <h4><i>Foundation release with core editing capabilities</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li>Padding Inspection: Visual green diagonal stripes for padding areas</li>
            <li>Inline Text Editing: Alt+Double-click to edit text with style preservation</li>
            <li>Styles Sidebar: Comprehensive sidebar for real-time property editing</li>
            <li>Flexbox Controls: Interactive 3x3 grid for justify-content and align-items</li>
            <li>Element Toolbar: Bottom toolbar with IDE navigation</li>
            <li>Color Picker: Advanced HSV controls with OKLCH support</li>
            <li>Gradient Editor: Multi-stop editor with draggable stops</li>
            <li>Background Fills: Dynamic fill layer management</li>
          </ul>
        </div>
      </div>

      {/* v1.0.0-beta.2 */}
      <div className="content-header">
        <h3>1.0.0-beta.2</h3>
        <h4><i>Enhanced gap detection and spacing visualization</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li>Multi-Gap Editing: Edit multiple gaps with same value simultaneously</li>
            <li>Shift+Click Control: Hold Shift to edit individual gaps</li>
            <li>Color-Coded Spacing: Orange for margins, Pink for gap properties</li>
            <li>Gap Input Chips: Click to input precise pixel values</li>
            <li>Component Name Chips: Display component names on selection</li>
            <li>Floated Element Support: Special handling for positioned elements</li>
            <li>Babel Plugin Cleanup: Streamlined build logging</li>
          </ul>
        </div>
      </div>

      {/* v1.0.0-beta.1 */}
      <div className="content-header">
        <h3>1.0.0-beta.1</h3>
        <h4><i>Initial beta release with gap detection and measurements</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li>Gap Detection: Visual indicators for spaces between elements</li>
            <li>Interactive Gap Resizing: Drag to resize gaps in real-time</li>
            <li>Distance Measurements: Figma-style measurements between elements</li>
            <li>Interactive Cursors: Resize cursors on gap overlays</li>
            <li>Component Differentiation: Different colors for React vs DOM elements</li>
            <li>Four-Directional Measurements: Parent-child relationship measurements</li>
          </ul>
        </div>
      </div>

      {/* v1.0.0-alpha.2 */}
      <div className="content-header">
        <h3>1.0.0-alpha.2</h3>
        <h4><i>Selection system and IDE integration</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li>Alt+Click Activation: Non-intrusive inspector activation</li>
            <li>Persistent Selection: Solid outlines that persist</li>
            <li>Cursor Deep Links: Direct navigation to source code</li>
            <li>Smart Event Handling: Prevents interference with app behavior</li>
            <li>Visual Hover Feedback: Dashed outlines and preview chips</li>
          </ul>
        </div>
      </div>

      {/* v1.0.0-alpha.1 */}
      <div className="content-header">
        <h3>1.0.0-alpha.1</h3>
        <h4><i>Initial alpha release with basic inspection</i></h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li>Basic Element Inspection: Hover and click detection</li>
            <li>Source Code Navigation: Deep links to Cursor IDE</li>
            <li>Babel Plugin Integration: Automatic data-source injection</li>
            <li>Development-Only Mode: Automatic exclusion from production builds</li>
            <li>Modular Architecture: Clean separation of concerns</li>
          </ul>
        </div>
      </div>

      {/* v0.1.0 */}
      <div className="content-header">
        <h3>0.1.0</h3>
        <h4>Project foundation</h4>
        <div style={{ color: '#a3a3a3', lineHeight: '2', marginTop: '0px' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li>Project initialization and structure</li>
            <li>Vite and React development setup</li>
            <li>Core infrastructure and tooling</li>
          </ul>
        </div>
      </div>

      <TipSection title="Versioning">
        We follow <a href="https://semver.org/" style={{ color: '#3b82f6' }}>Semantic Versioning</a> for all releases. Alpha releases are early development, Beta releases are feature-complete, and Stable releases are production-ready.
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

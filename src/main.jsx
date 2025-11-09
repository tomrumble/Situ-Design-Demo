import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWithAuth from './AppWithAuth.jsx'

/* CSS Separation:
 * - src/App.css: Main app styling (Base UI dark theme)
 * - Plugin CSS (loaded dynamically from bundle)/: Plugin CSS (loaded dynamically)
 * Both are completely isolated and don't interfere with each other
 */

// Preload Phosphor Icons for faster toolbar loading
// Works in both DEV and production (GitHub Pages)
const phosphorScript = document.createElement('script');
phosphorScript.type = 'module';
phosphorScript.src = 'https://unpkg.com/@phosphor-icons/webcomponents@2.1';
document.head.appendChild(phosphorScript);

// Load the obfuscated inspector from the bundled script
// The bundle auto-exports to window, but we need to call initializeSituInspector
// Note: index.html also tries to initialize, so we only warn if it's not already initialized
window.addEventListener('load', () => {
  // Only check if inspector wasn't already initialized by index.html
  if (window.__SITU_INSPECTOR_INITIALIZED) {
    return; // Already initialized
  }
  
  console.log('🔍 Window loaded, checking for inspector...');
  
  // Check if the inspector bundle loaded and auto-initialize
  // The bundle exports to window.SituInspector and window.installReactClickInspector
  if (window.SituInspector || window.installReactClickInspector) {
    console.log('✅ Inspector detected, initializing...');
    // Try to initialize via the available method
    if (typeof window.installReactClickInspector === 'function') {
      console.log('  → Using installReactClickInspector');
      window.installReactClickInspector();
      window.__SITU_INSPECTOR_INITIALIZED = true;
    } else if (window.SituInspector && typeof window.SituInspector.initialize === 'function') {
      console.log('  → Using SituInspector.initialize');
      window.SituInspector.initialize();
      window.__SITU_INSPECTOR_INITIALIZED = true;
    }
  } else {
    // Only warn if we're sure the bundle should have loaded by now
    setTimeout(() => {
      if (!window.__SITU_INSPECTOR_INITIALIZED && !window.installReactClickInspector && !window.SituInspector) {
        console.warn('⚠️ Inspector bundle not loaded - check Network tab for situImport.bundle.js');
      }
    }, 2000); // Give it 2 seconds before warning
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWithAuth />
  </React.StrictMode>,
)

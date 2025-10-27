import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'

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
window.addEventListener('load', () => {
  console.log('🔍 Window loaded, checking for inspector...');
  
  // Check if the inspector bundle loaded and auto-initialize
  // The bundle exports to window.SituInspector and window.installReactClickInspector
  if (window.SituInspector || window.installReactClickInspector) {
    console.log('✅ Inspector detected, initializing...');
    // Try to initialize via the available method
    if (typeof window.installReactClickInspector === 'function') {
      console.log('  → Using installReactClickInspector');
      window.installReactClickInspector();
    } else if (window.SituInspector && typeof window.SituInspector.initialize === 'function') {
      console.log('  → Using SituInspector.initialize');
      window.SituInspector.initialize();
    }
  } else {
    console.warn('⚠️ Inspector bundle not loaded - check Network tab for situImport.bundle.js');
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)

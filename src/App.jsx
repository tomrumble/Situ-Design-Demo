import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { ScrollArea } from '@base-ui-components/react/scroll-area'
import './App.css'
import TipSection from './components/TipSection'
import BetaSection from './components/BetaSection';
import WarningSection from './components/WarningSection';
import DemoInstructions from './components/DemoInstructions'
import ElementEditViewer from './components/ElementEditViewer'
import DemoCard from './components/DemoCard'
import MainHeader from './components/MainHeader'
import AuthButtons from './components/AuthButtons'
import NavButton from './components/NavButton'

// Import utilities from the bundled window object
// These come from the obfuscated situ-demo-utils.bundle.js
const {
  mergeFillsWithUpdates,
  populateBaselinesFromComputedStyles,
  computeDelta,
  valuesEqualLoose,
  pruneGradientFillForDisplay,
  collectChangedKeySets,
  generateFullJsonDiff,
  generateJsonDiffFromHighlighted
} = window.SituDemoUtils || {};

import { useAuth } from './contexts/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AccountPage } from './pages/AccountPage'
import { GetStartedPage } from './pages/overview/GetStartedPage'
import { AboutPage } from './pages/overview/AboutPage'
import { ReleasesPage } from './pages/overview/ReleasesPage'
import { StatesPage } from './pages/overview/StatesPage'
import { SizePage } from './pages/overview/SizePage'
import { PositionPage } from './pages/overview/PositionPage'
import { ZIndexPage } from './pages/overview/ZIndexPage'
import { OverflowPage } from './pages/overview/OverflowPage'
import { TransformPage } from './pages/overview/TransformPage'
import { CodePage } from './pages/overview/CodePage'
import { SelectionPage } from './pages/overview/SelectionPage'
import { DistancePage } from './pages/overview/DistancePage'
import { BlurPage } from './pages/overview/BlurPage'
import { TransitionPage } from './pages/overview/TransitionPage'
import { AnimationPage } from './pages/overview/AnimationPage'
import { GridPage } from './pages/overview/GridPage'
import { SpacingPage } from './pages/overview/SpacingPage'
import { TermsPage } from './pages/TermsPage'
import { PrivacyPage } from './pages/PrivacyPage'
import SectionNav from './components/SectionNav'

// Utility: escape HTML for safe insertion
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}



function pruneFillsArrayForDisplay(fills) {
  if (!Array.isArray(fills)) return fills;
  return fills.map(pruneGradientFillForDisplay);
}

// Ensure parity on gradient defaults when building candidates for diff
function normalizeFillsArrayForDiff(fills) {
  try {
    // Get from bundled window object if available
    if (window.SituDemoUtils && window.SituDemoUtils.normalizeFillsArrayForDiff) {
      return window.SituDemoUtils.normalizeFillsArrayForDiff(fills);
    }
    return fills;
  } catch (_) {
    return fills;
  }
}

// Navigation Component
function Navigation() {
  const location = useLocation()
  
  const navbarSections = [
    {
      title: 'Situ',
      items: [
        { id: 'about', label: 'About Situ', path: '/overview/about' },
        { id: 'get-started', label: 'Get Started', path: '/overview/get-started' }, 
        { id: 'Releases', label: 'Releases', path: '/overview/releases' }
      ]
    },
    {
      title: 'Style',
      items: [
        { id: 'states', label: 'States', path: '/overview/states', badge: 'Experimental' },
        { id: 'fills', label: 'Fills', path: '/overview/fills', badge: 'Beta' },
        { id: 'borders', label: 'Borders', path: '/overview/borders', badge: 'Beta' },
        { id: 'typography', label: 'Typography', path: '/overview/typography', badge: 'Beta' },
      ]
    },
    {
      title: 'Layout',
        items: [
          { id: 'layout', label: 'Flexbox', path: '/overview/flexbox', badge: 'Beta' },
          { id: 'grid', label: 'Grid', path: '/overview/grid', badge: 'Experimental' },
          { id: 'spacing', label: 'Spacing', path: '/overview/spacing', badge: 'Experimental' },
          { id: 'Size', label: 'Size', path: '/overview/size', badge: 'Beta' },
          { id: 'Position', label: 'Position', path: '/overview/position', badge: 'Coming Soon' },
          { id: 'Z-Index', label: 'Z-Index', path: '/overview/z-index', badge: 'Coming Soon' },
          { id: 'Overflow', label: 'Overflow', path: '/overview/overflow', badge: 'Coming Soon' },
          { id: 'Transform', label: 'Transform', path: '/overview/transform', badge: 'Coming Soon' },
        ]
    },
    {
      title: 'Inspect',
      items: [
        { id: 'Code', label: 'Open in Cursor', path: '/overview/code', badge: 'Beta' },
        { id: 'selection', label: 'Selection', path: '/overview/selection', badge: 'Beta' },
        { id: 'distance', label: 'Distance', path: '/overview/distance', badge: 'Beta' },
      ]
    },
    {
      title: 'Effects',
        items: [
          { id: 'shadows', label: 'Shadows', path: '/overview/shadows', badge: 'Coming Soon'},
          { id: 'blur', label: 'Blur', path: '/overview/blur', badge: 'Coming Soon'},
          { id: 'Transition', label: 'Transition', path: '/overview/transition', badge: 'Coming Soon'},
          { id: 'Animation', label: 'Animation', path: '/overview/animation', badge: 'Coming Soon'},
        ]
    },
    {
      title: 'Privacy & Terms',
      items: [
        { id: 'privacy', label: 'Privacy Policy', path: '/privacy' },
        { id: 'terms', label: 'Terms of Service', path: '/terms' }
      ]
    }
  ]

  return (
    <aside className="navbar">
      {navbarSections.map((section) => (
        <div key={section.title} className="navbar-section">
          <h3 className="navbar-section-title">{section.title}</h3>
          <nav className="navbar-nav">
            {section.items.map((item) => (
              <NavButton key={item.id} item={item} />
            ))}
          </nav>
        </div>
      ))}
    </aside>
  )
}

// About Component
function About() {
  return <AboutPage />;
}

// Unified component to display inspector edits JSON for any element
function ElementEditsViewer({ elementId }) {
  const [highlightedJson, setHighlightedJson] = useState('');
  const [styleState, setStyleState] = useState('original'); // 'original' or 'updated'

  // Syntax highlighting function for JSON
  const syntaxHighlight = (json) => {
    if (!json) return "";

    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  };

  // Function to get inspector edits JSON for the specified element
  const getElementEdits = () => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      // Find element edit with fill, appearance, typography, border, or layout changes for the specified element (nested-only)
      const elementEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.elementId === elementId &&
        edit.updated && (
          (edit.type === 'element' && (
            // Check for any state having changes
            (edit.updated.states && typeof edit.updated.states === 'object' && Object.keys(edit.updated.states).some(stateName =>
              (edit.updated.states[stateName]?.fill && Array.isArray(edit.updated.states[stateName].fill)) ||
              (edit.updated.states[stateName]?.appearance && typeof edit.updated.states[stateName].appearance === 'object') ||
              (edit.updated.states[stateName]?.typography && typeof edit.updated.states[stateName].typography === 'object') ||
              (edit.updated.states[stateName]?.border && typeof edit.updated.states[stateName].border === 'object') ||
              (edit.updated.states[stateName]?.layout && typeof edit.updated.states[stateName].layout === 'object')
            ))
          )) ||
          ((edit.type === 'fill' || edit.type === 'fills') && Array.isArray(edit.updated)) ||
          (edit.type === 'border' && typeof edit.updated === 'object')
        )
      );


      if (!elementEdit) {
        // Show original data from element's data-original-element attribute
        try {
          const el = document.querySelector(`[data-id="${elementId}"]`);
          if (el) {
            const attr = el.getAttribute('data-original-element');
            if (!attr) {
              setHighlightedJson(syntaxHighlight('No baseline data found.'));
              return;
            }

            const baselineData = JSON.parse(attr);
            if (baselineData && baselineData.states && baselineData.states.default) {
              const defaultState = baselineData.states.default;
              let stateObj = { states: { default: {} } };
              
              // Determine element type based on ID
              const isLayoutElement = elementId.includes('layout') || elementId.includes('grid') || elementId.includes('flex') || elementId.includes('spacing') || elementId.includes('gap') || elementId.includes('margin') || elementId.includes('padding');
              const isFillElement = elementId.includes('color') || elementId.includes('gradient');
              const isBorderElement = elementId.includes('border');
              const isTypographyElement = elementId.includes('heading') || elementId.includes('paragraph');
              
              // Check for fills - only show for fill elements
              if (defaultState.fill && Array.isArray(defaultState.fill) && isFillElement) {
                stateObj.states.default.fill = defaultState.fill;
              }
              
              // Check for typography - only show for typography elements
              if (defaultState.typography && typeof defaultState.typography === 'object' && isTypographyElement) {
                stateObj.states.default.typography = defaultState.typography;
              }
              
              // Check for borders - only show for border elements
              if (defaultState.border && typeof defaultState.border === 'object' && isBorderElement) {
                stateObj.states.default.border = defaultState.border;
              }
              
              // Check for layout - only show for layout elements
              if (defaultState.layout && typeof defaultState.layout === 'object' && isLayoutElement) {
                stateObj.states.default.layout = defaultState.layout;
              }
              
              // Only show if we found relevant data for this element type
              if (stateObj.states.default.fill || stateObj.states.default.typography || stateObj.states.default.border || stateObj.states.default.layout) {
                const jsonString = JSON.stringify(stateObj, null, 2);
                const highlighted = syntaxHighlight(jsonString);

                // Create diff HTML showing the original data (no diff since no changes)
                const diffHtml = generateJsonDiffFromHighlighted(
                  jsonString,
                  jsonString, // Same content for both sides (no diff)
                  highlighted,
                  highlighted
                );
                setHighlightedJson(diffHtml);
                setStyleState('original');
                return;
              }
            }
          }
        } catch (_) {}
        // Fallback to original message if data attribute not found
        setHighlightedJson(syntaxHighlight('No edits found. Using default values from codebase.'));
        return;
      }

      // Build pretty JSON strings for original/updated
      // Format the edit data for display (like before)
      const isUnified = elementEdit.type === 'element';
      const isBorder = elementEdit.type === 'border';
      const formattedEdit = isUnified ? (() => {
        // Support nested states structure - iterate all states
        const stateNames = new Set([
          ...Object.keys(elementEdit.original?.states || {}),
          ...Object.keys(elementEdit.updated?.states || {})
        ]);
        
        // Always include default if nothing else
        if (stateNames.size === 0) stateNames.add('default');
        
        const statesObj = {};
        stateNames.forEach(stateName => {
          const stateOriginal = elementEdit.original?.states?.[stateName] || {};
          const stateUpdated = elementEdit.updated?.states?.[stateName] || {};
          
          // Handle fills for this state
          const origFill = Array.isArray(stateOriginal.fill) ? stateOriginal.fill : [];
          const updFill = Array.isArray(stateUpdated.fill) ? stateUpdated.fill : [];
          
          // Always include fill data if it exists in either original or updated (including empty arrays for removals)
          if (Array.isArray(stateOriginal.fill) || Array.isArray(stateUpdated.fill)) {
            if (!statesObj[stateName]) {
              statesObj[stateName] = {};
            }
            statesObj[stateName].fill = Array.isArray(stateUpdated.fill) ? stateUpdated.fill : origFill;
          }
          
          // Handle appearance for this state
          if (stateUpdated.appearance && typeof stateUpdated.appearance === 'object') {
            if (!statesObj[stateName]) {
              statesObj[stateName] = {};
            }
            statesObj[stateName].appearance = stateUpdated.appearance;
          }

          // Handle typography for this state
          const stateUpdatedTypography = (stateUpdated && typeof stateUpdated.typography === 'object') ? stateUpdated.typography : undefined;
          const stateOriginalTypography = (stateOriginal && typeof stateOriginal.typography === 'object') ? stateOriginal.typography : undefined;
          if (stateUpdatedTypography || stateOriginalTypography) {
            if (!statesObj[stateName]) {
              statesObj[stateName] = {};
            }
            // Filter typography to only include changed properties for typography
            if (stateName === 'default' && stateUpdatedTypography && stateOriginalTypography) {
              const filteredOriginalTypography = {};
              const filteredTypographyUpdates = {};
              
              Object.keys(stateUpdatedTypography).forEach(key => {
                const origValue = stateOriginalTypography[key];
                const updValue = stateUpdatedTypography[key];
                
                // Only include if values differ
                if (JSON.stringify(origValue) !== JSON.stringify(updValue)) {
                  filteredOriginalTypography[key] = origValue;
                  filteredTypographyUpdates[key] = updValue;
                }
              });
              
              if (Object.keys(filteredTypographyUpdates).length > 0) {
                statesObj[stateName].typography = filteredTypographyUpdates;
              }
            } else {
              statesObj[stateName].typography = stateUpdatedTypography || stateOriginalTypography;
            }
          }
          
          // Handle border for this state (nested-only)
          const stateUpdatedBorder = (stateUpdated && typeof stateUpdated.border === 'object') ? stateUpdated.border : undefined;
          const stateOriginalBorder = (stateOriginal && typeof stateOriginal.border === 'object') ? stateOriginal.border : undefined;
          if (stateUpdatedBorder || stateOriginalBorder) {
            if (!statesObj[stateName]) {
              statesObj[stateName] = {};
            }
              // Filter border to only include changed properties for borders
              if (stateName === 'default' && stateUpdatedBorder && stateOriginalBorder) {
                const filteredOriginalBorder = {};
                const filteredBorderUpdates = {};
                
                Object.keys(stateUpdatedBorder).forEach(key => {
                  const origValue = stateOriginalBorder[key];
                  const updValue = stateUpdatedBorder[key];
                  
                  // Only include if values differ
                  if (JSON.stringify(origValue) !== JSON.stringify(updValue)) {
                    filteredOriginalBorder[key] = origValue;
                    filteredBorderUpdates[key] = updValue;
                  }
                });
                
                if (Object.keys(filteredBorderUpdates).length > 0) {
                  statesObj[stateName].border = filteredBorderUpdates;
                }
              } else {
                statesObj[stateName].border = stateUpdatedBorder || stateOriginalBorder;
              }
          }
          // Handle layout for this state (include gap/padding/margin)
          const stateUpdatedLayout = (stateUpdated && typeof stateUpdated.layout === 'object') ? stateUpdated.layout : undefined;
          const stateOriginalLayout = (stateOriginal && typeof stateOriginal.layout === 'object') ? stateOriginal.layout : undefined;
          if (stateUpdatedLayout || stateOriginalLayout) {
            if (!statesObj[stateName]) {
              statesObj[stateName] = {};
            }
            // Ensure we only display relevant layout keys for brevity
            const layoutForDisplay = stateUpdatedLayout || stateOriginalLayout;
            const filtered = {};
            ['display','flexDirection','gap','rowGap','columnGap','paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginRight','marginBottom','marginLeft','width','height'].forEach(k => {
              if (layoutForDisplay && Object.prototype.hasOwnProperty.call(layoutForDisplay, k)) filtered[k] = layoutForDisplay[k];
            });
            statesObj[stateName].layout = filtered;
          }
        });
        

        return {
          elementId: elementEdit.elementId,
          type: 'element',
          source: elementEdit.source,
          timestamp: new Date(elementEdit.timestamp).toLocaleString(),
          states: statesObj
        };
      })() : isBorder ? (() => {
        // Border handling - convert to unified format
        const origBorder = elementEdit.original || {};
        const updBorder = elementEdit.updated || {};
        
        // Build display-only delta for border: include only keys that changed
        const displayUpdatedBorder = (() => {
          if (!updBorder || Object.keys(updBorder).length === 0) return {};
          const out = {};
          Object.keys(updBorder).forEach(k => {
            const ov = origBorder ? origBorder[k] : undefined;
            const uv = updBorder[k];
            if (!valuesEqualLoose(ov, uv)) out[k] = uv;
          });
          return out;
        })();

        return {
          elementId: elementEdit.elementId,
          type: 'element',
          source: elementEdit.source,
          timestamp: new Date(elementEdit.timestamp).toLocaleString(),
          original: [
            { border: origBorder }
          ],
          updated: [
            { border: displayUpdatedBorder }
          ]
        };
      })() : (() => {
        // Legacy fill handling
        const prunedOriginal = pruneFillsArrayForDisplay(elementEdit.original || []);
        const prunedUpdated = pruneFillsArrayForDisplay(elementEdit.updated || []);
        const deltaUpdated = computeDelta(prunedOriginal, prunedUpdated);
        return {
          elementId: elementEdit.elementId,
          type: elementEdit.type,
          source: elementEdit.source,
          timestamp: new Date(elementEdit.timestamp).toLocaleString(),
          original: prunedOriginal,
          updated: deltaUpdated
        };
      })();

      // Create a version with original values for comparison
      const originalEdit = isUnified ? (() => {
        // Use the same states structure as formattedEdit
        const stateNames = new Set([
          ...Object.keys(elementEdit.original?.states || {}),
          ...Object.keys(elementEdit.updated?.states || {})
        ]);
        
        // Always include default if nothing else
        if (stateNames.size === 0) stateNames.add('default');
        
        const originalStatesObj = {};
        stateNames.forEach(stateName => {
          const stateOriginal = elementEdit.original?.states?.[stateName] || {};
          
          // Handle fills for this state
          const origFill = Array.isArray(stateOriginal.fill) ? stateOriginal.fill : [];
          
          // Always include fill data if it exists (including empty arrays for removals)
          if (Array.isArray(stateOriginal.fill)) {
            originalStatesObj[stateName] = originalStatesObj[stateName] || {};
            originalStatesObj[stateName].fill = origFill;
          }
          
          // Handle appearance for this state
          if (stateOriginal.appearance && typeof stateOriginal.appearance === 'object') {
            originalStatesObj[stateName] = originalStatesObj[stateName] || {};
            originalStatesObj[stateName].appearance = stateOriginal.appearance;
          }
          
          // Handle border for this state
          if (stateOriginal.border && typeof stateOriginal.border === 'object') {
            originalStatesObj[stateName] = originalStatesObj[stateName] || {};
            originalStatesObj[stateName].border = stateOriginal.border;
          }
          
          // Handle layout for this state
          if (stateOriginal.layout && typeof stateOriginal.layout === 'object') {
            originalStatesObj[stateName] = originalStatesObj[stateName] || {};
            originalStatesObj[stateName].layout = stateOriginal.layout;
          }
        });
        
        return {
          elementId: elementEdit.elementId,
          type: 'element',
          source: elementEdit.source,
          timestamp: new Date(elementEdit.timestamp).toLocaleString(),
          states: originalStatesObj
        };
      })() : isBorder ? (() => {
        // Border original edit - use original border data
        const origBorder = elementEdit.original || {};
        return {
          elementId: elementEdit.elementId,
          type: 'element',
          source: elementEdit.source,
          timestamp: new Date(elementEdit.timestamp).toLocaleString(),
          original: [
            { border: origBorder }
          ],
          updated: [
            { border: origBorder }
          ]
        };
      })() : {
        elementId: elementEdit.elementId,
        type: elementEdit.type,
        source: elementEdit.source,
        timestamp: new Date(elementEdit.timestamp).toLocaleString(),
        original: pruneFillsArrayForDisplay(elementEdit.original || []),
        updated: pruneFillsArrayForDisplay(elementEdit.original || [])
      };

      // Simpler diff approach: compare baseline (from element's data attributes when available)
      // with only the updated sections. Red = removed (from baseline), Green = added (in updated).
      let simpleOriginalObj = {};
      let simpleUpdatedObj = {};

      try {
        if (isUnified) {
          const el = document.querySelector(`[data-id="${elementEdit.elementId}"]`);
          let baseline = {};
          try {
            const attr = el ? el.getAttribute('data-original-element') : null;
            if (attr) {
              const parsed = JSON.parse(attr);
              // Extract default state from new structure
              if (parsed && parsed.states && parsed.states.default) {
                baseline = { ...parsed.states.default };
              }
            }
          } catch (_) {}
          if (!baseline || typeof baseline !== 'object') baseline = {};

          // Extract updated values from nested states structure - include ALL states
          const allStates = new Set([
            ...Object.keys(elementEdit.original?.states || {}),
            ...Object.keys(elementEdit.updated?.states || {})
          ]);
          
          // Always include default if nothing else
          if (allStates.size === 0) allStates.add('default');
          
          const statesObj = {};
          allStates.forEach(stateName => {
            const stateOriginal = elementEdit.original?.states?.[stateName] || {};
            const stateUpdated = elementEdit.updated?.states?.[stateName] || {};
            
            // Handle fills for this state
            const origFill = Array.isArray(stateOriginal.fill) ? stateOriginal.fill : [];
            const updFill = Array.isArray(stateUpdated.fill) ? stateUpdated.fill : [];
            
            // Always include fill data if it exists in either original or updated (including empty arrays for removals)
            if (Array.isArray(stateOriginal.fill) || Array.isArray(stateUpdated.fill)) {
              statesObj[stateName] = statesObj[stateName] || {};
              statesObj[stateName].fill = Array.isArray(stateUpdated.fill) ? stateUpdated.fill : origFill;
            }
            
            // Handle appearance for this state
            if (stateUpdated.appearance && typeof stateUpdated.appearance === 'object') {
              statesObj[stateName] = statesObj[stateName] || {};
              statesObj[stateName].appearance = stateUpdated.appearance;
            }
            
            // Handle border for this state
            if (stateUpdated.border && typeof stateUpdated.border === 'object') {
              statesObj[stateName] = statesObj[stateName] || {};
              statesObj[stateName].border = stateUpdated.border;
            }
          });
          
          // Build FULL original and FULL updated objects for clean diff using nested states only
          const defaultStateOriginal = elementEdit.original?.states?.default || {};
          const defaultStateUpdated = elementEdit.updated?.states?.default || {};
          
          // Use original fills from the edit, not baseline (baseline is for fallback display only)
          const originalFills = Array.isArray(defaultStateOriginal.fill) ? defaultStateOriginal.fill : [];
          const updatedFills = Array.isArray(defaultStateUpdated.fill) ? defaultStateUpdated.fill : originalFills;

          const fullOriginal = {
            fill: originalFills,
            appearance: defaultStateOriginal.appearance || {},
            typography: defaultStateOriginal.typography || {},
            border: (defaultStateOriginal.border || {})
          };
          const fullUpdated = {
            fill: updatedFills,
            appearance: { ...fullOriginal.appearance, ...(defaultStateUpdated.appearance || {}) },
            typography: { ...fullOriginal.typography, ...(defaultStateUpdated.typography || {}) },
            border: (defaultStateUpdated.border || fullOriginal.border)
          };

          // Debug: log raw inputs for conic gradients before normalization/pruning
          try {
            const hasConic = (arr) => Array.isArray(arr) && arr.some(f => f && f.mode === 'gradient' && (f.type === 'conic' || f.gradientType === 'conic'));
            if (hasConic(fullOriginal.fill) || hasConic(fullUpdated.fill)) {
              // eslint-disable-next-line no-console
              console.debug('[ElementEditsViewer] Conic inputs before diff:', {
                elementId: elementEdit.elementId,
                originalFill: fullOriginal.fill,
                updatedFill: fullUpdated.fill
              });
            }
          } catch (_) {}

            // Prune for display and include ONLY top-level sections that changed
            // Show all properties nested under states for clarity
            const originalCandidate = {
              states: {}
            };
            const updatedCandidate = {
              states: {}
            };
            
            // Build original states from baseline
            allStates.forEach(stateName => {
              const stateOriginal = elementEdit.original?.states?.[stateName] || {};
              const stateUpdated = elementEdit.updated?.states?.[stateName] || {};
              
              // For default state, use original data from the edit
              if (stateName === 'default') {
                // Use baseline as the original border source
                const baselineBorder = (baseline && typeof baseline.border === 'object' && Object.keys(baseline.border).length > 0) 
                  ? baseline.border 
                  : ((stateOriginal && typeof stateOriginal.border === 'object') ? stateOriginal.border : {});
                
                let filteredOriginalBorder = baselineBorder;
                let filteredUpdatedBorder = baselineBorder;
                
                // Filter border to only include changed properties
                if (stateUpdated && typeof stateUpdated.border === 'object' && Object.keys(stateUpdated.border).length > 0) {
                  const filteredOriginal = {};
                  const filteredUpdates = {};
                  
                  Object.keys(stateUpdated.border).forEach(key => {
                    const origValue = baselineBorder[key];
                    const updValue = stateUpdated.border[key];
                    
                    // Only include if values differ
                    if (JSON.stringify(origValue) !== JSON.stringify(updValue)) {
                      filteredOriginal[key] = origValue;
                      filteredUpdates[key] = updValue;
                    }
                  });
                  
                  if (Object.keys(filteredUpdates).length > 0) {
                    filteredOriginalBorder = filteredOriginal;
                    filteredUpdatedBorder = filteredUpdates;
                  }
                }
                // Use baseline as the original typography source
                const baselineTypography = (baseline && typeof baseline.typography === 'object' && Object.keys(baseline.typography).length > 0)
                  ? baseline.typography
                  : ((stateOriginal && typeof stateOriginal.typography === 'object') ? stateOriginal.typography : {});
                
                let filteredOriginalTypography = baselineTypography;
                let filteredUpdatedTypography = baselineTypography;
                
                // Filter typography to only include changed properties
                if (stateUpdated && typeof stateUpdated.typography === 'object' && Object.keys(stateUpdated.typography).length > 0) {
                  const filteredOriginal = {};
                  const filteredUpdates = {};
                  
                  Object.keys(stateUpdated.typography).forEach(key => {
                    const origValue = baselineTypography[key];
                    const updValue = stateUpdated.typography[key];
                    
                    // Only include if values differ
                    if (JSON.stringify(origValue) !== JSON.stringify(updValue)) {
                      filteredOriginal[key] = origValue;
                      filteredUpdates[key] = updValue;
                    }
                  });
                  
                  if (Object.keys(filteredUpdates).length > 0) {
                    filteredOriginalTypography = filteredOriginal;
                    filteredUpdatedTypography = filteredUpdates;
                  }
                }
                // Use baseline as the original layout source
                const baselineLayout = (baseline && typeof baseline.layout === 'object' && Object.keys(baseline.layout).length > 0)
                  ? baseline.layout
                  : ((stateOriginal && typeof stateOriginal.layout === 'object') ? stateOriginal.layout : {});
                
                let filteredOriginalLayout = baselineLayout;
                let filteredUpdatedLayout = baselineLayout;
                originalCandidate.states.default = {
                  fill: normalizeFillsArrayForDiff(pruneFillsArrayForDisplay(Array.isArray(stateOriginal.fill) ? stateOriginal.fill : [])),
                  appearance: stateOriginal.appearance || {},
                  typography: filteredOriginalTypography,
                  border: filteredOriginalBorder,
                  layout: filteredOriginalLayout
                };

                const defaultUpdFillArr = Array.isArray(stateUpdated.fill) ? stateUpdated.fill : null;
                
                // Filter fills to only include fills that changed
                // Use baseline as the original fill
                const baselineFill = (baseline && Array.isArray(baseline.fill) && baseline.fill.length > 0) 
                  ? normalizeFillsArrayForDiff(pruneFillsArrayForDisplay(baseline.fill))
                  : normalizeFillsArrayForDiff(pruneFillsArrayForDisplay(Array.isArray(stateOriginal.fill) ? stateOriginal.fill : []));
                
                let filteredOriginalFill = baselineFill;
                let filteredUpdatedFill = baselineFill;
                
                if (defaultUpdFillArr && Array.isArray(defaultUpdFillArr)) {
                  const updFillPruned = normalizeFillsArrayForDiff(pruneFillsArrayForDisplay(defaultUpdFillArr));
                  
                  // Use computeDelta to get only the changed fills
                  const deltaFills = computeDelta(baselineFill, updFillPruned);
                  if (deltaFills && Array.isArray(deltaFills) && deltaFills.length > 0) {
                    filteredOriginalFill = baselineFill;
                    filteredUpdatedFill = updFillPruned;
                  }
                }
                
                // Filter layout to only include changed properties
                if (stateUpdated && typeof stateUpdated.layout === 'object' && Object.keys(stateUpdated.layout).length > 0) {
                  const filteredOriginal = {};
                  const filteredUpdates = {};
                  
                  Object.keys(stateUpdated.layout).forEach(key => {
                    const origValue = baselineLayout[key];
                    const updValue = stateUpdated.layout[key];
                    
                    // Only include if values differ
                    if (JSON.stringify(origValue) !== JSON.stringify(updValue)) {
                      filteredOriginal[key] = origValue;
                      filteredUpdates[key] = updValue;
                    }
                  });
                  
                  if (Object.keys(filteredUpdates).length > 0) {
                    filteredOriginalLayout = filteredOriginal;
                    filteredUpdatedLayout = filteredUpdates;
                  }
                }
                
                updatedCandidate.states.default = {
                  fill: filteredUpdatedFill,
                  appearance: { ...originalCandidate.states.default.appearance, ...(stateUpdated.appearance || {}) },
                  typography: filteredUpdatedTypography,
                  border: filteredUpdatedBorder,
                  layout: filteredUpdatedLayout
                };
                
                // Update original to use filtered fills
                originalCandidate.states.default.fill = filteredOriginalFill;
                
                // Update original to use filtered borders
                originalCandidate.states.default.border = filteredOriginalBorder;
                
                // Update original to use filtered typography
                originalCandidate.states.default.typography = filteredOriginalTypography;
                
                // Update original to use filtered layout
                originalCandidate.states.default.layout = filteredOriginalLayout;
              } else {
                // For non-default states, include them if they exist in either original or updated
                const hasOriginal = stateOriginal && (stateOriginal.fill || stateOriginal.appearance || stateOriginal.typography || stateOriginal.border || stateOriginal.layout);
                const hasUpdated = stateUpdated && (stateUpdated.fill || stateUpdated.appearance || stateUpdated.typography || stateUpdated.border || stateUpdated.layout);

                if (hasOriginal || hasUpdated) {
                  originalCandidate.states[stateName] = {
                    fill: normalizeFillsArrayForDiff(pruneFillsArrayForDisplay(Array.isArray(stateOriginal.fill) ? stateOriginal.fill : [])),
                    appearance: stateOriginal.appearance || {},
                    typography: (stateOriginal && typeof stateOriginal.typography === 'object') ? stateOriginal.typography : {},
                    border: stateOriginal.border || {},
                    layout: (stateOriginal && typeof stateOriginal.layout === 'object') ? stateOriginal.layout : {}
                  };
                  // Only display updated border keys that actually changed per persisted delta for this state
                  const deltaBorderState = elementEdit.changes?.states?.[stateName]?.border;
                  const updatedBorderState = (deltaBorderState && typeof deltaBorderState === 'object' && Object.keys(deltaBorderState).length > 0)
                    ? { ...(originalCandidate.states[stateName].border || {}), ...deltaBorderState }
                    : (originalCandidate.states[stateName].border || {});
                  // Only display updated typography keys that actually changed per persisted delta for this state
                  const deltaTypographyState = elementEdit.changes?.states?.[stateName]?.typography;
                  const updatedTypographyState = (deltaTypographyState && typeof deltaTypographyState === 'object' && Object.keys(deltaTypographyState).length > 0)
                    ? { ...(originalCandidate.states[stateName].typography || {}), ...deltaTypographyState }
                    : (originalCandidate.states[stateName].typography || {});
                  // Filter layout to only include changed properties
                  let filteredLayoutState = originalCandidate.states[stateName] ? originalCandidate.states[stateName].layout : {};
                  if (stateUpdated && typeof stateUpdated.layout === 'object') {
                    const stateOriginalLayout = (stateOriginal && typeof stateOriginal.layout === 'object') ? stateOriginal.layout : {};
                    const filteredOriginalLayout = {};
                    const filteredUpdatedLayout = {};
                    
                    Object.keys(stateUpdated.layout).forEach(key => {
                      const origValue = stateOriginalLayout[key];
                      const updValue = stateUpdated.layout[key];
                      
                      // Only include if values differ
                      if (JSON.stringify(origValue) !== JSON.stringify(updValue)) {
                        filteredOriginalLayout[key] = origValue;
                        filteredUpdatedLayout[key] = updValue;
                      }
                    });
                    
                    filteredLayoutState = Object.keys(filteredUpdatedLayout).length > 0 
                      ? filteredUpdatedLayout
                      : (stateOriginalLayout || {});
                    
                    // Update original if we have filtered changes
                    if (Object.keys(filteredOriginalLayout).length > 0) {
                      originalCandidate.states[stateName].layout = filteredOriginalLayout;
                    }
                  }
                  
                  updatedCandidate.states[stateName] = {
                    fill: normalizeFillsArrayForDiff(pruneFillsArrayForDisplay(Array.isArray(stateUpdated.fill) ? stateUpdated.fill : [])),
                    appearance: stateUpdated.appearance || {},
                    typography: updatedTypographyState,
                    border: updatedBorderState,
                    layout: filteredLayoutState
                  };
                }
              }
            });
          // Determine changed top-level keys using the shared diff util
          const topDelta = computeDelta(originalCandidate, updatedCandidate) || {};
          const changedTopKeys = Object.keys(topDelta);


          simpleOriginalObj = {};
          simpleUpdatedObj = {};
          changedTopKeys.forEach(k => {
            if (Object.prototype.hasOwnProperty.call(originalCandidate, k)) {
              simpleOriginalObj[k] = originalCandidate[k];
            }
            if (Object.prototype.hasOwnProperty.call(updatedCandidate, k)) {
              simpleUpdatedObj[k] = updatedCandidate[k];
            }
          });
        } else if (isBorder) {
          // Border-only edits
          const base = elementEdit.original || {};
          const upd = elementEdit.updated || {};
          simpleOriginalObj = base;
          simpleUpdatedObj = { ...base, ...upd };
        } else {
          // Legacy fill edits
          const base = Array.isArray(elementEdit.original) ? elementEdit.original : [];
          const upd = Array.isArray(elementEdit.updated) ? elementEdit.updated : [];
          const merged = mergeFillsWithUpdates(base, upd);
          simpleOriginalObj = pruneFillsArrayForDisplay(base);
          simpleUpdatedObj = pruneFillsArrayForDisplay(merged);
        }
      } catch (_) {}

      const originalJsonString = JSON.stringify(simpleOriginalObj, null, 2);
      const updatedJsonString = JSON.stringify(simpleUpdatedObj, null, 2);

      
      // Detect if either JSON string is just "{}" and revert to original data-original-element
      if (originalJsonString === '{}' || updatedJsonString === '{}') {
        try {
          const el = document.querySelector(`[data-id="${elementEdit.elementId}"]`);
          if (el) {
            const attr = el.getAttribute('data-original-element');
            if (attr) {
              const parsed = JSON.parse(attr);
              if (parsed && parsed.states && parsed.states.default && parsed.states.default.fill && Array.isArray(parsed.states.default.fill)) {
                // Show only the fill object for fill-related demo cards
                const fillObj = { fill: parsed.states.default.fill };
                const fillJsonString = JSON.stringify(fillObj, null, 2);
                const fillHighlighted = syntaxHighlight(fillJsonString);

                // Create diff HTML showing the original fill (no diff since no changes)
                const diffHtml = generateJsonDiffFromHighlighted(
                  fillJsonString,
                  fillJsonString, // Same content for both sides (no diff)
                  fillHighlighted,
                  fillHighlighted
                );
                setHighlightedJson(diffHtml);
                setStyleState('original');
                return;
              } else if (parsed && parsed.states && parsed.states.default && parsed.states.default.typography && typeof parsed.states.default.typography === 'object') {
                // Show only the typography object for typography-related demo cards
                const typographyObj = { typography: parsed.states.default.typography };
                const typographyJsonString = JSON.stringify(typographyObj, null, 2);
                const typographyHighlighted = syntaxHighlight(typographyJsonString);

                const diffHtml = generateJsonDiffFromHighlighted(
                  typographyJsonString,
                  typographyJsonString,
                  typographyHighlighted,
                  typographyHighlighted
                );
                setHighlightedJson(diffHtml);
                setStyleState('original');
                return;
              } else if (parsed && parsed.states && parsed.states.default && parsed.states.default.layout && typeof parsed.states.default.layout === 'object') {
                // Show only the layout object for layout-related demo cards
                const layoutObj = { layout: parsed.states.default.layout };
                const layoutJsonString = JSON.stringify(layoutObj, null, 2);
                const layoutHighlighted = syntaxHighlight(layoutJsonString);

                const diffHtml = generateJsonDiffFromHighlighted(
                  layoutJsonString,
                  layoutJsonString,
                  layoutHighlighted,
                  layoutHighlighted
                );
                setHighlightedJson(diffHtml);
                setStyleState('original');
                return;
              }
            }
          }
        } catch (_) {}
      }
      
      // Apply syntax highlighting to each side, then run a line-wise diff that
      // preserves the token spans so CSS can color keys/strings/numbers.
      const originalHighlighted = syntaxHighlight(originalJsonString);
      const updatedHighlighted = syntaxHighlight(updatedJsonString);
      const diffHtml = generateJsonDiffFromHighlighted(
        originalJsonString,
        updatedJsonString,
        originalHighlighted,
        updatedHighlighted
      );
      setHighlightedJson(diffHtml);
      setStyleState('updated');
    } catch (e) {
      setHighlightedJson(syntaxHighlight(`Error parsing inspector edits: ${e.message}`));
    }
  };

  // Update edits JSON when component mounts and listen for changes
  useEffect(() => {
    // Load baseline data for this element on mount/remount
    const loadBaselineAndEdits = async () => {
      try {
        // Ensure baselines are populated before trying to read them
        if (populateBaselinesFromComputedStyles) {
          populateBaselinesFromComputedStyles();
          // Give it a moment to populate DOM attributes before loading edits
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Now load the edits (which will use the populated baseline)
        getElementEdits();
      } catch (_) {
        getElementEdits();
      }
    };
    
    loadBaselineAndEdits();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        getElementEdits();
      }
    };

    // Listen for custom events that might be dispatched by the inspector
    const handleInspectorEdit = () => {
      getElementEdits();
    };

    // Listen for specific fill update events from the Situ plugin
    const handleInspectorFillsUpdated = (e) => {
      if (e.detail && e.detail.elementId === elementId) {
        getElementEdits();
      }
    };

    // Listen for focus events to catch changes made in the same tab
    const handleFocus = () => {
      getElementEdits();
    };

    // Set up polling for real-time detection (fallback)
    const pollInterval = setInterval(getElementEdits, 100); // Check every 100ms

    // Listen for various events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('inspectorFillsUpdated', handleInspectorFillsUpdated);
    // React to unified element edits (fills or appearance)
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleInspectorEdit); // Also check on clicks
    window.addEventListener('keydown', handleInspectorEdit); // Check on key presses

    return () => {
      // Cleanup
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('inspectorFillsUpdated', handleInspectorFillsUpdated);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, [elementId]);

  return (
    <div className="json-container">
      <pre
        className="json-content"
        style={{ padding: 0 }}
        dangerouslySetInnerHTML={{ __html: highlightedJson }}
      />
    </div>
  );
}

// Legacy component to display inspector edits JSON for the solid color block
function SolidColorBlockEdits() {
  return <ElementEditsViewer elementId="demo-color-block-primary" />;
}

// Component to display inspector edits JSON for the linear gradient block
function LinearGradientBlockEdits() {
  return <ElementEditsViewer elementId="demo-gradient-block-linear" />;
}

// Component to display inspector edits JSON for the radial gradient block
function RadialGradientBlockEdits() {
  return <ElementEditsViewer elementId="demo-gradient-block-radial" />;
}

// Component to display inspector edits JSON for the conic gradient block
function ConicGradientBlockEdits() {
  return <ElementEditsViewer elementId="demo-gradient-block-conic" />;
}

// Unified component to display inspector edits with tabs
const ElementEditViewerWrapper = ({ elementId }) => {
  return (
    <ElementEditViewer 
      elementId={elementId} 
      ElementEditsViewer={ElementEditsViewer}
      ElementMcpViewer={ElementMcpViewer}
    />
  );
};

// MCP operations viewer for an element
function ElementMcpViewer({ elementId }) {
  const [highlightedJson, setHighlightedJson] = useState('');

  // Syntax highlighting function for JSON (same as ElementEditsViewer)
  const syntaxHighlight = (json) => {
    if (!json) return "";

    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  };

  const fetchFromMcpServer = async () => {
    try {
      // Fetch all edits from the server
      const response = await fetch('http://127.0.0.1:7124/edits');
      if (response.ok) {
        const envelope = await response.json();
        // Filter edits to only include the specific element
        const filteredEdits = envelope.edits.filter(edit =>
          edit.locator && edit.locator.elementId === elementId
        );
        const filteredEnvelope = {
          ...envelope,
          edits: filteredEdits
        };
        setHighlightedJson(syntaxHighlight(JSON.stringify(filteredEnvelope, null, 2)));
      } else {
        setHighlightedJson(syntaxHighlight('{"error": "Failed to fetch from MCP server"}'));
      }
    } catch (error) {
      console.warn('Failed to fetch from MCP server:', error);
      setHighlightedJson(syntaxHighlight('{"error": "MCP server not available"}'));
    }
  };

  useEffect(() => {
    const refresh = () => {
      fetchFromMcpServer();
    };

    // Initial load
    refresh();

    // Listeners for realtime updates
    const handleStorage = (e) => { if (e.key === 'situ-edits') refresh(); };
    const handleInspectorEdit = () => refresh();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('inspectorFillsUpdated', handleInspectorEdit);
    window.addEventListener('focus', handleInspectorEdit);
    window.addEventListener('click', handleInspectorEdit);
    window.addEventListener('keydown', handleInspectorEdit);
    const poll = setInterval(refresh, 1000); // Less frequent polling for server calls

    return () => {
      clearInterval(poll);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('inspectorFillsUpdated', handleInspectorEdit);
      window.removeEventListener('focus', handleInspectorEdit);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, [elementId]);
  return (
    <pre
      className="json-content"
      dangerouslySetInnerHTML={{ __html: highlightedJson }}
    />
  );
}

// Fills Component
function Fills() {
  // Generate stable IDs for the color and gradient blocks
  const colorBlockId = 'demo-color-block-primary';
  const linearGradientBlockId = 'demo-gradient-block-linear';
  const radialGradientBlockId = 'demo-gradient-block-radial';
  const conicGradientBlockId = 'demo-gradient-block-conic';
  
  // State to track style state for the color block (syncs with badge logic)
  const [styleState, setStyleState] = useState('original');
  
  // State to track style state for gradient blocks (syncs with badge logic)
  const [linearStyleState, setLinearStyleState] = useState('original');
  const [radialStyleState, setRadialStyleState] = useState('original');
  const [conicStyleState, setConicStyleState] = useState('original');

  // Function to compute style state ('original' or 'updated') for an element
  const computeStyleState = (elementId) => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) return 'original';
      
      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) return 'original';
      
      // Look for element edit with fill section or legacy fill edit with matching elementId
      const fillsEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.elementId === elementId &&
        edit.updated && (
          (edit.type === 'element' && (
            (edit.updated.states?.default?.fill && Array.isArray(edit.updated.states.default.fill))
          )) ||
          (edit.type === 'fill' && Array.isArray(edit.updated))
        )
      );
      return fillsEdit ? 'updated' : 'original';
    } catch (e) {
      console.warn('Failed to check fill changes:', e);
      return 'original';
    }
  };

  // Back-compat: legacy callers expect a boolean checkFillChanges
  // Use the new computeStyleState under the hood
  const checkFillChanges = (elementId) => computeStyleState(elementId) === 'updated';

  // Effect to compute style state on mount and listen for storage changes
  useEffect(() => {
    // Check initial state
    setStyleState(computeStyleState(colorBlockId));

    // Function to update state
    const updateStyleState = () => {
      setStyleState(computeStyleState(colorBlockId));
    };

    // Listen for storage changes (when inspector edits are made in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        updateStyleState();
      }
    };

    // Listen for custom events that might be dispatched by the inspector
    const handleInspectorEdit = () => {
      updateStyleState();
    };

    // Listen for specific fill update events from the Situ plugin
    const handleInspectorFillsUpdated = (e) => {
      // Check if this event is for our color block
      if (e.detail && e.detail.elementId === colorBlockId) {
        updateStyleState();
      }
    };

    // Listen for focus events to catch changes made in the same tab
    const handleFocus = () => {
      updateStyleState();
    };

    // Set up polling for real-time detection (fallback)
    const pollInterval = setInterval(updateStyleState, 500); // Check every 500ms

    // Set up MutationObserver to watch for DOM changes on the color block
    const colorBlockElement = document.querySelector(`[data-id="${colorBlockId}"]`);
    let mutationObserver = null;
    
    if (colorBlockElement) {
      mutationObserver = new MutationObserver((mutations) => {
        // Check if any style changes occurred
        const hasStyleChanges = mutations.some(mutation => 
          mutation.type === 'attributes' && 
          (mutation.attributeName === 'style' || mutation.attributeName === 'data-inspector-styled')
        );
        
        if (hasStyleChanges) {
          // Small delay to ensure localStorage is updated
          setTimeout(updateStyleState, 100);
        }
      });
      
      mutationObserver.observe(colorBlockElement, {
        attributes: true,
        attributeFilter: ['style', 'data-inspector-styled']
      });
    }

    // Listen for various events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('inspectorFillsUpdated', handleInspectorFillsUpdated);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleInspectorEdit); // Also check on clicks
    window.addEventListener('keydown', handleInspectorEdit); // Check on key presses
    window.addEventListener('blur', handleFocus); // Also check on blur
    window.addEventListener('click', handleInspectorEdit); // Check on any click
    window.addEventListener('keyup', handleInspectorEdit); // Check on key releases

    return () => {
      // Cleanup
      clearInterval(pollInterval);
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('inspectorFillsUpdated', handleInspectorFillsUpdated);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
      window.removeEventListener('blur', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keyup', handleInspectorEdit);
    };
  }, [colorBlockId]);

  // Effect to check for gradient style state on mount and listen for storage changes
  useEffect(() => {
    // Check initial state for all gradient blocks
    setLinearStyleState(computeStyleState(linearGradientBlockId));
    setRadialStyleState(computeStyleState(radialGradientBlockId));
    setConicStyleState(computeStyleState(conicGradientBlockId));

    // Function to update gradient state
    const updateGradientStyleState = () => {
      setLinearStyleState(computeStyleState(linearGradientBlockId));
      setRadialStyleState(computeStyleState(radialGradientBlockId));
      setConicStyleState(computeStyleState(conicGradientBlockId));
    };

    // Listen for storage changes (when inspector edits are made in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        updateGradientStyleState();
      }
    };

    // Listen for custom events that might be dispatched by the inspector
    const handleInspectorEdit = () => {
      updateGradientStyleState();
    };

    // Listen for specific fill update events from the Situ plugin
    const handleInspectorFillsUpdated = (e) => {
      // Check if this event is for any of our gradient blocks
      if (e.detail && (
        e.detail.elementId === linearGradientBlockId || 
        e.detail.elementId === radialGradientBlockId || 
        e.detail.elementId === conicGradientBlockId
      )) {
        updateGradientStyleState();
      }
    };

    // Listen for focus events to catch changes made in the same tab
    const handleFocus = () => {
      updateGradientStyleState();
    };

    // Set up polling for real-time detection (fallback)
    const pollInterval = setInterval(updateGradientStyleState, 500); // Check every 500ms

    // Set up MutationObserver to watch for DOM changes on all gradient blocks
    const gradientBlockElements = [
      document.querySelector(`[data-id="${linearGradientBlockId}"]`),
      document.querySelector(`[data-id="${radialGradientBlockId}"]`),
      document.querySelector(`[data-id="${conicGradientBlockId}"]`)
    ].filter(Boolean);
    
    let mutationObserver = null;
    
    if (gradientBlockElements.length > 0) {
      mutationObserver = new MutationObserver((mutations) => {
        // Check if any style changes occurred
        const hasStyleChanges = mutations.some(mutation => 
          mutation.type === 'attributes' && 
          (mutation.attributeName === 'style' || mutation.attributeName === 'data-inspector-styled')
        );
        
        if (hasStyleChanges) {
          // Small delay to ensure localStorage is updated
          setTimeout(updateGradientStyleState, 100);
        }
      });
      
      // Observe all gradient block elements
      gradientBlockElements.forEach(element => {
        mutationObserver.observe(element, {
          attributes: true,
          attributeFilter: ['style', 'data-inspector-styled']
        });
      });
    }

    // Listen for various events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('inspectorFillsUpdated', handleInspectorFillsUpdated);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleInspectorEdit); // Also check on clicks
    window.addEventListener('keydown', handleInspectorEdit); // Check on key presses
    window.addEventListener('blur', handleFocus); // Also check on blur
    window.addEventListener('click', handleInspectorEdit); // Check on any click
    window.addEventListener('keyup', handleInspectorEdit); // Check on key releases

    return () => {
      // Cleanup
      clearInterval(pollInterval);
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('inspectorFillsUpdated', handleInspectorFillsUpdated);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
      window.removeEventListener('blur', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keyup', handleInspectorEdit);
    };
  }, [linearGradientBlockId, radialGradientBlockId, conicGradientBlockId]);

  return (
    <div className="content-section">
      
      <BetaSection title="Open Beta">
        Situ is currently in open beta, you can sign up for free and start using Situ. We're actively working on improvements and stability and would love to hear your feedback. We don't recommend using the beta for any mission-critical projects. 
      </BetaSection>

      <div className="content-header">
        <h1>Fills</h1>
        <p>Edit colors and gradients directly in your dev environment. See real-time previews, keep them through reloads, and stage them to Cursor via MCP.</p>
      </div>

      <TipSection title="TRY IT OUT">
        Hold <kbd>Alt</kbd> and <kbd>Click</kbd> a block below to change the fill via the sidebar and see your changes reflected in real-time.
      </TipSection>

      {/* Color Section */}
      <div className="column">
        <DemoCard title="Solid Color" isUpdated={styleState === 'updated'}>
          <div className="color-blocks">
            <div 
              className="color-block primary" 
              data-id={colorBlockId}
              style={{backgroundColor: '#EF9108'}}
            >
              {styleState === 'updated' ? 'New solid color' : 'Default solid color'}
            </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-color-block-instructions">
          {styleState === 'updated' ? <p>Nice! Your change is now staged. Press <kbd>CMD + Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the block above to change its color.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={colorBlockId} />
      </div>

      <div className="content-header">
        <p>Situ supports all standard CSS gradients: linear, radial, and conic. Try inspecting and editing a gradient block below. Use the gradient picker to add/remove stops, and adjust their positions and opacities.</p>
      </div>

      {/* Linear Gradient Section */}
      <div className="column">
        <DemoCard title="Linear Gradient" isUpdated={linearStyleState === 'updated'}>
          <div className="color-blocks">
             <div 
               className="gradient-block linear-1" 
               data-id={linearGradientBlockId}
             >
             {linearStyleState === 'updated' ? 'Updated linear gradient!' : 'Default linear gradient'}
             </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-color-block-instructions">
          {linearStyleState === 'updated' ? <p>Great! Try navigating or refreshing, you'll see the changes are persisted. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the block above to change its gradient.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={linearGradientBlockId} />
      </div>

      <TipSection title="Review Your Edits">
        Made some edits? Open the sidebar and switch to the 'Edits' tab to see your updates listed. From here you can review, stage, or discard your changes.
      </TipSection>

      {/* Radial Gradient Section */}
      <div className="column">
        <DemoCard title="Radial Gradient" isUpdated={radialStyleState === 'updated'}>
          <div className="color-blocks">
             <div 
               className="gradient-block radial-1" 
               data-id={radialGradientBlockId}
             >
             {radialStyleState === 'updated' ? 'Updated radial gradient!' : 'Default radial gradient'}
             </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-color-block-instructions">
          {radialStyleState === 'updated' ? <p>Great! Try navigating or refreshing, you'll see the changes are persisted. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the block above to change its gradient.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={radialGradientBlockId} />
      </div>

      {/* Conic Gradient Section */}
      <div className="column">
        <DemoCard title="Conic Gradient" isUpdated={conicStyleState === 'updated'}>
          <div className="color-blocks">
             <div 
               className="gradient-block conic" 
               data-id={conicGradientBlockId}
             >
             {conicStyleState === 'updated' ? 'Updated conic gradient!' : 'Default conic gradient'}
             </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-color-block-instructions">
          {conicStyleState === 'updated' ? <p>Great! Try navigating or refreshing, you'll see the changes are persisted. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the block above to change its gradient.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={conicGradientBlockId} />
      </div>
      
    </div>
  )
}

// Component to display inspector edits JSON for headings
function HeadingTypographyEdits() {
  const [highlightedJson, setHighlightedJson] = useState('');

  // Syntax highlighting function for JSON
  const syntaxHighlight = (json) => {
    if (!json) return "";

    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  };

  // Function to get inspector edits JSON for headings
  const getHeadingTypographyEdits = () => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      // Find inputs edit for heading
      const headingEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.type === 'inputs' &&
        edit.elementId === 'demo-typography-heading' &&
        edit.updated
      );

      if (!headingEdit) {
        setHighlightedJson(syntaxHighlight('No edits found for heading'));
        return;
      }

      // Format the edit data for display
      const formattedEdit = {
        elementId: headingEdit.elementId,
        type: headingEdit.type,
        source: headingEdit.source,
        timestamp: new Date(headingEdit.timestamp).toLocaleString(),
        original: headingEdit.original,
        updated: headingEdit.updated
      };

      const jsonString = JSON.stringify(formattedEdit, null, 2);
      setHighlightedJson(syntaxHighlight(jsonString));
    } catch (e) {
      setHighlightedJson(syntaxHighlight(`Error parsing inspector edits: ${e.message}`));
    }
  };

  // Update edits JSON when component mounts and listen for changes
  useEffect(() => {
    getHeadingTypographyEdits();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        getHeadingTypographyEdits();
      }
    };

    // Listen for custom events that might be dispatched by the inspector
    const handleInspectorEdit = () => {
      getHeadingTypographyEdits();
    };

    // Listen for focus events to catch changes made in the same tab
    const handleFocus = () => {
      getHeadingTypographyEdits();
    };

    // Set up polling for real-time detection (fallback)
    const pollInterval = setInterval(getHeadingTypographyEdits, 100);

    // Listen for various events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleInspectorEdit);
    window.addEventListener('keydown', handleInspectorEdit);

    return () => {
      // Cleanup
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, []);

  return (
    <div className="json-container">
      <pre
        className="json-content"
        dangerouslySetInnerHTML={{ __html: highlightedJson }}
      />
    </div>
  );
}

// Component to display inspector edits JSON for body text
function BodyTypographyEdits() {
  const [highlightedJson, setHighlightedJson] = useState('');

  // Syntax highlighting function for JSON
  const syntaxHighlight = (json) => {
    if (!json) return "";

    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  };

  // Function to get inspector edits JSON for body text
  const getBodyTypographyEdits = () => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      // Find inputs edit for paragraph
      const bodyEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.type === 'inputs' &&
        edit.elementId === 'demo-typography-paragraph' &&
        edit.updated
      );

      if (!bodyEdit) {
        setHighlightedJson(syntaxHighlight('No edits found for body text'));
        return;
      }

      // Format the edit data for display
      const formattedEdit = {
        elementId: bodyEdit.elementId,
        type: bodyEdit.type,
        source: bodyEdit.source,
        original: bodyEdit.original,
        updated: bodyEdit.updated
      };

      const jsonString = JSON.stringify(formattedEdit, null, 2);
      setHighlightedJson(syntaxHighlight(jsonString));
    } catch (e) {
      setHighlightedJson(syntaxHighlight(`Error parsing inspector edits: ${e.message}`));
    }
  };

  // Update edits JSON when component mounts and listen for changes
  useEffect(() => {
    getBodyTypographyEdits();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        getBodyTypographyEdits();
      }
    };

    // Listen for custom events that might be dispatched by the inspector
    const handleInspectorEdit = () => {
      getBodyTypographyEdits();
    };

    // Listen for focus events to catch changes made in the same tab
    const handleFocus = () => {
      getBodyTypographyEdits();
    };

    // Set up polling for real-time detection (fallback)
    const pollInterval = setInterval(getBodyTypographyEdits, 100);

    // Listen for various events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleInspectorEdit);
    window.addEventListener('keydown', handleInspectorEdit);

    return () => {
      // Cleanup
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, []);

  return (
    <div className="json-container">
      <pre
        className="json-content"
        dangerouslySetInnerHTML={{ __html: highlightedJson }}
      />
    </div>
  );
}

// Component to display inspector edits JSON for unordered lists
function UnorderedListTypographyEdits() {
  const [highlightedJson, setHighlightedJson] = useState('');

  // Syntax highlighting function for JSON
  const syntaxHighlight = (json) => {
    if (!json) return "";

    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  };

  // Function to get inspector edits JSON for unordered lists
  const getUnorderedListTypographyEdits = () => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      // Find inputs edit for unordered list
      const unorderedListEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.type === 'inputs' &&
        edit.elementId === 'demo-typography-ul' &&
        edit.updated
      );

      if (!unorderedListEdit) {
        setHighlightedJson(syntaxHighlight('No edits found for unordered list'));
        return;
      }

      // Format the edit data for display
      const formattedEdit = {
        elementId: unorderedListEdit.elementId,
        type: unorderedListEdit.type,
        source: unorderedListEdit.source,
        original: unorderedListEdit.original,
        updated: unorderedListEdit.updated
      };

      const jsonString = JSON.stringify(formattedEdit, null, 2);
      setHighlightedJson(syntaxHighlight(jsonString));
    } catch (e) {
      setHighlightedJson(syntaxHighlight(`Error parsing inspector edits: ${e.message}`));
    }
  };

  // Update edits JSON when component mounts and listen for changes
  useEffect(() => {
    getUnorderedListTypographyEdits();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        getUnorderedListTypographyEdits();
      }
    };

    // Listen for custom events that might be dispatched by the inspector
    const handleInspectorEdit = () => {
      getUnorderedListTypographyEdits();
    };

    // Listen for focus events to catch changes made in the same tab
    const handleFocus = () => {
      getUnorderedListTypographyEdits();
    };

    // Set up polling for real-time detection (fallback)
    const pollInterval = setInterval(getUnorderedListTypographyEdits, 100);

    // Listen for various events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleInspectorEdit);
    window.addEventListener('keydown', handleInspectorEdit);

    return () => {
      // Cleanup
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, []);

  return (
    <div className="json-container">
      <pre
        className="json-content"
        dangerouslySetInnerHTML={{ __html: highlightedJson }}
      />
    </div>
  );
}

// Component to display inspector edits JSON for ordered lists
function OrderedListTypographyEdits() {
  const [highlightedJson, setHighlightedJson] = useState('');

  // Syntax highlighting function for JSON
  const syntaxHighlight = (json) => {
    if (!json) return "";

    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  };

  // Function to get inspector edits JSON for ordered lists
  const getOrderedListTypographyEdits = () => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      // Find inputs edit for ordered list
      const orderedListEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.type === 'inputs' &&
        edit.elementId === 'demo-typography-ol' &&
        edit.updated
      );

      if (!orderedListEdit) {
        setHighlightedJson(syntaxHighlight('No edits found for ordered list'));
        return;
      }

      // Format the edit data for display
      const formattedEdit = {
        elementId: orderedListEdit.elementId,
        type: orderedListEdit.type,
        source: orderedListEdit.source,
        original: orderedListEdit.original,
        updated: orderedListEdit.updated
      };

      const jsonString = JSON.stringify(formattedEdit, null, 2);
      setHighlightedJson(syntaxHighlight(jsonString));
    } catch (e) {
      setHighlightedJson(syntaxHighlight(`Error parsing inspector edits: ${e.message}`));
    }
  };

  // Update edits JSON when component mounts and listen for changes
  useEffect(() => {
    getOrderedListTypographyEdits();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        getOrderedListTypographyEdits();
      }
    };

    // Listen for custom events that might be dispatched by the inspector
    const handleInspectorEdit = () => {
      getOrderedListTypographyEdits();
    };

    // Listen for focus events to catch changes made in the same tab
    const handleFocus = () => {
      getOrderedListTypographyEdits();
    };

    // Set up polling for real-time detection (fallback)
    const pollInterval = setInterval(getOrderedListTypographyEdits, 100);

    // Listen for various events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleInspectorEdit);
    window.addEventListener('keydown', handleInspectorEdit);

    return () => {
      // Cleanup
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, []);

  return (
    <div className="json-container">
      <pre
        className="json-content"
        dangerouslySetInnerHTML={{ __html: highlightedJson }}
      />
    </div>
  );
}

// Component to display inspector edits JSON for quotes
function QuoteTypographyEdits() {
  const [highlightedJson, setHighlightedJson] = useState('');

  // Syntax highlighting function for JSON
  const syntaxHighlight = (json) => {
    if (!json) return "";

    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  };

  // Function to get inspector edits JSON for quotes
  const getQuoteTypographyEdits = () => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      // Find inputs edit for blockquote
      const quoteEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.type === 'inputs' &&
        edit.elementId === 'demo-typography-blockquote' &&
        edit.updated
      );

      if (!quoteEdit) {
        setHighlightedJson(syntaxHighlight('No edits found for quote'));
        return;
      }

      // Format the edit data for display
      const formattedEdit = {
        elementId: quoteEdit.elementId,
        type: quoteEdit.type,
        source: quoteEdit.source,
        original: quoteEdit.original,
        updated: quoteEdit.updated
      };

      const jsonString = JSON.stringify(formattedEdit, null, 2);
      setHighlightedJson(syntaxHighlight(jsonString));
    } catch (e) {
      setHighlightedJson(syntaxHighlight(`Error parsing inspector edits: ${e.message}`));
    }
  };

  // Update edits JSON when component mounts and listen for changes
  useEffect(() => {
    getQuoteTypographyEdits();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        getQuoteTypographyEdits();
      }
    };

    // Listen for custom events that might be dispatched by the inspector
    const handleInspectorEdit = () => {
      getQuoteTypographyEdits();
    };

    // Listen for focus events to catch changes made in the same tab
    const handleFocus = () => {
      getQuoteTypographyEdits();
    };

    // Set up polling for real-time detection (fallback)
    const pollInterval = setInterval(getQuoteTypographyEdits, 100);

    // Listen for various events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleInspectorEdit);
    window.addEventListener('keydown', handleInspectorEdit);

    return () => {
      // Cleanup
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, []);

  return (
    <div className="json-container">
      <pre
        className="json-content"
        dangerouslySetInnerHTML={{ __html: highlightedJson }}
      />
    </div>
  );
}

// Component to display inspector edits JSON for code
function CodeTypographyEdits() {
  const [highlightedJson, setHighlightedJson] = useState('');

  // Syntax highlighting function for JSON
  const syntaxHighlight = (json) => {
    if (!json) return "";

    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  };

  // Function to get inspector edits JSON for code
  const getCodeTypographyEdits = () => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      // Find inputs edit for code
      const codeEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.type === 'inputs' &&
        edit.elementId === 'demo-typography-code' &&
        edit.updated
      );

      if (!codeEdit) {
        setHighlightedJson(syntaxHighlight('No edits found for code'));
        return;
      }

      // Format the edit data for display
      const formattedEdit = {
        elementId: codeEdit.elementId,
        type: codeEdit.type,
        source: codeEdit.source,
        original: codeEdit.original,
        updated: codeEdit.updated
      };

      const jsonString = JSON.stringify(formattedEdit, null, 2);
      setHighlightedJson(syntaxHighlight(jsonString));
    } catch (e) {
      setHighlightedJson(syntaxHighlight(`Error parsing inspector edits: ${e.message}`));
    }
  };

  // Update edits JSON when component mounts and listen for changes
  useEffect(() => {
    getCodeTypographyEdits();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        getCodeTypographyEdits();
      }
    };

    // Listen for custom events that might be dispatched by the inspector
    const handleInspectorEdit = () => {
      getCodeTypographyEdits();
    };

    // Listen for focus events to catch changes made in the same tab
    const handleFocus = () => {
      getCodeTypographyEdits();
    };

    // Set up polling for real-time detection (fallback)
    const pollInterval = setInterval(getCodeTypographyEdits, 100);

    // Listen for various events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleInspectorEdit);
    window.addEventListener('keydown', handleInspectorEdit);

    return () => {
      // Cleanup
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, []);

  return (
    <div className="json-container">
      <pre
        className="json-content"
        dangerouslySetInnerHTML={{ __html: highlightedJson }}
      />
    </div>
  );
}

// Component to display inspector edits JSON for definition lists
function DefinitionTypographyEdits() {
  const [highlightedJson, setHighlightedJson] = useState('');

  // Syntax highlighting function for JSON
  const syntaxHighlight = (json) => {
    if (!json) return "";

    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  };

  // Function to get inspector edits JSON for definition lists
  const getDefinitionTypographyEdits = () => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      // Find inputs edit for definition list
      const definitionEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.type === 'inputs' &&
        edit.elementId === 'demo-typography-dl' &&
        edit.updated
      );

      if (!definitionEdit) {
        setHighlightedJson(syntaxHighlight('No edits found for definition list'));
        return;
      }

      // Format the edit data for display
      const formattedEdit = {
        elementId: definitionEdit.elementId,
        type: definitionEdit.type,
        source: definitionEdit.source,
        original: definitionEdit.original,
        updated: definitionEdit.updated
      };

      const jsonString = JSON.stringify(formattedEdit, null, 2);
      setHighlightedJson(syntaxHighlight(jsonString));
    } catch (e) {
      setHighlightedJson(syntaxHighlight(`Error parsing inspector edits: ${e.message}`));
    }
  };

  // Update edits JSON when component mounts and listen for changes
  useEffect(() => {
    getDefinitionTypographyEdits();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        getDefinitionTypographyEdits();
      }
    };

    // Listen for custom events that might be dispatched by the inspector
    const handleInspectorEdit = () => {
      getDefinitionTypographyEdits();
    };

    // Listen for focus events to catch changes made in the same tab
    const handleFocus = () => {
      getDefinitionTypographyEdits();
    };

    // Set up polling for real-time detection (fallback)
    const pollInterval = setInterval(getDefinitionTypographyEdits, 100);

    // Listen for various events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleInspectorEdit);
    window.addEventListener('keydown', handleInspectorEdit);

    return () => {
      // Cleanup
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, []);

  return (
    <div className="json-container">
      <pre
        className="json-content"
        dangerouslySetInnerHTML={{ __html: highlightedJson }}
      />
    </div>
  );
}

// Typography Component
function Typography() {
  // Generate stable IDs for typography examples
  const headingElementId = 'demo-typography-heading';
  const paragraphElementId = 'demo-typography-paragraph';
  const ulElementId = 'demo-typography-ul';
  const olElementId = 'demo-typography-ol';
  const codeElementId = 'demo-typography-code';
  const blockquoteElementId = 'demo-typography-blockquote';
  const dlElementId = 'demo-typography-dl';

  // State to track if the typography elements have changes
  const [hasHeadingChangesState, setHasHeadingChangesState] = useState(false);
  const [hasParagraphChangesState, setHasParagraphChangesState] = useState(false);
  const [hasUlChangesState, setHasUlChangesState] = useState(false);
  const [hasOlChangesState, setHasOlChangesState] = useState(false);
  const [hasCodeChangesState, setHasCodeChangesState] = useState(false);
  const [hasBlockquoteChangesState, setHasBlockquoteChangesState] = useState(false);
  const [hasDlChangesState, setHasDlChangesState] = useState(false);

  // Function to check if element has typography changes in localStorage
  const checkTypographyChanges = (elementId) => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) return false;

      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) return false;

      // Prefer unified element edits with nested typography
      const elementEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.type === 'element' &&
        edit.elementId === elementId &&
        edit.updated &&
        edit.updated.states &&
        Object.keys(edit.updated.states).some(stateName => {
          const st = edit.updated.states[stateName];
          return st && st.typography && typeof st.typography === 'object' && Object.keys(st.typography).length > 0;
        })
      );
      if (elementEdit) return true;

      // Fallback: legacy inputs edit
      const inputsEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.type === 'inputs' &&
        edit.elementId === elementId &&
        edit.updated
      );
      return !!inputsEdit;
    } catch (e) {
      console.warn('Failed to check typography changes:', e);
      return false;
    }
  };

  // Effect to check for typography changes on mount and listen for storage changes
  useEffect(() => {
    // Check initial state for all typography elements
    setHasHeadingChangesState(checkTypographyChanges(headingElementId));
    setHasParagraphChangesState(checkTypographyChanges(paragraphElementId));
    setHasUlChangesState(checkTypographyChanges(ulElementId));
    setHasOlChangesState(checkTypographyChanges(olElementId));
    setHasCodeChangesState(checkTypographyChanges(codeElementId));
    setHasBlockquoteChangesState(checkTypographyChanges(blockquoteElementId));
    setHasDlChangesState(checkTypographyChanges(dlElementId));

    // Function to update all typography state
    const updateAllTypographyChangesState = () => {
      setHasHeadingChangesState(checkTypographyChanges(headingElementId));
      setHasParagraphChangesState(checkTypographyChanges(paragraphElementId));
      setHasUlChangesState(checkTypographyChanges(ulElementId));
      setHasOlChangesState(checkTypographyChanges(olElementId));
      setHasCodeChangesState(checkTypographyChanges(codeElementId));
      setHasBlockquoteChangesState(checkTypographyChanges(blockquoteElementId));
      setHasDlChangesState(checkTypographyChanges(dlElementId));
    };

    // Listen for storage changes (when inspector edits are made in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        updateAllTypographyChangesState();
      }
    };

    // Listen for custom events that might be dispatched by the inspector
    const handleInspectorEdit = () => {
      updateAllTypographyChangesState();
    };

    // Listen for focus events to catch changes made in the same tab
    const handleFocus = () => {
      updateAllTypographyChangesState();
    };

    // Set up polling for real-time detection (fallback)
    const pollInterval = setInterval(updateAllTypographyChangesState, 100);

    // Listen for various events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleInspectorEdit);
    window.addEventListener('keydown', handleInspectorEdit);

    return () => {
      // Cleanup
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, [headingElementId, paragraphElementId, ulElementId, olElementId, codeElementId, blockquoteElementId, dlElementId]);

  return (
    <div className="content-section">

      <BetaSection title="Open Beta">
        Situ is currently in open beta, you can sign up for free and start using Situ. We're actively working on improvements and stability and would love to hear your feedback. We don't recommend using the beta for any mission-critical projects. 
      </BetaSection>

      <div className="content-header">
        <h1>Typography</h1>
        <p>Edit text styles, fonts, and sizing directly in your app. See real-time previews, keep them through reloads, and stage them to Cursor via MCP.</p>
      </div>

      <TipSection title="TRY IT OUT">
        Inspect any text element below to change its typography via the sidebar, and see the changes reflected in real-time. Hold <kbd>Alt</kbd> and <kbd>Click</kbd> text to edit it.
      </TipSection>

      {/* Headings Section */}
      <div className="column">
        <DemoCard showHeader={false} isUpdated={hasHeadingChangesState}>
          <h1 data-id={headingElementId}>
            {hasHeadingChangesState ? 'Stop typing design changes' : 'Stop typing design changes'}
          </h1>
        </DemoCard>
        <DemoInstructions dataId="demo-typography-instructions">
          <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the heading above to edit its typography properties.</p>
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={headingElementId} />
      </div>

      <WarningSection title="Gradient text">
        Gradient text is not supported yet. We're actively working on getting this feature ready for prime time. Keep an eye out for updates!
      </WarningSection>

      {/* Body Text Section */}
      <div className="column">
        <DemoCard showHeader={false} isUpdated={hasParagraphChangesState}>
          <p data-id={paragraphElementId}>
            {hasParagraphChangesState ? 'Updated paragraph with bold and italic text formatting.' : 'This is a paragraph with <strong>bold text</strong>, <em>italic text</em>, and regular body copy that demonstrates various text formatting options.'}
          </p>
        </DemoCard>
        <DemoInstructions dataId="demo-typography-instructions">
          <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the paragraph above to edit its typography properties.</p>
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={paragraphElementId} />
      </div>

      <TipSection title="Review Your Edits">
        Made some edits? Open the sidebar and switch to the 'Edits' tab to see your updates listed. From here you can review, stage, or discard your changes.
      </TipSection>

    </div>
  )
}

// Component to display inspector edits JSON for flexbox nested layout
function FlexboxNestedEdits() {
  const [highlightedJson, setHighlightedJson] = useState('');

  // Syntax highlighting function for JSON
  const syntaxHighlight = (json) => {
    if (!json) return "";

    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  };

  // Function to get inspector edits JSON for flexbox nested layout
  const getFlexboxNestedEdits = () => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      // Find inputs edit for flexbox nested container (same ID as row since it's the same container)
      const flexboxNestedEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.type === 'inputs' &&
        edit.elementId === 'demo-layout-flexbox' &&
        edit.updated
      );

      if (!flexboxNestedEdit) {
        setHighlightedJson(syntaxHighlight('No edits found for flexbox nested layout'));
        return;
      }

      // Format the edit data for display
      const formattedEdit = {
        elementId: flexboxNestedEdit.elementId,
        type: flexboxNestedEdit.type,
        source: flexboxNestedEdit.source,
        timestamp: new Date(flexboxNestedEdit.timestamp).toLocaleString(),
        original: flexboxNestedEdit.original,
        updated: flexboxNestedEdit.updated
      };

      const jsonString = JSON.stringify(formattedEdit, null, 2);
      setHighlightedJson(syntaxHighlight(jsonString));
    } catch (e) {
      setHighlightedJson(syntaxHighlight(`Error parsing inspector edits: ${e.message}`));
    }
  };

  // Update edits JSON when component mounts and listen for changes
  useEffect(() => {
    getFlexboxNestedEdits();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        getFlexboxNestedEdits();
      }
    };

    // Listen for custom events that might be dispatched by the inspector
    const handleInspectorEdit = () => {
      getFlexboxNestedEdits();
    };

    // Listen for focus events to catch changes made in the same tab
    const handleFocus = () => {
      getFlexboxNestedEdits();
    };

    // Set up polling for real-time detection (fallback)
    const pollInterval = setInterval(getFlexboxNestedEdits, 100);

    // Listen for various events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleInspectorEdit);
    window.addEventListener('keydown', handleInspectorEdit);

    return () => {
      // Cleanup
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, []);

  return (
    <div className="json-container">
      <pre
        className="json-content"
        dangerouslySetInnerHTML={{ __html: highlightedJson }}
      />
    </div>
  );
}

// Component to display inspector edits JSON for card layout
function CardLayoutEdits() {
  const [highlightedJson, setHighlightedJson] = useState('');

  // Syntax highlighting function for JSON
  const syntaxHighlight = (json) => {
    if (!json) return "";

    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  };

  // Function to get inspector edits JSON for card layout
  const getCardLayoutEdits = () => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) {
        setHighlightedJson(syntaxHighlight('No inspector edits found'));
        return;
      }

      // Find inputs edit for card container
      const cardEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.type === 'inputs' &&
        edit.elementId === 'demo-layout-cards' &&
        edit.updated
      );

      if (!cardEdit) {
        setHighlightedJson(syntaxHighlight('No edits found for card layout'));
        return;
      }

      // Format the edit data for display
      const formattedEdit = {
        elementId: cardEdit.elementId,
        type: cardEdit.type,
        source: cardEdit.source,
        timestamp: new Date(cardEdit.timestamp).toLocaleString(),
        original: cardEdit.original,
        updated: cardEdit.updated
      };

      const jsonString = JSON.stringify(formattedEdit, null, 2);
      setHighlightedJson(syntaxHighlight(jsonString));
    } catch (e) {
      setHighlightedJson(syntaxHighlight(`Error parsing inspector edits: ${e.message}`));
    }
  };

  // Update edits JSON when component mounts and listen for changes
  useEffect(() => {
    getCardLayoutEdits();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        getCardLayoutEdits();
      }
    };

    // Listen for custom events that might be dispatched by the inspector
    const handleInspectorEdit = () => {
      getCardLayoutEdits();
    };

    // Listen for focus events to catch changes made in the same tab
    const handleFocus = () => {
      getCardLayoutEdits();
    };

    // Set up polling for real-time detection (fallback)
    const pollInterval = setInterval(getCardLayoutEdits, 100);

    // Listen for various events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleInspectorEdit);
    window.addEventListener('keydown', handleInspectorEdit);

    return () => {
      // Cleanup
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, []);

  return (
    <div className="json-container">
      <pre
        className="json-content"
        dangerouslySetInnerHTML={{ __html: highlightedJson }}
      />
    </div>
  );
}

// Layout Component
function Layout() {
  // Generate stable IDs for layout examples
  const flexRowId = 'demo-layout-flexbox-row';
  const flexColumnId = 'demo-layout-flexbox-column';
  const flexSpaceId = 'demo-layout-flexbox-space';
  const flexCenterId = 'demo-layout-flexbox-center';
  const flexWrapId = 'demo-layout-flexbox-wrap';
  const flexNestedId = 'demo-layout-flexbox-nested';
  const flexContainerId = flexRowId; // Back-compat for existing code paths
  const cardContainerId = 'demo-layout-cards';

  // State to track if the layout elements have changes
  const [hasFlexChangesState, setHasFlexChangesState] = useState(false);
  const [hasCardChangesState, setHasCardChangesState] = useState(false);

  // Function to check if element has layout changes in localStorage
  const checkLayoutChanges = (elementId) => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) return false;

      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) return false;

      // Look for inputs edit with matching elementId
      const inputsEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.type === 'inputs' &&
        edit.elementId === elementId &&
        edit.updated
      );

      return !!inputsEdit;
    } catch (e) {
      console.warn('Failed to check layout changes:', e);
      return false;
    }
  };

  // Effect to check for layout changes on mount and listen for storage changes
  useEffect(() => {
    // Check initial state for all layout elements
    setHasFlexChangesState(checkLayoutChanges(flexContainerId));
    setHasCardChangesState(checkLayoutChanges(cardContainerId));

    // Function to update all layout state
    const updateAllLayoutChangesState = () => {
      setHasFlexChangesState(checkLayoutChanges(flexContainerId));
      setHasCardChangesState(checkLayoutChanges(cardContainerId));
    };

    // Listen for storage changes (when inspector edits are made in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        updateAllLayoutChangesState();
      }
    };

    // Listen for custom events that might be dispatched by the inspector
    const handleInspectorEdit = () => {
      updateAllLayoutChangesState();
    };

    // Listen for focus events to catch changes made in the same tab
    const handleFocus = () => {
      updateAllLayoutChangesState();
    };

    // Set up polling for real-time detection (fallback)
    const pollInterval = setInterval(updateAllLayoutChangesState, 100);

    // Listen for various events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleInspectorEdit);
    window.addEventListener('keydown', handleInspectorEdit);

    return () => {
      // Cleanup
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, [flexContainerId, cardContainerId]);

  return (
    <div className="content-section">

      <BetaSection title="Open Beta">
        Situ is currently in open beta, you can sign up for free and start using Situ. We're actively working on improvements and stability and would love to hear your feedback. We don't recommend using the beta for any mission-critical projects. 
      </BetaSection>

      <div className="content-header">
        <h1>Flexbox</h1>
        <p>Edit layout properties like flexbox, grid, and positioning directly in your app. See real-time previews, keep them through reloads, and stage them to Cursor via MCP.</p>
      </div>

      <TipSection title="TRY IT OUT">
        Inspect any layout container below to change its layout properties via the sidebar, and see the changes reflected in real-time. Hold <kbd>Alt</kbd> and <kbd>Click</kbd> containers to edit them.
      </TipSection>

      {/* Flexbox Row Direction Section */}
      <div className="column">
        <DemoCard title="Flex Row Direction">
          <div
            className="flex-demo row"
            data-id={flexRowId}
          >
            <div className="flex-item">Item 1</div>
            <div className="flex-item">Item 2</div>
            <div className="flex-item grow">Item 3 (flex-grow)</div>
            <div className="flex-item">Item 4</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-flexbox-row-instructions">
          <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the flexbox container above to edit row direction properties like justify-content, align-items, and flex-grow.</p>
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={flexRowId} />
      </div>

      <div className="content-header">
        <p>Flexbox provides powerful layout capabilities. Try different flex directions, alignment options, and wrapping behaviors.</p>
      </div>

      {/* Flexbox Column Direction Section */}
      <div className="column">
        <DemoCard title="Flex Column Direction">
          <div
            className="flex-demo column"
            data-id={flexColumnId}
          >
            <div className="flex-item">Item 1</div>
            <div className="flex-item grow">Item 2 (flex-grow)</div>
            <div className="flex-item">Item with longer content</div>
            <div className="flex-item">Item 4</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-flexbox-column-instructions">
          <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the flexbox container above to edit column direction properties like align-items and flex-direction.</p>
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={flexColumnId} />
      </div>

      <TipSection title="ALIGNMENT OPTIONS">
        Experiment with justify-content and align-items to see how flexbox handles different alignment scenarios.
      </TipSection>

      {/* Flexbox Space Between Section */}
      <div className="column">
        <DemoCard title="Flex Space Between">
          <div
            className="flex-demo space-between"
            data-id={flexSpaceId}
          >
            <div className="flex-item">Start</div>
            <div className="flex-item">Center</div>
            <div className="flex-item">End</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-flexbox-space-instructions">
          <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the flexbox container above to edit justify-content: space-between and alignment properties.</p>
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={flexSpaceId} />
      </div>

      <div className="content-header">
        <p>Advanced flexbox techniques like centering, wrapping, and nested layouts provide even more layout control.</p>
      </div>

      {/* Flexbox Center Section */}
      <div className="column">
        <DemoCard title="Flex Center">
          <div
            className="flex-demo center"
            data-id={flexCenterId}
          >
            <div className="flex-item">Centered</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-flexbox-center-instructions">
          <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the flexbox container above to edit justify-content and align-items centering properties.</p>
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={flexCenterId} />
      </div>

      {/* Flexbox Wrap Section */}
      <div className="column">
        <DemoCard title="Flex Wrap">
          <div
            className="flex-demo wrap"
            data-id={flexWrapId}
          >
            <div className="flex-item">Item 1</div>
            <div className="flex-item">Item 2</div>
            <div className="flex-item">Item 3</div>
            <div className="flex-item">Item 4</div>
            <div className="flex-item">Item 5</div>
            <div className="flex-item">Item 6</div>
            <div className="flex-item">Item 7</div>
            <div className="flex-item">Item 8</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-flexbox-wrap-instructions">
          <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the flexbox container above to edit flex-wrap and multi-line layout properties.</p>
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={flexWrapId} />
      </div>

      {/* Flexbox Nested Section */}
      <div className="column">
        <DemoCard title="Flexbox Nested">
          <div
            className="flex-demo nested"
            data-id={flexNestedId}
          >
            <div className="flex-item nested-parent">
              <span>Parent</span>
              <div className="nested-flex">
                <div className="nested-item">Child 1</div>
                <div className="nested-item">Child 2</div>
              </div>
            </div>
            <div className="flex-item">Regular Item</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-flexbox-nested-instructions">
          <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the flexbox container above to edit nested flexbox layout properties and parent-child relationships.</p>
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={flexNestedId} />
      </div>

      {/* Card Layout Section */}
      <div className="column">
        <DemoCard title="Card Layout" isUpdated={hasCardChangesState}>
          <div className="card-layout" data-id={cardContainerId}>
            <div className="card">
              <h5>Card Title</h5>
              <p>This is a card component with some content.</p>
              <button className="card-button">Action</button>
            </div>
            <div className="card">
              <h5>Another Card</h5>
              <p>Cards are great for organizing content.</p>
              <button className="card-button">Action</button>
            </div>
            <div className="card">
              <h5>Third Card</h5>
              <p>Each card can have different content.</p>
              <button className="card-button">Action</button>
            </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-layout-instructions">
          <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the card container above to edit its layout properties like display, gap, and flex-wrap.</p>
        </DemoInstructions>
        <ElementEditViewerWrapper elementId="demo-layout-cards" />
      </div>

      <TipSection title="Review Your Edits">
        Made some edits? Open the sidebar and switch to the 'Edits' tab to see your updates listed. From here you can review, stage, or discard your changes.
      </TipSection>

    </div>
  )
}

// Shadows Component
function Shadows() {
  return (
    <div className="content-section">

      <TipSection title="coming soon">
        Shadow editing is coming soon. We're actively working on getting this feature ready for prime time. Keep an eye out for updates!
      </TipSection>
    </div>
  )
}

// Component to display inspector edits JSON for the solid border block
function SolidBorderBlockEdits() {
  return <ElementEditsViewer elementId="demo-border-block-solid" />;
}

// Component to display inspector edits JSON for the dashed border block
function DashedBorderBlockEdits() {
  return <ElementEditsViewer elementId="demo-border-block-dashed" />;
}

// Component to display inspector edits JSON for the dotted border block
function DottedBorderBlockEdits() {
  return <ElementEditsViewer elementId="demo-border-block-dotted" />;
}

// Component to display inspector edits JSON for the double border block
function DoubleBorderBlockEdits() {
  return <ElementEditsViewer elementId="demo-border-block-double" />;
}

// Component to display inspector edits JSON for the thick border block
function ThickBorderBlockEdits() {
  return <ElementEditsViewer elementId="demo-border-block-thick" />;
}

// Component to display inspector edits JSON for the rounded border block
function RoundedBorderBlockEdits() {
  return <ElementEditsViewer elementId="demo-border-block-rounded" />;
}

// Borders Component
function Borders() {
  // Generate stable IDs for the border blocks
  const solidBorderBlockId = 'demo-border-block-solid';
  const dashedBorderBlockId = 'demo-border-block-dashed';
  const dottedBorderBlockId = 'demo-border-block-dotted';
  const doubleBorderBlockId = 'demo-border-block-double';
  const thickBorderBlockId = 'demo-border-block-thick';
  const roundedBorderBlockId = 'demo-border-block-rounded';

  // State to track if the border blocks have border changes
  const [hasSolidBorderChangesState, setHasSolidBorderChangesState] = useState(false);
  const [hasDashedBorderChangesState, setHasDashedBorderChangesState] = useState(false);
  const [hasDottedBorderChangesState, setHasDottedBorderChangesState] = useState(false);
  const [hasDoubleBorderChangesState, setHasDoubleBorderChangesState] = useState(false);
  const [hasThickBorderChangesState, setHasThickBorderChangesState] = useState(false);
  const [hasRoundedBorderChangesState, setHasRoundedBorderChangesState] = useState(false);

  // Function to check if element has border changes in localStorage
  const checkBorderChanges = (elementId) => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) return false;

      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) return false;

      // Look for border edit with matching elementId (both legacy and unified formats)
      const borderEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.elementId === elementId &&
        edit.updated && (
          (edit.type === 'border' && edit.updated) ||
          (edit.type === 'element' && (
            (edit.updated.states && typeof edit.updated.states === 'object' && Object.keys(edit.updated.states).some(stateName =>
              edit.updated.states[stateName]?.border && typeof edit.updated.states[stateName].border === 'object'
            ))
          ))
        )
      );

      return !!borderEdit;
    } catch (e) {
      console.warn('Failed to check border changes:', e);
      return false;
    }
  };

  // Effect to check for border changes on mount and listen for storage changes
  useEffect(() => {
    // Check initial state for all border blocks
    setHasSolidBorderChangesState(checkBorderChanges(solidBorderBlockId));
    setHasDashedBorderChangesState(checkBorderChanges(dashedBorderBlockId));
    setHasDottedBorderChangesState(checkBorderChanges(dottedBorderBlockId));
    setHasDoubleBorderChangesState(checkBorderChanges(doubleBorderBlockId));
    setHasThickBorderChangesState(checkBorderChanges(thickBorderBlockId));
    setHasRoundedBorderChangesState(checkBorderChanges(roundedBorderBlockId));

    // Function to update all border state
    const updateAllBorderChangesState = () => {
      setHasSolidBorderChangesState(checkBorderChanges(solidBorderBlockId));
      setHasDashedBorderChangesState(checkBorderChanges(dashedBorderBlockId));
      setHasDottedBorderChangesState(checkBorderChanges(dottedBorderBlockId));
      setHasDoubleBorderChangesState(checkBorderChanges(doubleBorderBlockId));
      setHasThickBorderChangesState(checkBorderChanges(thickBorderBlockId));
      setHasRoundedBorderChangesState(checkBorderChanges(roundedBorderBlockId));
    };

    // Listen for storage changes (when inspector edits are made in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        updateAllBorderChangesState();
      }
    };

    // Listen for custom events that might be dispatched by the inspector
    const handleInspectorEdit = () => {
      updateAllBorderChangesState();
    };

    // Listen for focus events to catch changes made in the same tab
    const handleFocus = () => {
      updateAllBorderChangesState();
    };

    // Set up polling for real-time detection (fallback)
    const pollInterval = setInterval(updateAllBorderChangesState, 100); // Check every 100ms

    // Listen for various events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleInspectorEdit);
    window.addEventListener('keydown', handleInspectorEdit);

    return () => {
      // Cleanup
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, [solidBorderBlockId, dashedBorderBlockId, dottedBorderBlockId, doubleBorderBlockId, thickBorderBlockId, roundedBorderBlockId]);

  return (
    <div className="content-section">

      <BetaSection title="Open Beta">
        Situ is currently in open beta, you can sign up for free and start using Situ. We're actively working on improvements and stability and would love to hear your feedback. We don't recommend using the beta for any mission-critical projects. 
      </BetaSection>

      <div className="content-header">
        <h1>Borders</h1>
        <p>Edit border styles, widths, and colors directly in your app. See real-time previews, keep them through reloads, and stage them to Cursor via MCP.</p>
      </div>

      <TipSection title="TRY IT OUT">
        Inspect each of the blocks below to change their borders via the sidebar, and see the changes reflected in real-time. Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the blocks to edit them.
      </TipSection>

      {/* Solid Border Section */}
      <div className="column">
        <DemoCard title="Solid Border" isUpdated={hasSolidBorderChangesState}>
          <div className="border-blocks">
            <div
              className="border-block solid"
              data-id={solidBorderBlockId}
            >
              {hasSolidBorderChangesState ? 'Updated solid border' : 'Default solid border'}
            </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-border-block-instructions">
          {hasSolidBorderChangesState ? <p>Nice! Your change is now staged. Press <kbd>CMD + Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the block above to change its border.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={solidBorderBlockId} />
      </div>

      <div className="content-header">
        <p>Situ supports all standard CSS border styles: solid, dashed, dotted, double, and more. Try inspecting and editing a border block below. Use the border picker to adjust width, style, color, and radius.</p>
      </div>

      {/* Dashed Border Section */}
      <div className="column">
        <DemoCard title="Dashed Border" isUpdated={hasDashedBorderChangesState}>
          <div className="border-blocks">
             <div
               className="border-block dashed"
               data-id={dashedBorderBlockId}
             >
               {hasDashedBorderChangesState ? 'Updated dashed border!' : 'Default dashed border'}
             </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-border-block-instructions">
          {hasDashedBorderChangesState ? <p>Great! Try navigating or refreshing, you'll see the changes are persisted. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the block above to change its border.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={dashedBorderBlockId} />
      </div>

      <TipSection title="Review Your Edits">
        Made some edits? Open the sidebar and switch to the 'Edits' tab to see your updates listed. From here you can review, stage, or discard your changes.
      </TipSection>

      {/* Dotted Border Section */}
      <div className="column">
        <DemoCard title="Dotted Border" isUpdated={hasDottedBorderChangesState}>
          <div className="border-blocks">
             <div
               className="border-block dotted"
               data-id={dottedBorderBlockId}
             >
               {hasDottedBorderChangesState ? 'Updated dotted border!' : 'Default dotted border'}
             </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-border-block-instructions">
          {hasDottedBorderChangesState ? <p>Great! Try navigating or refreshing, you'll see the changes are persisted. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the block above to change its border.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={dottedBorderBlockId} />
      </div>

      {/* Double Border Section */}
      <div className="column">
        <DemoCard title="Double Border" isUpdated={hasDoubleBorderChangesState}>
          <div className="border-blocks">
             <div
               className="border-block double"
               data-id={doubleBorderBlockId}
             >
               {hasDoubleBorderChangesState ? 'Updated double border!' : 'Default double border'}
             </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-border-block-instructions">
          {hasDoubleBorderChangesState ? <p>Great! Try navigating or refreshing, you'll see the changes are persisted. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the block above to change its border.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={doubleBorderBlockId} />
      </div>

      {/* Thick Border Section */}
      <div className="column">
        <DemoCard title="Thick Border" isUpdated={hasThickBorderChangesState}>
          <div className="border-blocks">
             <div
               className="border-block thick"
               data-id={thickBorderBlockId}
             >
               {hasThickBorderChangesState ? 'Updated thick border!' : 'Default thick border'}
             </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-border-block-instructions">
          {hasThickBorderChangesState ? <p>Great! Try navigating or refreshing, you'll see the changes are persisted. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the block above to change its border.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={thickBorderBlockId} />
      </div>

      {/* Rounded Border Section */}
      <div className="column">
        <DemoCard title="Rounded Border" isUpdated={hasRoundedBorderChangesState}>
          <div className="border-blocks">
             <div
               className="border-block rounded"
               data-id={roundedBorderBlockId}
             >
               {hasRoundedBorderChangesState ? 'Updated rounded border!' : 'Default rounded border'}
             </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-border-block-instructions">
          {hasRoundedBorderChangesState ? <p>Great! Try navigating or refreshing, you'll see the changes are persisted. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the block above to change its border.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={roundedBorderBlockId} />
      </div>

    </div>
  )
}

// Basic Elements Component (keeping for backward compatibility)
function BasicElements() {
  const [count, setCount] = useState(0)
  const [isChecked, setIsChecked] = useState(false)
  const [radioValue, setRadioValue] = useState('option1')
  const [rangeValue, setRangeValue] = useState(50)

  return (
    <div className="content-section">
      <div className="content-header">
        <h1>Basic Elements</h1>
        <p>Interactive demonstration of basic HTML elements with Situ Design inspector. Hold <kbd>Alt</kbd> and hover over elements to see the inspector in action!</p>
      </div>

      {/* Color Blocks Section */}
      <DemoCard showHeader={false}>
        <h3>Color Blocks</h3>
        <p>Solid color blocks to test color inspection and editing capabilities.</p>
        <div className="color-blocks">
          <div className="color-block primary">Primary</div>
          <div className="color-block secondary">Secondary</div>
          <div className="color-block accent">Accent</div>
          <div className="color-block success">Success</div>
          <div className="color-block warning">Warning</div>
          <div className="color-block error">Error</div>
          <div className="color-block info">Info</div>
          <div className="color-block neutral">Neutral</div>
        </div>
      </DemoCard>

      {/* Gradient Blocks Section */}
      <DemoCard showHeader={false}>
        <h3>Gradient Blocks</h3>
        <p>Linear and radial gradients for testing gradient inspection and editing.</p>
        <div className="gradient-blocks">
          <div className="gradient-block linear-1">Linear Gradient 1</div>
          <div className="gradient-block linear-2">Linear Gradient 2</div>
          <div className="gradient-block linear-3">Linear Gradient 3</div>
          <div className="gradient-block radial-1">Radial Gradient 1</div>
          <div className="gradient-block radial-2">Radial Gradient 2</div>
          <div className="gradient-block conic">Conic Gradient</div>
        </div>
      </DemoCard>

      {/* Shadow Blocks Section */}
      <DemoCard showHeader={false}>
        <h3>Shadow Blocks</h3>
        <p>Elements with different shadow effects for testing shadow inspection.</p>
        <div className="shadow-blocks">
          <div className="shadow-block small">Small Shadow</div>
          <div className="shadow-block medium">Medium Shadow</div>
          <div className="shadow-block large">Large Shadow</div>
          <div className="shadow-block colored">Colored Shadow</div>
          <div className="shadow-block multiple">Multiple Shadows</div>
          <div className="shadow-block inset">Inset Shadow</div>
        </div>
      </DemoCard>

      {/* Border Blocks Section */}
      <DemoCard showHeader={false}>
        <h3>Border Blocks</h3>
        <p>Elements with different border styles for testing border inspection.</p>
        <div className="border-blocks">
          <div className="border-block solid">Solid Border</div>
          <div className="border-block dashed">Dashed Border</div>
          <div className="border-block dotted">Dotted Border</div>
          <div className="border-block double">Double Border</div>
          <div className="border-block thick">Thick Border</div>
          <div className="border-block rounded">Rounded Border</div>
        </div>
      </DemoCard>

      {/* Typography Blocks Section */}
      <DemoCard showHeader={false}>
        <h3>Typography Blocks</h3>
        <p>Text elements with different font properties for testing typography inspection.</p>
        <div className="typography-blocks">
          <div className="typography-block heading-1">Heading 1 - Large Bold</div>
          <div className="typography-block heading-2">Heading 2 - Medium Bold</div>
          <div className="typography-block body">Body text - Regular weight</div>
          <div className="typography-block caption">Caption - Small text</div>
          <div className="typography-block code">Code - Monospace font</div>
          <div className="typography-block italic">Italic text style</div>
        </div>
      </DemoCard>

      {/* Text Elements */}
      <DemoCard showHeader={false}>
        <h3>Text Elements</h3>
        <p>Double-click any text element while holding Alt to edit it inline!</p>
        
        <div className="text-examples">
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <h5>Heading 5</h5>
          <h6>Heading 6</h6>
          
          <p>This is a paragraph with <strong>bold text</strong>, <em>italic text</em>, and <span>inline span</span> elements.</p>
          
          <blockquote>
            This is a blockquote element. It's used for longer quotations and typically has different styling.
          </blockquote>
          
          <code>This is inline code</code>
          
          <pre><code>{`// This is a code block
function example() {
  return "Hello World";
}`}</code></pre>
          
          <ul>
            <li>Unordered list item 1</li>
            <li>Unordered list item 2</li>
            <li>Unordered list item 3</li>
          </ul>
          
          <ol>
            <li>Ordered list item 1</li>
            <li>Ordered list item 2</li>
            <li>Ordered list item 3</li>
          </ol>
          
          <dl>
            <dt>Definition Term</dt>
            <dd>Definition description</dd>
            <dt>Another Term</dt>
            <dd>Another description</dd>
          </dl>
        </div>
      </DemoCard>

      {/* Media Elements */}
      <DemoCard showHeader={false}>
        <h3>Media Elements</h3>
        <div className="media-examples">
          <div className="media-group">
            <h4>Images</h4>
            <div className="image-gallery">
              <img src="https://via.placeholder.com/150x100/333/fff?text=Image+1" alt="Placeholder 1" />
              <img src="https://via.placeholder.com/150x100/666/fff?text=Image+2" alt="Placeholder 2" />
              <img src="https://via.placeholder.com/150x100/999/fff?text=Image+3" alt="Placeholder 3" />
            </div>
          </div>
          
          <div className="media-group">
            <h4>Video</h4>
            <video width="300" height="200" controls>
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="media-group">
            <h4>Audio</h4>
            <audio controls>
              <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </DemoCard>

      {/* Layout Examples */}
      <DemoCard showHeader={false}>
        <h3>Layout Examples</h3>
        <div className="layout-examples">
          <div className="example-section">
            <h4>Flexbox Layout</h4>
            <div className="flex-demo">
              <div className="flex-item">Flex Item 1</div>
              <div className="flex-item">Flex Item 2</div>
              <div className="flex-item">Flex Item 3</div>
              <div className="flex-item">Flex Item 4</div>
            </div>
          </div>

          <div className="example-section">
            <h4>Grid Layout</h4>
            <div className="grid-demo">
              <div className="grid-item">Grid Item 1</div>
              <div className="grid-item">Grid Item 2</div>
              <div className="grid-item">Grid Item 3</div>
              <div className="grid-item">Grid Item 4</div>
              <div className="grid-item">Grid Item 5</div>
              <div className="grid-item">Grid Item 6</div>
            </div>
          </div>

          <div className="example-section">
            <h4>Card Layout</h4>
            <div className="card-layout">
              <div className="card">
                <h5>Card Title</h5>
                <p>This is a card component with some content.</p>
                <button className="card-button">Action</button>
              </div>
              <div className="card">
                <h5>Another Card</h5>
                <p>Cards are great for organizing content.</p>
                <button className="card-button">Action</button>
              </div>
              <div className="card">
                <h5>Third Card</h5>
                <p>Each card can have different content.</p>
                <button className="card-button">Action</button>
              </div>
            </div>
          </div>
        </div>
      </DemoCard>

      {/* Semantic Elements */}
      <DemoCard showHeader={false}>
        <h3>Semantic Elements</h3>
        <div className="semantic-examples">
          <article>
            <header>
              <h4>Article Header</h4>
              <time>2024-01-15</time>
            </header>
            <section>
              <p>This is an article element containing independent, self-contained content.</p>
            </section>
            <footer>
              <small>Article footer with metadata</small>
            </footer>
          </article>
          
          <aside>
            <h4>Sidebar Content</h4>
            <p>This is an aside element for tangential content.</p>
          </aside>
          
          <details>
            <summary>Click to expand</summary>
            <p>This is a details element with collapsible content.</p>
          </details>
        </div>
      </DemoCard>
    </div>
  )
}


function App() {
  // Initialize situ-history and situ-edits in localStorage if they don't exist
  useEffect(() => {
    if (!localStorage.getItem('situ-history')) {
      localStorage.setItem('situ-history', JSON.stringify([]));
    }
    if (!localStorage.getItem('situ-edits')) {
      localStorage.setItem('situ-edits', JSON.stringify({ editsArray: [] }));
    }
  }, []);

  return (
          <div className="app">
            {/* Header */}
            <MainHeader />

            <div className="app-body">
              <div className="content-container">
                <Navigation />
                <main className="main-content">
                  <ScrollArea.Root className="scroll-area">
                    <ScrollArea.Viewport className="scroll-viewport">
                      <ScrollArea.Content className="scroll-content">
                        <Routes>
                          {/* Situ Routes */}
                          <Route path="/overview/get-started" element={<GetStartedPage />} />
                          <Route path="/overview/releases" element={<ReleasesPage />} />
                          <Route path="/overview/about" element={<About />} />
                          <Route path="/overview/quick-start" element={<About />} />
                          <Route path="/overview/installation" element={<About />} />
                          <Route path="/overview/configuration" element={<About />} />
                          <Route path="/overview/api-reference" element={<About />} />
                          
                          {/* Style Routes */}
                          <Route path="/overview/states" element={<StatesPage />} />
                          <Route path="/overview/fills" element={<Fills />} />
                          <Route path="/overview/borders" element={<Borders />} />
                          <Route path="/overview/typography" element={<Typography />} />
                          
                          {/* Layout Routes */}
                          <Route path="/overview/flexbox" element={<Layout />} />
                          <Route path="/overview/grid" element={<GridPage />} />
                          <Route path="/overview/spacing" element={<SpacingPage />} />
                          <Route path="/overview/size" element={<SizePage />} />
                          <Route path="/overview/position" element={<PositionPage />} />
                          <Route path="/overview/z-index" element={<ZIndexPage />} />
                          <Route path="/overview/overflow" element={<OverflowPage />} />
                          <Route path="/overview/transform" element={<TransformPage />} />
                          
                          {/* Inspect Routes */}
                          <Route path="/overview/code" element={<CodePage />} />
                          <Route path="/overview/selection" element={<SelectionPage />} />
                          <Route path="/overview/distance" element={<DistancePage />} />
                          
                          {/* Effects Routes */}
                          <Route path="/overview/shadows" element={<Shadows />} />
                          <Route path="/overview/blur" element={<BlurPage />} />
                          <Route path="/overview/transition" element={<TransitionPage />} />
                          <Route path="/overview/animation" element={<AnimationPage />} />
                          
                          {/* Advanced Routes */}
                          <Route path="/overview/real-time-editing" element={<About />} />
                          <Route path="/overview/multi-selection" element={<About />} />
                          <Route path="/overview/keyboard-shortcuts" element={<About />} />
                          <Route path="/overview/customization" element={<About />} />
                          
                          {/* Legal Routes */}
                          <Route path="/terms" element={<TermsPage />} />
                          <Route path="/privacy" element={<PrivacyPage />} />
                          
                          {/* Default Routes */}
                          <Route path="/overview/basic-elements" element={<BasicElements />} />
                          <Route path="/overview" element={<About />} />
                          <Route path="/" element={<About />} />
                        </Routes>
                      </ScrollArea.Content>
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar className="scroll-scrollbar" orientation="vertical">
                      <ScrollArea.Thumb className="scroll-thumb" />
                    </ScrollArea.Scrollbar>
                    <ScrollArea.Corner className="scroll-corner" />
                  </ScrollArea.Root>
                </main>
                {/* Right side Section navigation */}
                <SectionNav />
              </div>
            </div>
          </div>
  )
}

export default App
export { ElementEditsViewer, ElementMcpViewer }

import React, { useState, useEffect } from 'react';
import DemoCard from '../../components/DemoCard';
import TipSection from '../../components/TipSection';
import DemoInstructions from '../../components/DemoInstructions';
import ElementEditViewer from '../../components/ElementEditViewer';
// Import utilities from bundled window object
const { generateJsonDiffFromHighlighted, populateBaselinesFromComputedStyles } = window.SituDemoUtils || {};
import BetaSection from '../../components/BetaSection';
import WarningSection from '../../components/WarningSection';

// Component to display inspector edits JSON for an element
const ElementEditsViewer = ({ elementId }) => {
  const [highlightedJson, setHighlightedJson] = useState('');
  const [styleState, setStyleState] = useState('original'); // 'original' or 'updated'

  // Syntax highlighting function for JSON
  const syntaxHighlight = (json) => {
    if (!json) return "";
    json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) cls = "key";
          else cls = "string";
        } else if (/true|false/.test(match)) cls = "boolean";
        else if (/null/.test(match)) cls = "null";
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  };

  // Function to get inspector edits JSON for the specified element
  const getElementEdits = () => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) {
        // Show baseline data if no edits found
        showBaselineData(elementId);
        return;
      }
      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) {
        showBaselineData(elementId);
        return;
      }
      // Find element edit with layout changes for the specified element
      const elementEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.elementId === elementId &&
        edit.updated && (
          (edit.type === 'element' && (
            (edit.updated.states && typeof edit.updated.states === 'object' && Object.keys(edit.updated.states).some(stateName =>
              edit.updated.states[stateName]?.layout && typeof edit.updated.states[stateName].layout === 'object'
            ))
          )) ||
          (edit.type === 'inputs' && edit.updated)
        )
      );

      if (!elementEdit) {
        showBaselineData(elementId);
        return;
      }

      // Format the edit for display with proper diff
      const isUnified = elementEdit.type === 'element';
      const isInputs = elementEdit.type === 'inputs';
      
      // Get baseline from data-original-element attribute
      const el = document.querySelector(`[data-id="${elementEdit.elementId}"]`);
      let baseline = {};
      try {
        const attr = el ? el.getAttribute('data-original-element') : null;
        if (attr) {
          const parsed = JSON.parse(attr);
          if (parsed && parsed.states && parsed.states.default) {
            baseline = { ...parsed.states.default };
          }
        }
      } catch (_) {}
      
      // Build original and updated objects for comparison
      let originalObj = {};
      let updatedObj = {};
      
      if (isUnified) {
        // Support nested states structure
        const stateNames = new Set([
          ...Object.keys(elementEdit.original?.states || {}),
          ...Object.keys(elementEdit.updated?.states || {})
        ]);
        
        if (stateNames.size === 0) stateNames.add('default');
        
        const originalStates = {};
        const updatedStates = {};
        
        stateNames.forEach(stateName => {
          const stateOriginal = elementEdit.original?.states?.[stateName] || {};
          const stateUpdated = elementEdit.updated?.states?.[stateName] || {};
          
          // Handle layout for this state - only include changed properties
          if (stateName === 'default') {
            // Use baseline as original if available, otherwise use edit.original
            const baselineLayout = (baseline && typeof baseline.layout === 'object') ? baseline.layout : {};
            const updatedLayout = (stateUpdated && typeof stateUpdated.layout === 'object') ? stateUpdated.layout : {};
            
            // Only include properties that actually changed
            if (updatedLayout) {
              const filteredOriginal = {};
              const filteredUpdated = {};
              
              Object.keys(updatedLayout).forEach(key => {
                const baseValue = baselineLayout[key];
                const updValue = updatedLayout[key];
                
                // Only include if values differ
                if (JSON.stringify(baseValue) !== JSON.stringify(updValue)) {
                  filteredOriginal[key] = baseValue;
                  filteredUpdated[key] = updValue;
                }
              });
              
              if (Object.keys(filteredUpdated).length > 0) {
                originalStates.default = originalStates.default || {};
                updatedStates.default = updatedStates.default || {};
                originalStates.default.layout = filteredOriginal;
                updatedStates.default.layout = filteredUpdated;
              }
            }
          } else {
            // For other states, only include properties that changed
            const originalLayout = (stateOriginal && typeof stateOriginal.layout === 'object') ? stateOriginal.layout : {};
            const updatedLayout = (stateUpdated && typeof stateUpdated.layout === 'object') ? stateUpdated.layout : {};
            
            if (updatedLayout) {
              const filteredOriginal = {};
              const filteredUpdated = {};
              
              Object.keys(updatedLayout).forEach(key => {
                const origValue = originalLayout[key];
                const updValue = updatedLayout[key];
                
                // Only include if values differ
                if (JSON.stringify(origValue) !== JSON.stringify(updValue)) {
                  filteredOriginal[key] = origValue;
                  filteredUpdated[key] = updValue;
                }
              });
              
              if (Object.keys(filteredUpdated).length > 0) {
                originalStates[stateName] = originalStates[stateName] || {};
                updatedStates[stateName] = updatedStates[stateName] || {};
                originalStates[stateName].layout = filteredOriginal;
                updatedStates[stateName].layout = filteredUpdated;
              }
            }
          }
        });
        
        originalObj = {
          elementId: elementEdit.elementId,
          type: 'element',
          timestamp: new Date(elementEdit.timestamp).toLocaleString(),
          states: originalStates
        };
        
        updatedObj = {
          elementId: elementEdit.elementId,
          type: 'element',
          timestamp: new Date(elementEdit.timestamp).toLocaleString(),
          states: updatedStates
        };
      } else if (isInputs) {
        // For inputs type, just use the edit data
        originalObj = {
          elementId: elementEdit.elementId,
          type: 'inputs',
          timestamp: new Date(elementEdit.timestamp).toLocaleString(),
          updated: elementEdit.original
        };
        
        updatedObj = {
          elementId: elementEdit.elementId,
          type: 'inputs',
          timestamp: new Date(elementEdit.timestamp).toLocaleString(),
          updated: elementEdit.updated
        };
      }

      const originalJsonString = JSON.stringify(originalObj, null, 2);
      const updatedJsonString = JSON.stringify(updatedObj, null, 2);
      
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
      console.warn('Failed to get element edits:', e);
      showBaselineData(elementId);
    }
  };

  const showBaselineData = (elementId) => {
    try {
      const el = document.querySelector(`[data-id="${elementId}"]`);
      if (!el) {
        setHighlightedJson(syntaxHighlight('Element not found'));
        return;
      }

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
        const isLayoutElement = elementId.includes('layout') || elementId.includes('grid') || elementId.includes('flex');
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
      
      setHighlightedJson(syntaxHighlight('No baseline data found.'));
    } catch (e) {
      console.error('showBaselineData error:', e);
      setHighlightedJson(syntaxHighlight('No inspector edits found'));
    }
  };

  useEffect(() => {
    // Ensure baselines are populated before trying to read them
    try {
      populateBaselinesFromComputedStyles && populateBaselinesFromComputedStyles();
    } catch (_) {}
    
    // Use a small timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      getElementEdits();
    }, 50);

    const handleStorage = (e) => { if (e.key === 'situ-edits') getElementEdits(); };
    const handleInspectorEdit = () => getElementEdits();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleInspectorEdit);
    window.addEventListener('click', handleInspectorEdit);
    window.addEventListener('keydown', handleInspectorEdit);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleInspectorEdit);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, [elementId]);

  return (
    <div className="json-container">
      <pre className="json-content" dangerouslySetInnerHTML={{ __html: highlightedJson }} />
    </div>
  );
};

// MCP operations viewer for an element
const ElementMcpViewer = ({ elementId }) => {
  const [highlightedJson, setHighlightedJson] = useState('');
  const syntaxHighlight = (json) => {
    if (!json) return "";
    json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) cls = "key";
          else cls = "string";
        } else if (/true|false/.test(match)) cls = "boolean";
        else if (/null/.test(match)) cls = "null";
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  };

  const fetchFromMcpServer = async () => {
    try {
      const response = await fetch('http://127.0.0.1:7124/edits');
      if (response.ok) {
        const envelope = await response.json();
        const filteredEdits = envelope.edits.filter(edit =>
          edit.locator && edit.locator.elementId === elementId
        );
        const filteredEnvelope = { ...envelope, edits: filteredEdits };
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
    const refresh = () => fetchFromMcpServer();
    refresh();
    const handleStorage = (e) => { if (e.key === 'situ-edits') refresh(); };
    const handleInspectorEdit = () => refresh();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleInspectorEdit);
    window.addEventListener('click', handleInspectorEdit);
    window.addEventListener('keydown', handleInspectorEdit);
    const poll = setInterval(refresh, 1000);
    
    return () => {
      clearInterval(poll);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleInspectorEdit);
      window.removeEventListener('click', handleInspectorEdit);
      window.removeEventListener('keydown', handleInspectorEdit);
    };
  }, [elementId]);

  return <pre className="json-content" dangerouslySetInnerHTML={{ __html: highlightedJson }} />;
};

// Component wrapper for element edit viewer
const ElementEditViewerWrapper = ({ elementId }) => {
  return (
    <ElementEditViewer 
      elementId={elementId} 
      ElementEditsViewer={ElementEditsViewer}
      ElementMcpViewer={ElementMcpViewer}
    />
  );
};

export const GridPage = () => {
  const grid1x2Id = 'demo-grid-1x2';
  const grid2x2Id = 'demo-grid-2x2';
  const grid3x2Id = 'demo-layout-grid'; // Keep existing ID for compatibility
  const grid3x3Id = 'demo-grid-3x3';
  
  // State to track if each grid element has changes
  const [hasGrid1x2Changes, setHasGrid1x2Changes] = useState(false);
  const [hasGrid2x2Changes, setHasGrid2x2Changes] = useState(false);
  const [hasGrid3x2Changes, setHasGrid3x2Changes] = useState(false);
  const [hasGrid3x3Changes, setHasGrid3x3Changes] = useState(false);

  // Function to check if element has layout changes in localStorage
  const checkLayoutChanges = (elementId) => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) return false;
      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) return false;
      const inputsEdit = persisted.editsArray.find(edit =>
        edit && edit.type === 'inputs' && edit.elementId === elementId && edit.updated
      );
      return !!inputsEdit;
    } catch (e) {
      console.warn('Failed to check layout changes:', e);
      return false;
    }
  };

  // Effect to check for grid changes on mount and listen for storage changes
  useEffect(() => {
    setHasGrid1x2Changes(checkLayoutChanges(grid1x2Id));
    setHasGrid2x2Changes(checkLayoutChanges(grid2x2Id));
    setHasGrid3x2Changes(checkLayoutChanges(grid3x2Id));
    setHasGrid3x3Changes(checkLayoutChanges(grid3x3Id));
    
    const updateAllGridChanges = () => {
      setHasGrid1x2Changes(checkLayoutChanges(grid1x2Id));
      setHasGrid2x2Changes(checkLayoutChanges(grid2x2Id));
      setHasGrid3x2Changes(checkLayoutChanges(grid3x2Id));
      setHasGrid3x3Changes(checkLayoutChanges(grid3x3Id));
    };
    
    const handleStorage = (e) => { if (e.key === 'situ-edits') updateAllGridChanges(); };
    const customStorageEvent = (e) => { if (e.detail?.key === 'situ-edits') updateAllGridChanges(); };
    
    window.addEventListener('storage', handleStorage);
    window.addEventListener('situ-storage-change', customStorageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('situ-storage-change', customStorageEvent);
    };
  }, [grid1x2Id, grid2x2Id, grid3x2Id, grid3x3Id]);

  return (
    <div className="content-section">

      <WarningSection title="Experimental">
        Grid editing is still experimental and may not work as expected in all browsers. We're actively working on improvements and stability and this is a key focus area for us.
      </WarningSection>

      <div className="content-header">
        <h1>Grid</h1>
        <p>CSS Grid layout properties and controls. Try inspecting and editing a grid container below. Use the grid editor to add/remove rows and columns, and adjust their sizes and positions.</p>
      </div>

      <TipSection title="TRY IT OUT">
        Inspect any layout container below to change its layout properties via the sidebar, and see the changes reflected in real-time. Hold <kbd>Alt</kbd> and <kbd>Click</kbd> containers to edit them.
      </TipSection>

      <div className="content-header">
        <p>CSS Grid provides two-dimensional layout capabilities, perfect for complex layouts and responsive designs.</p>
      </div>

      {/* 1x2 Grid Section */}
      <div className="column">
        <DemoCard title="1x2 Grid Layout" isUpdated={hasGrid1x2Changes}>
          <div 
            className="grid-demo-1x2" 
            data-id={grid1x2Id}
          >
            <div className="grid-item">Item 1</div>
            <div className="grid-item">Item 2</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-grid-1x2-instructions">
          <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the grid container above to edit its layout properties like grid-template-columns, gap, and justify-items.</p>
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={grid1x2Id} />
      </div>

      {/* 2x2 Grid Section */}
      <div className="column">
        <DemoCard title="2x2 Grid Layout" isUpdated={hasGrid2x2Changes}>
          <div 
            className="grid-demo-2x2" 
            data-id={grid2x2Id}
          >
            <div className="grid-item">Item 1</div>
            <div className="grid-item">Item 2</div>
            <div className="grid-item">Item 3</div>
            <div className="grid-item">Item 4</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-grid-2x2-instructions">
          <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the grid container above to edit its layout properties like grid-template-columns, gap, and justify-items.</p>
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={grid2x2Id} />
      </div>

      {/* 3x2 Grid Section */}
      <div className="column">
        <DemoCard title="3x2 Grid Layout" isUpdated={hasGrid3x2Changes}>
          <div 
            className="grid-demo" 
            data-id={grid3x2Id}
          >
            <div className="grid-item">Grid Item 1</div>
            <div className="grid-item">Grid Item 2</div>
            <div className="grid-item">Grid Item 3</div>
            <div className="grid-item">Grid Item 4</div>
            <div className="grid-item">Grid Item 5</div>
            <div className="grid-item">Grid Item 6</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-grid-3x2-instructions">
          <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the grid container above to edit its layout properties like grid-template-columns, gap, and justify-items.</p>
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={grid3x2Id} />
      </div>

      {/* 3x3 Grid Section */}
      <div className="column">
        <DemoCard title="3x3 Grid Layout" isUpdated={hasGrid3x3Changes}>
          <div 
            className="grid-demo" 
            data-id={grid3x3Id}
          >
            <div className="grid-item">Grid Item 1</div>
            <div className="grid-item">Grid Item 2</div>
            <div className="grid-item">Grid Item 3</div>
            <div className="grid-item">Grid Item 4</div>
            <div className="grid-item">Grid Item 5</div>
            <div className="grid-item">Grid Item 6</div>
            <div className="grid-item">Grid Item 7</div>
            <div className="grid-item">Grid Item 8</div>
            <div className="grid-item">Grid Item 9</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-grid-3x3-instructions">
          <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the grid container above to edit its layout properties like grid-template-columns, gap, and justify-items.</p>
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={grid3x3Id} />
      </div>

      <TipSection title="Review Your Edits">
        Made some edits? Open the sidebar and switch to the 'Edits' tab to see your updates listed. From here you can review, stage, or discard your changes.
      </TipSection>
    </div>
  );
};

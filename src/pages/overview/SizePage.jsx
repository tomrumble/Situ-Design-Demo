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
        const isLayoutElement = elementId.includes('size') || elementId.includes('layout') || elementId.includes('grid') || elementId.includes('flex');
        
        // Check for layout - only show for layout elements
        if (defaultState.layout && typeof defaultState.layout === 'object' && isLayoutElement) {
          stateObj.states.default.layout = defaultState.layout;
        }
        
        // Only show if we found relevant data for this element type
        if (stateObj.states.default.layout) {
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

export const SizePage = () => {
  // Generate stable IDs for size examples
  const widthBlockId = 'demo-size-width';
  const heightBlockId = 'demo-size-height';
  const minWidthBlockId = 'demo-size-min-width';
  const minHeightBlockId = 'demo-size-min-height';
  const maxWidthBlockId = 'demo-size-max-width';
  const maxHeightBlockId = 'demo-size-max-height';
  const aspectRatioBlockId = 'demo-size-aspect-ratio';
  const responsiveBlockId = 'demo-size-responsive';

  // State to track if size elements have changes
  const [hasWidthChanges, setHasWidthChanges] = useState(false);
  const [hasHeightChanges, setHasHeightChanges] = useState(false);
  const [hasMinWidthChanges, setHasMinWidthChanges] = useState(false);
  const [hasMinHeightChanges, setHasMinHeightChanges] = useState(false);
  const [hasMaxWidthChanges, setHasMaxWidthChanges] = useState(false);
  const [hasMaxHeightChanges, setHasMaxHeightChanges] = useState(false);
  const [hasAspectRatioChanges, setHasAspectRatioChanges] = useState(false);
  const [hasResponsiveChanges, setHasResponsiveChanges] = useState(false);

  // Function to check if element has layout/size changes
  const checkSizeChanges = (elementId) => {
    try {
      const persistedRaw = localStorage.getItem('situ-edits');
      if (!persistedRaw) return false;

      const persisted = JSON.parse(persistedRaw);
      if (!persisted || !Array.isArray(persisted.editsArray)) return false;

      const elementEdit = persisted.editsArray.find(edit =>
        edit &&
        edit.elementId === elementId &&
        edit.updated?.states &&
        Object.keys(edit.updated.states).some(stateName => {
          const st = edit.updated.states[stateName];
          return st?.layout && typeof st.layout === 'object' && Object.keys(st.layout).length > 0;
        })
      );
      return !!elementEdit;
    } catch (_) {
      return false;
    }
  };

  // Effect to check for size changes on mount and listen for storage changes
  useEffect(() => {
    const updateAllSizeChanges = () => {
      setHasWidthChanges(checkSizeChanges(widthBlockId));
      setHasHeightChanges(checkSizeChanges(heightBlockId));
      setHasMinWidthChanges(checkSizeChanges(minWidthBlockId));
      setHasMinHeightChanges(checkSizeChanges(minHeightBlockId));
      setHasMaxWidthChanges(checkSizeChanges(maxWidthBlockId));
      setHasMaxHeightChanges(checkSizeChanges(maxHeightBlockId));
      setHasAspectRatioChanges(checkSizeChanges(aspectRatioBlockId));
      setHasResponsiveChanges(checkSizeChanges(responsiveBlockId));
    };

    updateAllSizeChanges();

    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        updateAllSizeChanges();
      }
    };

    const handleInspectorEdit = () => {
      updateAllSizeChanges();
    };

    const pollInterval = setInterval(updateAllSizeChanges, 100);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inspectorEditApplied', handleInspectorEdit);
    window.addEventListener('focus', handleInspectorEdit);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inspectorEditApplied', handleInspectorEdit);
      window.removeEventListener('focus', handleInspectorEdit);
    };
  }, []);

  return (
    <div className="content-section">

      <WarningSection title="Experimental">
        Size editing is still experimental and may not work as expected in all browsers. We're actively working on improvements and stability.
      </WarningSection>

      <div className="content-header">
        <h1>Size</h1>
        <p>Control width, height, and size constraints directly in your dev environment. See real-time previews of min, max, and responsive sizing.</p>
      </div>

      <TipSection title="TRY IT OUT">
        Hold <kbd>Alt</kbd> and <kbd>Click</kbd> any layout container below to change its size properties via the sidebar and see your changes reflected in real-time.
      </TipSection>

      {/* Width Section */}
      <div className="column">
        <DemoCard title="Width Control" isUpdated={hasWidthChanges}>
          <div 
            className="flex-demo row" 
            style={{ width: '100%' }}
          >
            <div 
              className="flex-item" 
              data-id={widthBlockId}
              style={{ width: '200px' }}
            >
              Item (width: 200px)
            </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-size-instructions">
          {hasWidthChanges ? <p>Nice! Your width change is now staged. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the item above to change its width.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={widthBlockId} />
      </div>

      <div className="content-header">
        <p>Basic width and height properties set the initial size of elements. These are fundamental for controlling element dimensions.</p>
      </div>

      {/* Height Section */}
      <div className="column">
        <DemoCard title="Height Control" isUpdated={hasHeightChanges}>
          <div 
            className="flex-demo column" 
            style={{ height: '100px', width: '100%' }}
          >
            <div 
              className="flex-item" 
              data-id={heightBlockId}
              style={{ height: '60px', width: '100%' }}
            >
              Item (height: 60px)
            </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-size-instructions">
          {hasHeightChanges ? <p>Great! Your height change is persisted. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the item above to change its height.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={heightBlockId} />
      </div>

      <TipSection title="Min Sizing">
        Use min-width and min-height to ensure elements never shrink below a certain size. This is crucial for responsive design and maintaining readable text or functional components.
      </TipSection>

      {/* Min Width Section */}
      <div className="column">
        <DemoCard title="Min Width" isUpdated={hasMinWidthChanges}>
          <div 
            className="flex-demo row" 
            style={{ width: '100%' }}
          >
            <div 
              className="flex-item" 
              data-id={minWidthBlockId}
              style={{ minWidth: '150px' }}
            >
              Item (min-width: 150px)
            </div>
            <div className="flex-item" style={{ flex: 1, minWidth: 0 }}>
              This item fills remaining space
            </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-size-instructions">
          {hasMinWidthChanges ? <p>Nice! Try resizing - your min-width is preserved. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the first item above to change its min-width.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={minWidthBlockId} />
      </div>

      {/* Min Height Section */}
      <div className="column">
        <DemoCard title="Min Height" isUpdated={hasMinHeightChanges}>
          <div 
            className="flex-demo column" 
            style={{ width: '100%', minHeight: '100px' }}
          >
            <div 
              className="flex-item" 
              data-id={minHeightBlockId}
              style={{ minHeight: '50px', width: '100%' }}
            >
              Item (min-height: 50px)
            </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-size-instructions">
          {hasMinHeightChanges ? <p>Nice! Your min-height change is persisted. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the item above to change its min-height.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={minHeightBlockId} />
      </div>

      <TipSection title="Max Sizing">
        Use max-width and max-height to ensure elements never grow beyond a certain size. This prevents content from becoming too wide on large screens or too tall in containers.
      </TipSection>

      {/* Max Width Section */}
      <div className="column">
        <DemoCard title="Max Width" isUpdated={hasMaxWidthChanges}>
          <div 
            className="flex-demo row" 
            style={{ width: '100%' }}
          >
            <div 
              className="flex-item" 
              data-id={maxWidthBlockId}
              style={{ maxWidth: '300px', width: '100%' }}
            >
              Item (max-width: 300px)
            </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-size-instructions">
          {hasMaxWidthChanges ? <p>Excellent! Your max-width is now constrained. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the item above to change its max-width.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={maxWidthBlockId} />
      </div>

      {/* Max Height Section */}
      <div className="column">
        <DemoCard title="Max Height" isUpdated={hasMaxHeightChanges}>
          <div 
            className="flex-demo column" 
            style={{ width: '100%', maxHeight: '150px' }}
          >
            <div 
              className="flex-item" 
              data-id={maxHeightBlockId}
              style={{ maxHeight: '100px', width: '100%', overflow: 'auto' }}
            >
              Item (max-height: 100px) - Try adding more content to see the overflow behavior!
            </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-size-instructions">
          {hasMaxHeightChanges ? <p>Great! Your max-height limit is applied. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the item above to change its max-height.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={maxHeightBlockId} />
      </div>

      <TipSection title="Aspect Ratio">
        Maintain consistent proportions with aspect-ratio. This CSS property makes it easy to create responsive containers that scale while keeping their proportions.
      </TipSection>

      {/* Aspect Ratio Section */}
      <div className="column">
        <DemoCard title="Aspect Ratio" isUpdated={hasAspectRatioChanges}>
          <div 
            className="flex-demo row" 
            style={{ gap: '12px' }}
          >
            <div 
              className="flex-item" 
              data-id={aspectRatioBlockId}
              style={{ 
                width: '150px', 
                aspectRatio: '16/9',
                background: '#8a5cf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              16:9
            </div>
            <div className="flex-item" style={{ 
              width: '150px', 
              aspectRatio: '4/3',
              background: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              4:3
            </div>
            <div className="flex-item" style={{ 
              width: '150px', 
              aspectRatio: '1/1',
              background: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              1:1
            </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-size-instructions">
          {hasAspectRatioChanges ? <p>Perfect! Your aspect ratio change is saved. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the first item above to change its aspect ratio.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={aspectRatioBlockId} />
      </div>

      <div className="content-header">
        <p>Combine width, height, min, and max properties for complete control over element sizing. This allows you to create flexible, responsive layouts that adapt to different screen sizes.</p>
      </div>

      {/* Responsive Size Section */}
      <div className="column">
        <DemoCard title="Responsive Sizing" isUpdated={hasResponsiveChanges}>
          <div 
            className="flex-demo row" 
            data-id={responsiveBlockId}
            style={{ 
              gap: '12px',
              width: '100%'
            }}
          >
            <div className="flex-item" style={{ flex: '1 1 200px', minWidth: 0 }}>
              Item 1 (flex: 1 1 200px)
            </div>
            <div className="flex-item" style={{ flex: '1 1 200px', minWidth: 0 }}>
              Item 2 (flex: 1 1 200px)
            </div>
            <div className="flex-item" style={{ flex: '1 1 200px', minWidth: 0 }}>
              Item 3 (flex: 1 1 200px)
            </div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-size-instructions">
          {hasResponsiveChanges ? <p>Excellent! Your responsive sizing is working. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the container above to experiment with flexible sizing.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={responsiveBlockId} />
      </div>

      <TipSection title="Review Your Edits">
        Made some edits? Open the sidebar and switch to the 'Edits' tab to see your updates listed. From here you can review, stage, or discard your changes.
      </TipSection>
    </div>
  );
};

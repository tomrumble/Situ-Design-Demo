import React, { useState, useEffect } from 'react';
import DemoCard from '../../components/DemoCard';
import TipSection from '../../components/TipSection';
import DemoInstructions from '../../components/DemoInstructions';
import ElementEditViewer from '../../components/ElementEditViewer';
import BetaSection from '../../components/BetaSection';
import WarningSection from '../../components/WarningSection';

// Import ElementEditsViewer and ElementMcpViewer from App.jsx
import { ElementEditsViewer, ElementMcpViewer } from '../../App';

// Wrapper to provide elementId prop and required components
function ElementEditViewerWrapper({ elementId }) {
  return <ElementEditViewer elementId={elementId} ElementEditsViewer={ElementEditsViewer} ElementMcpViewer={ElementMcpViewer} />;
}

export const SpacingPage = () => {
  // Generate stable IDs for spacing examples
  const gapBlockId = 'demo-spacing-gap';
  const gapRowBlockId = 'demo-spacing-gap-row';
  const marginBlockId = 'demo-spacing-margin';
  const paddingBlockId = 'demo-spacing-padding';
  const rowGapBlockId = 'demo-spacing-row-gap';
  const columnGapBlockId = 'demo-spacing-column-gap';
  const mixedSpacingBlockId = 'demo-spacing-mixed';

  // State to track if spacing elements have changes
  const [hasGapChanges, setHasGapChanges] = useState(false);
  const [hasMarginChanges, setHasMarginChanges] = useState(false);
  const [hasPaddingChanges, setHasPaddingChanges] = useState(false);
  const [hasRowGapChanges, setHasRowGapChanges] = useState(false);
  const [hasColumnGapChanges, setHasColumnGapChanges] = useState(false);
  const [hasMixedSpacingChanges, setHasMixedSpacingChanges] = useState(false);

  // Function to check if element has layout/spacing changes
  const checkSpacingChanges = (elementId) => {
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

  // Effect to check for spacing changes on mount and listen for storage changes
  useEffect(() => {
    const updateAllSpacingChanges = () => {
      setHasGapChanges(checkSpacingChanges(gapBlockId));
      setHasMarginChanges(checkSpacingChanges(marginBlockId));
      setHasPaddingChanges(checkSpacingChanges(paddingBlockId));
      setHasRowGapChanges(checkSpacingChanges(rowGapBlockId));
      setHasColumnGapChanges(checkSpacingChanges(columnGapBlockId));
      setHasMixedSpacingChanges(checkSpacingChanges(mixedSpacingBlockId));
    };

    updateAllSpacingChanges();

    const handleStorageChange = (e) => {
      if (e.key === 'situ-edits') {
        updateAllSpacingChanges();
      }
    };

    const handleInspectorEdit = () => {
      updateAllSpacingChanges();
    };

    const pollInterval = setInterval(updateAllSpacingChanges, 100);

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
        Spacing editing is still experimental and may not work as expected in all browsers. We're actively working on improvements and stability and this is a key focus area for us.
      </WarningSection>

      <div className="content-header">
        <h1>Spacing</h1>
        <p>Control gaps, margins, and padding directly in your dev environment. See real-time previews and keep your changes through reloads.</p>
      </div>

      <TipSection title="TRY IT OUT">
        Hold <kbd>Alt</kbd> and <kbd>Click</kbd> any layout container below to change its spacing properties via the sidebar and see your changes reflected in real-time.
      </TipSection>

      {/* Gap Section */}
      <div className="column">
        <DemoCard title="Vertical Gap Spacing" isUpdated={hasGapChanges}>
          <div 
            className="spacing-demo-column" 
            data-id={gapBlockId}
          >
            <div className="flex-item">Item 1</div>
            <div className="flex-item">Item 2</div>
            <div className="flex-item">Item 3</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-spacing-row">
          {hasGapChanges ? <p>Nice! Your gap spacing change is now staged. Press <kbd>CMD + Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the container above to change its gap spacing.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={gapBlockId} />
      </div>

      <div className="content-header">
        <p>Spacing properties control the space between and around elements. Try adjusting gaps, margins, and padding to see how they affect your layout.</p>
      </div>

      {/* Gap Section */}
      <div className="column">
        <DemoCard title="Vertical Gap Spacing" isUpdated={hasGapChanges}>
          <div 
            className="spacing-demo-row" 
            data-id={gapRowBlockId}
          >
            <div className="flex-item">Item 1</div>
            <div className="flex-item">Item 2</div>
            <div className="flex-item">Item 3</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-spacing-col">
          {hasGapChanges ? <p>Nice! Your gap spacing change is now staged. Press <kbd>CMD + Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the container above to change its gap spacing.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={gapBlockId} />
      </div>

      {/* Padding Section */}
      <div className="column">
        <DemoCard title="Padding Spacing" isUpdated={hasPaddingChanges}>
          <div 
            className="flex-demo row" 
            data-id={paddingBlockId}
          >
            <div className="flex-item">Item 1</div>
            <div className="flex-item" style={{ padding: '20px' }}>Item 2 (has padding)</div>
            <div className="flex-item">Item 3</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-spacing-instructions">
          {hasPaddingChanges ? <p>Great! Your padding change is persisted. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the middle item above to change its padding.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={paddingBlockId} />
      </div>

      <TipSection title="Grid Spacing">
        When working with grid layouts, you can control row and column gaps independently. This gives you fine-grained control over horizontal and vertical spacing.
      </TipSection>

      {/* Row Gap Section */}
      <div className="column">
        <DemoCard title="Row Gap" isUpdated={hasRowGapChanges}>
          <div 
            className="grid-demo" 
            data-id={rowGapBlockId}
          >
            <div className="grid-item">Row 1, Col 1</div>
            <div className="grid-item">Row 1, Col 2</div>
            <div className="grid-item">Row 2, Col 1</div>
            <div className="grid-item">Row 2, Col 2</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-spacing-instructions">
          {hasRowGapChanges ? <p>Nice! Try navigating - your changes persist. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the container above to change its row gap.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={rowGapBlockId} />
      </div>

      {/* Column Gap Section */}
      <div className="column">
        <DemoCard title="Column Gap" isUpdated={hasColumnGapChanges}>
          <div 
            className="grid-demo" 
            data-id={columnGapBlockId}
          >
            <div className="grid-item">Row 1, Col 1</div>
            <div className="grid-item">Row 1, Col 2</div>
            <div className="grid-item">Row 2, Col 1</div>
            <div className="grid-item">Row 2, Col 2</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-spacing-instructions">
          {hasColumnGapChanges ? <p>Nice! Try navigating - your changes persist. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the container above to change its column gap.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={columnGapBlockId} />
      </div>

      <div className="content-header">
        <p>Combine multiple spacing properties for complete control over your layouts. Each property works independently, allowing you to fine-tune your designs.</p>
      </div>

      {/* Mixed Spacing Section */}
      <div className="column">
        <DemoCard title="Mixed Spacing" isUpdated={hasMixedSpacingChanges}>
          <div 
            className="flex-demo row" 
            data-id={mixedSpacingBlockId}
          >
            <div className="flex-item" style={{ padding: '12px' }}>Item 1</div>
            <div className="flex-item" style={{ padding: '12px' }}>Item 2</div>
            <div className="flex-item" style={{ padding: '12px' }}>Item 3</div>
          </div>
        </DemoCard>
        <DemoInstructions dataId="demo-spacing-instructions">
          {hasMixedSpacingChanges ? <p>Excellent! Your mixed spacing changes are persisted. Press <kbd>CMD</kbd>+<kbd>Z</kbd> to undo.</p> : <p>Hold <kbd>Alt</kbd> and <kbd>Click</kbd> the container above to experiment with different spacing values.</p>}
        </DemoInstructions>
        <ElementEditViewerWrapper elementId={mixedSpacingBlockId} />
      </div>

      <TipSection title="Review Your Edits">
        Made some edits? Open the sidebar and switch to the 'Edits' tab to see your updates listed. From here you can review, stage, or discard your changes.
      </TipSection>
    </div>
  );
};

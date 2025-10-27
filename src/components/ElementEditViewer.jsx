import React, { useState } from 'react';

const ElementEditViewer = ({ elementId, ElementEditsViewer, ElementMcpViewer }) => {
  const [activeTab, setActiveTab] = useState('diff');

  return (
    <div className="edit-viewer-switcher">
      <div className="edit-viewer-container">
        <div className="edit-viewer-tabs">
          <button
            className={`edit-tab ${activeTab === 'diff' ? 'active' : ''}`}
            onClick={() => setActiveTab('diff')}
          >
            Diff
          </button>
          <button
            className={`edit-tab ${activeTab === 'mcp' ? 'active' : ''}`}
            onClick={() => setActiveTab('mcp')}
          >
            MCP
          </button>
        </div>
        <div className="edit-viewer-content">
          {activeTab === 'diff' && (
            <div className="json-display">
              <ElementEditsViewer elementId={elementId} />
            </div>
          )}
          {activeTab === 'mcp' && (
            <div className="json-display">
              <ElementMcpViewer elementId={elementId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElementEditViewer;

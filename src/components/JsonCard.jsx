import React, { useState } from 'react';

const JsonCard = ({ title, data, copyText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText || JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const highlightedJson = syntaxHighlight(JSON.stringify(data, null, 2));

  return (
    <div className="json-card">
      
      <button 
        className="json-card-copy-button" 
        onClick={handleCopy}
        aria-label="Copy to clipboard"
      >
        {copied ? '✓ Copied!' : 'Copy'}
      </button>
      <pre className="json-content" dangerouslySetInnerHTML={{ __html: highlightedJson }} />
    </div>
  );
};

export default JsonCard;

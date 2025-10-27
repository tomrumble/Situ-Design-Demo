// Injects data-source="/abs/path:line:col" and a deterministic data-id UUID on host JSX elements (dev)
const crypto = require('crypto');

// Deterministic UUID v5-style generator using SHA-1 over a fixed namespace + name
// Ensures stable IDs across HMR/rebuilds for the same (file:line:col)
const DATA_ID_NAMESPACE = crypto
  .createHash('sha1')
  .update('subjourney-react-data-id-namespace')
  .digest()
  .subarray(0, 16);

function uuidv5FromName(name) {
  const nameBytes = Buffer.from(name, 'utf8');
  const toHash = Buffer.concat([DATA_ID_NAMESPACE, nameBytes]);
  const sha1 = crypto.createHash('sha1').update(toHash).digest(); // 20 bytes
  const bytes = Buffer.from(sha1.subarray(0, 16));
  // Set version (5)
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  // Set variant (RFC 4122)
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
let processedFiles = 0;
let totalElements = 0;
let totalComponents = 0;
let summaryShown = false;

module.exports = function babelJsxSourceAttrPlugin(babel) {
  const t = babel.types;
  return {
    name: 'babel-jsx-source-attr',
    visitor: {
      Program: {
        enter(path, state) {
          processedFiles++;
        },
        exit(path, state) {
          // Count elements and components in this file
          let fileElements = 0;
          let fileComponents = 0;
          
          path.traverse({
            JSXOpeningElement(jsxPath) {
              const node = jsxPath.node;
              if (!node || !node.loc) return;
              
              if (t.isJSXIdentifier(node.name)) {
                if (/^[a-z]/.test(node.name.name)) {
                  fileElements++;
                } else {
                  fileComponents++;
                }
              }
            }
          });
          
          totalElements += fileElements;
          totalComponents += fileComponents;
        }
      },
      JSXOpeningElement(path) {
        const node = path.node;
        if (!node || !node.loc) return;

        // Only host tags like <div>, <button> (skip <Header />)
        if (!t.isJSXIdentifier(node.name) || !/^[a-z]/.test(node.name.name)) return;

        const file = path.hub?.file?.opts?.filename;
        if (!file) return;

        const line = node.loc.start.line;
        const col  = (node.loc.start.column || 0) + 1; // 1-based
        const sourceValue = `${file}:${line}:${col}`;

        const hasAttr = (attrName) => node.attributes?.some(a => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === attrName);

        // Add data-source if missing
        if (!hasAttr('data-source')) {
          node.attributes.push(
            t.jsxAttribute(t.jsxIdentifier('data-source'), t.stringLiteral(sourceValue))
          );
        }

        // Add data-id if missing, deterministically from file:line:col
        if (!hasAttr('data-id')) {
          const id = uuidv5FromName(sourceValue);
          node.attributes.push(
            t.jsxAttribute(t.jsxIdentifier('data-id'), t.stringLiteral(id))
          );
        }
      },
    },
  };
};

// Show final summary after processing is complete
setTimeout(() => {
  if (processedFiles > 0 && !summaryShown) {
    // Clear the loading line and show summary
    process.stdout.write(`\r  ➜  Found ${totalElements} elements, ${totalComponents} components\n`);
    summaryShown = true;
  }
}, 200);

// Show final summary when plugin finishes
process.on('exit', () => {
  if (processedFiles > 0 && !summaryShown) {
    console.log(`\r  ➜  Found ${totalElements} elements, ${totalComponents} components`);
  }
});

// Also show summary on process termination
process.on('SIGINT', () => {
  if (processedFiles > 0 && !summaryShown) {
    console.log(`\r  ➜  Found ${totalElements} elements, ${totalComponents} components`);
  }
  process.exit(0);
});



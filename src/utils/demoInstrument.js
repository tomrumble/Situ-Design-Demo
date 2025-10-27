// Demo DOM instrumenter: injects data-source and data-id so bundled inspector works
let __demoAutoIdCounter = 0;

function generateDemoId() {
  __demoAutoIdCounter += 1;
  return `demo_elem_${__demoAutoIdCounter}`;
}

function instrumentElement(el) {
  if (!el || el.nodeType !== 1) return;
  try {
    if (!el.getAttribute('data-id')) {
      el.setAttribute('data-id', generateDemoId());
    }
  } catch (_) {}
  try {
    if (!el.getAttribute('data-source')) {
      // Provide a minimal file:line:col that passes regex checks in findDataSource
      el.setAttribute('data-source', 'demo:1:1');
    }
  } catch (_) {}
}

function walkAndInstrument(root) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
  let node = root;
  while (node) {
    instrumentElement(node);
    node = walker.nextNode();
  }
}

export function instrumentDemoDom(rootSelector = '#root') {
  try {
    const root = document.querySelector(rootSelector) || document.body;
    walkAndInstrument(root);

    // Observe future changes to instrument dynamically added nodes
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes && m.addedNodes.forEach((n) => {
            if (n.nodeType === 1) {
              instrumentElement(n);
              walkAndInstrument(n);
            }
          });
        } else if (m.type === 'attributes') {
          if (m.target && m.attributeName && m.attributeName.startsWith('data-') === false) {
            instrumentElement(m.target);
          }
        }
      }
    });
    observer.observe(root, { childList: true, subtree: true });
  } catch (e) {
    console.warn('Demo DOM instrumentation failed:', e);
  }
}

// src/utils/demoUtilsStubs.js
// Fallback stub implementations for demo utilities

/**
 * Stub implementations for when the bundled utilities aren't available.
 * These are simple implementations that provide basic functionality.
 */

export const mergeFillsWithUpdates = (baseline, updates) => {
  if (window.SituDemoUtils && window.SituDemoUtils.mergeFillsWithUpdates) {
    return window.SituDemoUtils.mergeFillsWithUpdates(baseline, updates);
  }
  // Stub: return updates if available, otherwise baseline
  return Array.isArray(updates) && updates.length > 0 ? updates : (baseline || []);
};

export const populateBaselinesFromComputedStyles = () => {
  if (window.SituDemoUtils && window.SituDemoUtils.populateBaselinesFromComputedStyles) {
    return window.SituDemoUtils.populateBaselinesFromComputedStyles();
  }
  // Stub: no-op
  return;
};

export const computeDelta = (original, updated) => {
  if (window.SituDemoUtils && window.SituDemoUtils.computeDelta) {
    return window.SituDemoUtils.computeDelta(original, updated);
  }
  // Stub: return updated object with only changed keys
  if (!updated) return {};
  if (!original) return updated;
  if (JSON.stringify(original) === JSON.stringify(updated)) return {};
  return updated;
};

export const valuesEqualLoose = (a, b) => {
  if (window.SituDemoUtils && window.SituDemoUtils.valuesEqualLoose) {
    return window.SituDemoUtils.valuesEqualLoose(a, b);
  }
  // Stub: loose equality check
  return a == b;
};

export const pruneGradientFillForDisplay = (fill) => {
  if (window.SituDemoUtils && window.SituDemoUtils.pruneGradientFillForDisplay) {
    return window.SituDemoUtils.pruneGradientFillForDisplay(fill);
  }
  // Stub: return as-is
  return fill;
};

export const collectChangedKeySets = (original, updated) => {
  if (window.SituDemoUtils && window.SituDemoUtils.collectChangedKeySets) {
    return window.SituDemoUtils.collectChangedKeySets(original, updated);
  }
  // Stub: simple key comparison
  if (!original || !updated) return new Set();
  const changes = new Set();
  Object.keys(updated).forEach(key => {
    if (original[key] !== updated[key]) {
      changes.add(key);
    }
  });
  return changes;
};

export const generateFullJsonDiff = (original, updated, syntaxHighlightFn) => {
  if (window.SituDemoUtils && window.SituDemoUtils.generateFullJsonDiff) {
    return window.SituDemoUtils.generateFullJsonDiff(original, updated, syntaxHighlightFn);
  }
  // Stub: simple diff
  return {
    original: syntaxHighlightFn ? syntaxHighlightFn(JSON.stringify(original, null, 2)) : JSON.stringify(original, null, 2),
    updated: syntaxHighlightFn ? syntaxHighlightFn(JSON.stringify(updated, null, 2)) : JSON.stringify(updated, null, 2)
  };
};

export const generateJsonDiffFromHighlighted = (originalPlain, updatedPlain, originalHighlighted, updatedHighlighted) => {
  if (window.SituDemoUtils && window.SituDemoUtils.generateJsonDiffFromHighlighted) {
    return window.SituDemoUtils.generateJsonDiffFromHighlighted(originalPlain, updatedPlain, originalHighlighted, updatedHighlighted);
  }
  // Stub: simple side-by-side comparison
  return `
    <div class="diff-container">
      <div class="diff-original">${originalHighlighted || originalPlain}</div>
      <div class="diff-updated">${updatedHighlighted || updatedPlain}</div>
    </div>
  `;
};


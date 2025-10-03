import * as React from 'react';

const caches = new Set<React.RefObject<Map<string, string>>>();

export function registerTranslationCache(ref: React.RefObject<Map<string, string>>) {
  try {
    caches.add(ref);
  } catch (e) {
    // ignore
  }
}

export function unregisterTranslationCache(ref: React.RefObject<Map<string, string>>) {
  try {
    caches.delete(ref);
  } catch (e) {
    // ignore
  }
}

export function clearAllTranslationCaches() {
  let count = 0;
  try {
    for (const ref of Array.from(caches)) {
      try {
        if (ref && ref.current) {
          ref.current.clear();
          count++;
        }
      } catch (e) {
        // ignore individual failures
      }
    }
  } catch (e) {
    // ignore
  }

  // Also dispatch the existing app event so components that listen will react
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)?.dispatchEvent?.(new Event('civic-lens-language-changed'));
  } catch (e) {
    // ignore
  }

  return count;
}

// Expose on global for native/debug convenience
try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).civicLensClearTranslationCaches = clearAllTranslationCaches;
} catch (e) {
  // ignore
}

export default {
  registerTranslationCache,
  unregisterTranslationCache,
  clearAllTranslationCaches,
};

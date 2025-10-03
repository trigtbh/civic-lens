import * as React from 'react';

const collected = new Set<string>();

function addString(s: string | number | null | undefined): string | null {
  if (s === null || s === undefined) return null;
  const str = String(s).trim();
  if (str.length === 0) return null;
  if (!collected.has(str)) {
    collected.add(str);
    return str;
  }
  return null;
}

/**
 * Walk a React node and return an array of newly added strings found during this traversal.
 */
export function addTextsFromNode(node: React.ReactNode): string[] {
  const added: string[] = [];
  if (node === null || node === undefined || node === false) return added;

  if (typeof node === 'string' || typeof node === 'number') {
    const s = addString(node);
    if (s) added.push(s);
    return added;
  }

  if (Array.isArray(node)) {
    node.forEach(child => {
      const childAdded = addTextsFromNode(child);
      if (childAdded.length) added.push(...childAdded);
    });
    return added;
  }

  // If it's a React element, inspect its children prop
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof node === 'object' && 'props' in (node as any)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = (node as any).props as { children?: React.ReactNode };
    if (props && props.children) {
      const childAdded = addTextsFromNode(props.children);
      if (childAdded.length) added.push(...childAdded);
    }
  }

  return added;
}

export function registerText(s: string | number | null | undefined): string | null {
  return addString(s);
}

// Backend posting support is deprecated. Keep a no-op function so callers don't break,
// but do not call the old /collect-texts endpoint.
export async function postTexts(_texts: string[], _source?: string) {
  // eslint-disable-next-line no-console
  console.warn('[Text extractor] postTexts is deprecated and will not send data to /collect-texts');
  return null;
}

export function getAllTexts(): string[] {
  return Array.from(collected.values()).sort();
}

export function toJSON(): string {
  return JSON.stringify(getAllTexts(), null, 2);
}

export function downloadJSON(filename = 'extracted_texts.json') {
  if (typeof document === 'undefined') {
    // Not running in a browser environment; fallback to console
    // Consumer can call getAllTexts() and handle saving
    // eslint-disable-next-line no-console
    console.log('downloadJSON not available in this environment. Use getAllTexts() or toJSON() to retrieve data.');
    return;
  }

  const json = toJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function clearCollected() {
  collected.clear();
}

export default {
  addTextsFromNode,
  registerText,
  getAllTexts,
  toJSON,
  downloadJSON,
  clearCollected,
};

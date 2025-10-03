// Simple translate utility used across the frontend.
// Provides translate(text): Promise<string> and translateSync(text): string

const cache = new Map<string, string>();

function resolveTargetLang(): string {
  try {
    if (typeof localStorage !== 'undefined') {
      const pref = localStorage.getItem('preferredLanguage');
      if (pref) return pref;
    }
  } catch (e) {
    // ignore
  }
  try {
    if (typeof document !== 'undefined' && document.documentElement?.lang) {
      return document.documentElement.lang;
    }
  } catch (e) {
    // ignore
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = (typeof navigator !== 'undefined' ? (navigator as any).language || (navigator as any).userLanguage : undefined) as string | undefined;
    if (nav) return nav.split('-')[0];
  } catch (e) {
    // ignore
  }
  return 'en';
}

export async function translate(text: string, opts?: { signal?: AbortSignal }): Promise<string> {
  if (text == null) return '';
  const trimmed = String(text).trim();
  if (!trimmed) return trimmed;

  const target = resolveTargetLang();
  if (target === 'en') return trimmed;

  const key = `${target}::${trimmed}`;
  const cached = cache.get(key);
  if (cached) return cached;

  try {
    const resp = await fetch('https://civiclens.app/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed, source: 'en', target }),
      signal: opts?.signal as any,
    });
    if (!resp.ok) throw new Error(`status ${resp.status}`);
    const body = await resp.json();
    let result: string | undefined;
    if (body) {
      if (Array.isArray(body.alternatives) && body.alternatives.length) result = body.alternatives[0];
      if (!result && typeof body.translation === 'string') result = body.translation;
      if (!result && typeof body.text === 'string') result = body.text;
      if (!result && typeof body.translatedText === 'string') result = body.translatedText;
    }
    if (result) { 
      cache.set(key, result);
      try {
        // Notify listeners that a translation is now available
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any)?.dispatchEvent?.(new CustomEvent('civic-lens-translation-updated', { detail: { key, result } }));
      } catch (e) {
        // ignore
      }
      return result; 
    }
  } catch (err) {
    // ignore and fallthrough to return original
  }
  return trimmed;
}

export function translateSync(text: string): string {

    console.log(text);

  if (text == null) return '';
  const trimmed = String(text).trim();
  if (!trimmed) return trimmed;
  const target = resolveTargetLang();
  if (target === 'en') return trimmed;
  const key = `${target}::${trimmed}`;
  const cached = cache.get(key);


  if (cached) return cached;

  // Fire background translation to populate cache for future sync calls
  // Do not await — fire-and-forget
  translate(trimmed).catch(() => {});
  return trimmed;
}

export function clearTranslateCache(): number {
  const n = cache.size;
  cache.clear();
  try {
    // also dispatch language changed so components re-evaluate
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)?.dispatchEvent?.(new Event('civic-lens-language-changed'));
  } catch (e) {
    // ignore
  }
  return n;
}

// Register our cache with the existing registry if present
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const reg = require('../components/ui/translationCacheRegistry');
  if (reg && typeof reg.registerTranslationCache === 'function') {
    // create a ref-like object that exposes the Map via .current
    const ref = { current: cache } as any;
    try { reg.registerTranslationCache(ref); } catch (e) { /* ignore */ }
  }
} catch (e) {
  // ignore
}

// Expose globally for quick console usage
try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).translate = translate;
  (global as any).translateSync = translateSync;
} catch (e) {
  // ignore
}

export default { translate, translateSync, clearTranslateCache };

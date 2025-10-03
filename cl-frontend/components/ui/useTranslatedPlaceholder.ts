import * as React from 'react';
import { registerText } from './text-extractor';

/**
 * Custom hook for translating placeholder text.
 * Uses the same translation logic as the Text component.
 * @param placeholder - The original placeholder text in English
 * @returns The translated placeholder text (or original if translation is not available yet)
 */
export function useTranslatedPlaceholder(placeholder?: string): string | undefined {
  const [translated, setTranslated] = React.useState<string | null>(null);
  const translationCache = React.useRef<Map<string, string>>(new Map());
  const [langVersion, setLangVersion] = React.useState(0);

  // Register this cache for global clearing
  React.useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const reg = require('./translationCacheRegistry');
      reg.registerTranslationCache(translationCache as React.RefObject<Map<string, string>>);
      return () => {
        try {
          reg.unregisterTranslationCache(translationCache as React.RefObject<Map<string, string>>);
        } catch (e) {
          // ignore
        }
      };
    } catch (e) {
      // ignore
    }
  }, []);

  // Listen for global language-change events
  React.useEffect(() => {
    const handler = () => {
      translationCache.current.clear();
      setTranslated(null);
      setLangVersion(v => v + 1);
    };
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).addEventListener('civic-lens-language-changed', handler);
    } catch (e) {
      // ignore (non-browser env)
    }
    return () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).removeEventListener('civic-lens-language-changed', handler);
      } catch (e) {
        // ignore
      }
    };
  }, []);

  // Resolve target language
  const resolveTargetLang = React.useCallback(() => {
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
  }, []);

  // Register and translate placeholder
  React.useEffect(() => {
    if (!placeholder || typeof placeholder !== 'string') {
      setTranslated(null);
      return;
    }

    const text = placeholder.trim();
    if (!text) {
      setTranslated(null);
      return;
    }

    // Register the placeholder text for collection
    registerText(text);

    const target = resolveTargetLang();
    
    // If target is English, no translation needed
    if (target === 'en') {
      setTranslated(null);
      return;
    }

    const cacheKey = `${target}::${text}`;
    const cached = translationCache.current.get(cacheKey);
    
    if (cached) {
      setTranslated(cached);
      return;
    }

    let didCancel = false;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : undefined;

    const doFetch = async () => {
      try {
        const resp = await fetch('https://civiclens.app/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: text, source: 'en', target: target }),
          signal: controller?.signal,
        });
        
        if (!resp.ok) throw new Error(`status ${resp.status}`);
        
        const body = await resp.json();
        let result: string | undefined;
        
        if (body) {
          if (Array.isArray(body.alternatives) && body.alternatives.length) {
            result = body.alternatives[0];
          }
          if (!result && typeof body.translation === 'string') {
            result = body.translation;
          }
          if (!result && typeof body.text === 'string') {
            result = body.text;
          }
          if (!result && typeof body.translatedText === 'string') {
            result = body.translatedText;
          }
        }
        
        if (!didCancel && result) {
          translationCache.current.set(cacheKey, result);
          setTranslated(result);
        }
      } catch (err) {
        // Silently fail - just use original placeholder
      }
    };

    doFetch();

    return () => {
      didCancel = true;
      try {
        controller?.abort();
      } catch (e) {
        // ignore
      }
    };
  }, [placeholder, langVersion, resolveTargetLang]);

  // Return translated version if available, otherwise original
  return translated ?? placeholder;
}

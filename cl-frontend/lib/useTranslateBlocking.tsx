import * as React from 'react';

/**
 * Hook that performs an async translate(text) call and returns the translated text and loading state.
 * This does not use translateSync and will call the network translate function.
 */
export function useTranslateBlocking(text?: string) {
  const [translated, setTranslated] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let didCancel = false;
    if (!text || !text.trim()) {
      setTranslated(undefined);
      setLoading(false);
      return;
    }
    setLoading(true);
    // dynamic import to avoid circular requires
    (async () => {
      try {
        const mod = await import('./translate');
        const res = await mod.translate(text);
        if (!didCancel) setTranslated(res);
      } catch (e) {
        if (!didCancel) setTranslated(text);
      } finally {
        if (!didCancel) setLoading(false);
      }
    })();

    return () => {
      didCancel = true;
    };
  }, [text]);

  return { translated, loading } as const;
}

export default useTranslateBlocking;

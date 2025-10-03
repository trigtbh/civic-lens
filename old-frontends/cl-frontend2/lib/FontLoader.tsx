import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fontManager, type FontPaths } from './fonts';

interface FontLoaderContextValue {
  fontsReady: boolean;
  error: string | null;
}

const FontLoaderContext = createContext<FontLoaderContextValue>({
  fontsReady: false,
  error: null,
});

export interface FontLoaderProps {
  children: ReactNode;
  initialFonts?: FontPaths;
  fallback?: ReactNode;
}

export function FontLoader({ children, initialFonts, fallback = null }: FontLoaderProps) {
  const [fontsReady, setFontsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        if (initialFonts) {
          await fontManager.setFonts(initialFonts);
        }
        setFontsReady(true);
      } catch (err) {
        console.error('Failed to load fonts:', err);
        setError(err instanceof Error ? err.message : 'Unknown font loading error');
        // Still set ready to true so the app doesn't hang
        setFontsReady(true);
      }
    }

    loadFonts();
  }, [initialFonts]);

  const contextValue: FontLoaderContextValue = {
    fontsReady,
    error,
  };

  if (!fontsReady) {
    return fallback;
  }

  return (
    <FontLoaderContext.Provider value={contextValue}>
      {children}
    </FontLoaderContext.Provider>
  );
}

export function useFontLoader(): FontLoaderContextValue {
  return useContext(FontLoaderContext);
}
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fontManager, type FontConfig, type FontPaths } from './fonts';

interface FontContextValue {
  fonts: FontConfig;
  fontsLoaded: boolean;
  setFonts: (fontPaths: FontPaths) => Promise<void>;
  setFont: (type: keyof FontConfig, fontPath: string) => Promise<void>;
  resetFonts: () => void;
  getFontFamily: (type: keyof FontConfig) => string;
}

const FontContext = createContext<FontContextValue | undefined>(undefined);

export interface FontProviderProps {
  children: ReactNode;
  initialFonts?: FontPaths;
}

export function FontProvider({ children, initialFonts }: FontProviderProps) {
  const [fonts, setFontsState] = useState<FontConfig>(fontManager.getAllFontFamilies());
  const [fontsLoaded, setFontsLoaded] = useState(fontManager.areFontsLoaded());

  const updateFontsState = () => {
    setFontsState(fontManager.getAllFontFamilies());
    setFontsLoaded(fontManager.areFontsLoaded());
  };

  useEffect(() => {
    // Load initial fonts if provided
    if (initialFonts) {
      fontManager.setFonts(initialFonts).then(() => {
        updateFontsState();
      }).catch((error) => {
        console.error('Failed to load initial fonts:', error);
      });
    } else {
      updateFontsState();
    }
  }, [initialFonts]);

  const setFonts = async (fontPaths: FontPaths) => {
    try {
      await fontManager.setFonts(fontPaths);
      updateFontsState();
    } catch (error) {
      console.error('Failed to set fonts:', error);
      throw error;
    }
  };

  const setFont = async (type: keyof FontConfig, fontPath: string) => {
    try {
      await fontManager.setFont(type, fontPath);
      updateFontsState();
    } catch (error) {
      console.error('Failed to set font:', error);
      throw error;
    }
  };

  const resetFonts = () => {
    fontManager.resetToDefaults();
    updateFontsState();
  };

  const getFontFamily = (type: keyof FontConfig) => {
    return fontManager.getFontFamily(type);
  };

  const contextValue: FontContextValue = {
    fonts,
    fontsLoaded,
    setFonts,
    setFont,
    resetFonts,
    getFontFamily,
  };

  return (
    <FontContext.Provider value={contextValue}>
      {children}
    </FontContext.Provider>
  );
}

export function useFontContext(): FontContextValue {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFontContext must be used within a FontProvider');
  }
  return context;
}
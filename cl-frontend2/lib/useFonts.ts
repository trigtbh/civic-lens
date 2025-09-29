import { useCallback, useEffect, useState } from 'react';
import { fontManager, type FontConfig, type FontPaths } from './fonts';

export interface UseFontsResult {
  fonts: FontConfig;
  fontsLoaded: boolean;
  setFonts: (fontPaths: FontPaths) => Promise<void>;
  setFont: (type: keyof FontConfig, fontPath: string) => Promise<void>;
  resetFonts: () => void;
  getFontFamily: (type: keyof FontConfig) => string;
}

export function useFonts(): UseFontsResult {
  const [fonts, setFontsState] = useState<FontConfig>(fontManager.getAllFontFamilies());
  const [fontsLoaded, setFontsLoaded] = useState(fontManager.areFontsLoaded());

  const updateFontsState = useCallback(() => {
    setFontsState(fontManager.getAllFontFamilies());
    setFontsLoaded(fontManager.areFontsLoaded());
  }, []);

  useEffect(() => {
    updateFontsState();
  }, [updateFontsState]);

  const setFonts = useCallback(async (fontPaths: FontPaths) => {
    try {
      await fontManager.setFonts(fontPaths);
      updateFontsState();
    } catch (error) {
      console.error('Failed to set fonts:', error);
      throw error;
    }
  }, [updateFontsState]);

  const setFont = useCallback(async (type: keyof FontConfig, fontPath: string) => {
    try {
      await fontManager.setFont(type, fontPath);
      updateFontsState();
    } catch (error) {
      console.error('Failed to set font:', error);
      throw error;
    }
  }, [updateFontsState]);

  const resetFonts = useCallback(() => {
    fontManager.resetToDefaults();
    updateFontsState();
  }, [updateFontsState]);

  const getFontFamily = useCallback((type: keyof FontConfig) => {
    return fontManager.getFontFamily(type);
  }, []);

  return {
    fonts,
    fontsLoaded,
    setFonts,
    setFont,
    resetFonts,
    getFontFamily
  };
}
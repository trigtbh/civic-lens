import { fontManager, type FontPaths } from './fonts';

/**
 * Utility functions for setting fonts from file paths
 */

/**
 * Set fonts from file system paths (for use with expo-file-system or local files)
 * @param fontPaths - Object containing file paths to TTF files
 */
export async function setFontsFromPaths(fontPaths: {
  serif?: string;
  sansSerif?: string;
  monospace?: string;
}): Promise<void> {
  const resolvedPaths: FontPaths = {};

  if (fontPaths.serif) {
    resolvedPaths.serif = fontPaths.serif;
  }
  
  if (fontPaths.sansSerif) {
    resolvedPaths.sansSerif = fontPaths.sansSerif;
  }
  
  if (fontPaths.monospace) {
    resolvedPaths.monospace = fontPaths.monospace;
  }

  await fontManager.setFonts(resolvedPaths);
}

/**
 * Set fonts from asset require statements
 * @param fontAssets - Object containing required font assets
 */
export async function setFontsFromAssets(fontAssets: {
  serif?: any;
  sansSerif?: any;
  monospace?: any;
}): Promise<void> {
  const fontPaths: FontPaths = {};

  if (fontAssets.serif) {
    fontPaths.serif = fontAssets.serif;
  }
  
  if (fontAssets.sansSerif) {
    fontPaths.sansSerif = fontAssets.sansSerif;
  }
  
  if (fontAssets.monospace) {
    fontPaths.monospace = fontAssets.monospace;
  }

  await fontManager.setFonts(fontPaths);
}

/**
 * Set fonts from URIs (remote or local file URIs)
 * @param fontUris - Object containing URIs to TTF files
 */
export async function setFontsFromUris(fontUris: {
  serif?: string;
  sansSerif?: string;
  monospace?: string;
}): Promise<void> {
  const fontPaths: FontPaths = {};

  if (fontUris.serif) {
    fontPaths.serif = fontUris.serif;
  }
  
  if (fontUris.sansSerif) {
    fontPaths.sansSerif = fontUris.sansSerif;
  }
  
  if (fontUris.monospace) {
    fontPaths.monospace = fontUris.monospace;
  }

  await fontManager.setFonts(fontPaths);
}

/**
 * Convenience function to set all three font types from file paths
 */
export async function setAllFontsFromPaths(
  serifPath: string,
  sansSerifPath: string,
  monospacePath: string
): Promise<void> {
  await setFontsFromPaths({
    serif: serifPath,
    sansSerif: sansSerifPath,
    monospace: monospacePath,
  });
}

export {
  // Re-export from fonts module for convenience
  fontManager,
  setCustomFonts,
  setCustomFont,
  getFontFamily,
  getAllFontFamilies,
  resetFontsToDefaults,
  areFontsLoaded,
} from './fonts';
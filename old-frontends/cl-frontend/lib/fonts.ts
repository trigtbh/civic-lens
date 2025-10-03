import * as Font from 'expo-font';
import { Platform } from 'react-native';

export interface FontConfig {
  serif?: string;
  sansSerif?: string;
  monospace?: string;
}

export interface FontPaths {
  serif?: string;
  sansSerif?: string;
  monospace?: string;
}

class FontManager {
  private static instance: FontManager;
  private fontConfig: FontConfig = {};
  private fontsLoaded = false;

  private constructor() {}

  static getInstance(): FontManager {
    if (!FontManager.instance) {
      FontManager.instance = new FontManager();
    }
    return FontManager.instance;
  }

  /**
   * Set custom font paths and load them
   * @param fontPaths - Object containing paths to TTF files for different font types
   */
  async setFonts(fontPaths: FontPaths): Promise<void> {
    const fontMap: Record<string, string> = {};
    const newFontConfig: FontConfig = {};

    // Create font map for loading
    if (fontPaths.serif) {
      fontMap['CustomSerif'] = fontPaths.serif;
      newFontConfig.serif = 'CustomSerif';
    }

    if (fontPaths.sansSerif) {
      fontMap['CustomSansSerif'] = fontPaths.sansSerif;
      newFontConfig.sansSerif = 'CustomSansSerif';
    }

    if (fontPaths.monospace) {
      fontMap['CustomMonospace'] = fontPaths.monospace;
      newFontConfig.monospace = 'CustomMonospace';
    }

    try {
      // Load fonts if any are provided
      if (Object.keys(fontMap).length > 0) {
        await Font.loadAsync(fontMap);
      }

      // Update font configuration
      this.fontConfig = { ...this.fontConfig, ...newFontConfig };
      this.fontsLoaded = true;
    } catch (error) {
      console.error('Failed to load custom fonts:', error);
      throw error;
    }
  }

  /**
   * Get the font family name for a specific type
   * @param type - The font type (serif, sansSerif, monospace)
   * @returns The font family name or default fallback
   */
  getFontFamily(type: keyof FontConfig): string {
    const customFont = this.fontConfig[type];
    
    if (customFont && this.fontsLoaded) {
      return customFont;
    }

    // Return platform-specific defaults
    switch (type) {
      case 'serif':
        return Platform.select({
          ios: 'Times New Roman',
          android: 'serif',
          web: 'Times, serif',
          default: 'serif'
        }) as string;
      
      case 'sansSerif':
        return Platform.select({
          ios: 'Helvetica',
          android: 'sans-serif',
          web: 'Helvetica, Arial, sans-serif',
          default: 'sans-serif'
        }) as string;
      
      case 'monospace':
        return Platform.select({
          ios: 'Courier',
          android: 'monospace',
          web: 'Courier, monospace',
          default: 'monospace'
        }) as string;
      
      default:
        return Platform.select({
          ios: 'Helvetica',
          android: 'sans-serif',
          web: 'Helvetica, Arial, sans-serif',
          default: 'sans-serif'
        }) as string;
    }
  }

  /**
   * Get all current font families
   */
  getAllFontFamilies(): FontConfig {
    return {
      serif: this.getFontFamily('serif'),
      sansSerif: this.getFontFamily('sansSerif'),
      monospace: this.getFontFamily('monospace')
    };
  }

  /**
   * Reset fonts to system defaults
   */
  resetToDefaults(): void {
    this.fontConfig = {};
    this.fontsLoaded = false;
  }

  /**
   * Check if custom fonts are loaded
   */
  areFontsLoaded(): boolean {
    return this.fontsLoaded;
  }

  /**
   * Set individual font by type
   * @param type - The font type
   * @param fontPath - Path to the TTF file
   */
  async setFont(type: keyof FontConfig, fontPath: string): Promise<void> {
    const fontPaths: FontPaths = {};
    fontPaths[type] = fontPath;
    await this.setFonts(fontPaths);
  }
}

// Export singleton instance
export const fontManager = FontManager.getInstance();

// Convenience functions
export const setCustomFonts = (fontPaths: FontPaths) => fontManager.setFonts(fontPaths);
export const setCustomFont = (type: keyof FontConfig, fontPath: string) => fontManager.setFont(type, fontPath);
export const getFontFamily = (type: keyof FontConfig) => fontManager.getFontFamily(type);
export const getAllFontFamilies = () => fontManager.getAllFontFamilies();
export const resetFontsToDefaults = () => fontManager.resetToDefaults();
export const areFontsLoaded = () => fontManager.areFontsLoaded();
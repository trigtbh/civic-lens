import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';

interface SettingsContextType {
  fontScale: number;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  accentColor: {
    label: string;
    value: string;
    hex: string;
  };
  spacingMode: 'compact' | 'comfortable' | 'spacious';
  spacingValues: {
    spacing1: number;
    spacing2: number;
    spacing3: number;
    spacing4: number;
    spacing6: number;
  };
  updateFontScale: (scale: number) => void;
  updateFontSize: (size: 'small' | 'medium' | 'large' | 'xl') => void;
  updateAccentColor: (color: { label: string; value: string; hex: string }) => void;
  updateSpacingMode: (mode: 'compact' | 'comfortable' | 'spacious') => void;
  getScaledFontSize: (baseSize: number) => number;
  getSpacing: (key: keyof SettingsContextType['spacingValues']) => number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [fontScale, setFontScale] = useState(1);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'xl'>('medium');
  const [accentColor, setAccentColor] = useState<{ label: string; value: string; hex: string }>({
    label: 'Blue',
    value: 'blue',
    hex: '#2563EB'
  });
  const [spacingMode, setSpacingMode] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  
  // Set initial CSS custom properties and classes on mount and when fontScale/spacingMode changes
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Set individual font size variables based on current scale
      const baseSizes = {
        xs: 0.75,
        sm: 0.875,
        base: 1,
        lg: 1.125,
        xl: 1.25,
        '2xl': 1.5
      };
      
      Object.entries(baseSizes).forEach(([size, base]) => {
        const scaledSize = base * fontScale;
        document.documentElement.style.setProperty(`--text-${size}`, `${scaledSize}rem`);
      });
      
      // Remove existing spacing classes and add new one
      document.documentElement.classList.remove('spacing-compact', 'spacing-comfortable', 'spacing-spacious');
      document.documentElement.classList.add(`spacing-${spacingMode}`);
    }
  }, [fontScale, spacingMode]);
  
  const spacingModes = {
    compact: {
      spacing1: 4,   // 0.25rem * 16px
      spacing2: 8,   // 0.5rem * 16px
      spacing3: 12,  // 0.75rem * 16px
      spacing4: 16,  // 1rem * 16px
      spacing6: 24   // 1.5rem * 16px
    },
    comfortable: {
      spacing1: 8,   // 0.5rem * 16px
      spacing2: 12,  // 0.75rem * 16px
      spacing3: 16,  // 1rem * 16px
      spacing4: 20,  // 1.25rem * 16px
      spacing6: 32   // 2rem * 16px
    },
    spacious: {
      spacing1: 12,  // 0.75rem * 16px
      spacing2: 16,  // 1rem * 16px
      spacing3: 24,  // 1.5rem * 16px
      spacing4: 32,  // 2rem * 16px
      spacing6: 48   // 3rem * 16px
    }
  };

  const spacingValues = spacingModes[spacingMode];

  const updateFontScale = (scale: number) => {
    setFontScale(scale);
    // Also set global for web compatibility
    if (typeof global !== 'undefined') {
      (global as any).fontScale = scale;
    }
    // Update CSS custom properties for web font scaling
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Set individual font size variables based on scale
      const baseSizes = {
        xs: 0.75,
        sm: 0.875,
        base: 1,
        lg: 1.125,
        xl: 1.25,
        '2xl': 1.5
      };
      
      Object.entries(baseSizes).forEach(([size, base]) => {
        const scaledSize = base * scale;
        document.documentElement.style.setProperty(`--text-${size}`, `${scaledSize}rem`);
      });
      
      console.log('Font scale updated to:', scale);
    }
  };

  const updateFontSize = (size: 'small' | 'medium' | 'large' | 'xl') => {
    setFontSize(size);
    // Update font scale based on size
    const scaleMap = {
      small: 0.875,
      medium: 1,
      large: 1.125,
      xl: 1.25
    };
    setFontScale(scaleMap[size]);
  };

  const updateAccentColor = (color: { label: string; value: string; hex: string }) => {
    setAccentColor(color);
  };

  const updateSpacingMode = (mode: 'compact' | 'comfortable' | 'spacious') => {
    setSpacingMode(mode);
    // Also set global for web compatibility
    if (typeof global !== 'undefined') {
      (global as any).spacingMode = spacingModes[mode];
    }
    // Update CSS classes for web spacing
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const root = document.documentElement;
      // Remove existing spacing classes
      root.classList.remove('spacing-compact', 'spacing-comfortable', 'spacing-spacious');
      // Add new spacing class
      root.classList.add(`spacing-${mode}`);
    }
  };

  const getScaledFontSize = (baseSize: number) => {
    return baseSize * fontScale;
  };

  const getSpacing = (key: keyof SettingsContextType['spacingValues']) => {
    return spacingValues[key];
  };

  return (
    <SettingsContext.Provider
      value={{
        fontScale,
        fontSize,
        accentColor,
        spacingMode,
        spacingValues,
        updateFontScale,
        updateFontSize,
        updateAccentColor,
        updateSpacingMode,
        getScaledFontSize,
        getSpacing,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
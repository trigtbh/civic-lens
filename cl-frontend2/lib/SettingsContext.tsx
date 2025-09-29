import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';

interface SettingsContextType {
  fontScale: number;
  spacingMode: 'compact' | 'comfortable' | 'spacious';
  spacingValues: {
    spacing1: number;
    spacing2: number;
    spacing3: number;
    spacing4: number;
    spacing6: number;
  };
  updateFontScale: (scale: number) => void;
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
  const [spacingMode, setSpacingMode] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  
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
      global.fontScale = scale;
    }
  };

  const updateSpacingMode = (mode: 'compact' | 'comfortable' | 'spacious') => {
    setSpacingMode(mode);
    // Also set global for web compatibility
    if (typeof global !== 'undefined') {
      global.spacingMode = spacingModes[mode];
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
        spacingMode,
        spacingValues,
        updateFontScale,
        updateSpacingMode,
        getScaledFontSize,
        getSpacing,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
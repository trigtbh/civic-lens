import React from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useSettings } from './SettingsContext';
import { useColorScheme } from 'nativewind';
import { Platform } from 'react-native';

interface DynamicThemeProviderProps {
  children: React.ReactNode;
}

// Helper function to convert hex to HSL
const hexToHsl = (hex: string): string => {
  // Remove the hash symbol if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export const DynamicThemeProvider: React.FC<DynamicThemeProviderProps> = ({ children }) => {
  const { accentColor } = useSettings();
  const { colorScheme } = useColorScheme();

  const theme = React.useMemo(() => {
    const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: accentColor.hex,
      },
    };
  }, [accentColor.hex, colorScheme]);

  // Update CSS custom properties for web
  React.useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const primaryHsl = hexToHsl(accentColor.hex);
      document.documentElement.style.setProperty('--primary', primaryHsl);
      
      // Also update accent color for consistency
      document.documentElement.style.setProperty('--accent', primaryHsl);
    }
  }, [accentColor.hex]);

  return (
    <ThemeProvider value={theme}>
      {children}
    </ThemeProvider>
  );
};
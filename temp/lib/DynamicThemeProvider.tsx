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

  // Parse HSL either from 'hsl(221 36% 26%)' or '221 36% 26%'
  const parseHslParts = (input: string) => {
    if (!input) return null;
    let m = input.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
    if (!m) m = input.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
    if (!m) return null;
    return { h: parseInt(m[1], 10), s: parseInt(m[2], 10), l: parseInt(m[3], 10) };
  };

  // Helper to decide a readable foreground (black/white) against a given HSL string.
  // Uses a luminance-based contrast check and applies a small bias toward white.
  const readableForeground = (hsl: string): string => {
    const parts = parseHslParts(hsl);
    if (!parts) return '0 0% 98%';

    // Convert HSL to sRGB (0..1)
    const h = parts.h / 360;
    const s = parts.s / 100;
    const l = parts.l / 100;

    let r: number, g: number, b: number;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const hue2rgb = (pVal: number, qVal: number, tVal: number) => {
        let t = tVal;
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return pVal + (qVal - pVal) * 6 * t;
        if (t < 1 / 2) return qVal;
        if (t < 2 / 3) return pVal + (qVal - pVal) * (2 / 3 - t) * 6;
        return pVal;
      };
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    // Convert sRGB to linear luminance (approx per perceptual model)
    const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

    // Contrast ratios against white and black
    const contrastWithWhite = (1 + 0.05) / (L + 0.05);
    const contrastWithBlack = (L + 0.05) / (0 + 0.05);

    // Bias factor >1 makes white be chosen earlier; tweak to taste (1.15 -> more sensitive)
    const biasTowardWhite = 1.15;

    // Return HSL parts for chosen foreground (keeps same format used elsewhere)
    return contrastWithWhite * biasTowardWhite >= contrastWithBlack ? '0 0% 98%' : '0 0% 9%';
  };

  // Lighten HSL by percentage points; returns raw 'h s% l%'
  const lightenHslString = (hsl: string, amount = 15) => {
    const parts = parseHslParts(hsl);
    if (!parts) return hsl;
    const { h, s, l } = parts;
    const nl = Math.min(100, l + amount);
    return `${h} ${s}% ${nl}%`;
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

      // Compute a lighter highlight color from primary/accent and set it
      const highlightHsl = lightenHslString(primaryHsl, 18);
      document.documentElement.style.setProperty('--highlight', highlightHsl);

      // Compute accent-foreground (readable text over accent/highlight)
      const accentFg = readableForeground(primaryHsl);
      document.documentElement.style.setProperty('--accent-foreground', accentFg);

      // Also set these on common portal/root hosts to support portals
      const portalIds = ['root', 'portal-root', 'modal-root', 'app-root'];
      portalIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.style.setProperty('--primary', primaryHsl);
          el.style.setProperty('--accent', primaryHsl);
          el.style.setProperty('--highlight', highlightHsl);
          el.style.setProperty('--accent-foreground', accentFg);
        }
      });

      // Debug logging (only in development) to help verify values in the browser console
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.info('[DynamicThemeProvider] theme vars set:', {
          primaryHsl,
          highlightHsl,
          accentFg,
        });
      }
    }
  }, [accentColor.hex]);

  return (
    <ThemeProvider value={theme}>
      {children}
    </ThemeProvider>
  );
};
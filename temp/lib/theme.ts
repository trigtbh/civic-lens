import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { fontManager } from './fonts'; 
 

export const createTheme = (accentColor: string = '#2563EB') => ({
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(0 0% 3.9%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(0 0% 3.9%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(0 0% 3.9%)',
    primary: accentColor,
    primaryForeground: 'hsl(0 0% 98%)',
    secondary: 'hsl(0 0% 96.1%)',
    secondaryForeground: 'hsl(0 0% 9%)',
    muted: 'hsl(0 0% 96.1%)',
    mutedForeground: 'hsl(0 0% 45.1%)',
    accent: 'hsl(0 0% 96.1%)',
    accentForeground: 'hsl(0 0% 9%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    border: 'hsl(0 0% 89.8%)',
    input: 'hsl(0 0% 89.8%)',
    ring: 'hsl(0 0% 63%)',
    radius: '0.625rem',
    chart1: 'hsl(12 76% 61%)',
    chart2: 'hsl(173 58% 39%)',
    chart3: 'hsl(197 37% 24%)',
    chart4: 'hsl(43 74% 66%)',
    chart5: 'hsl(27 87% 67%)',
     // Font families

    fontSerif: () => fontManager.getFontFamily('serif'),

    fontSans: () => fontManager.getFontFamily('sansSerif'),

    fontMono: () => fontManager.getFontFamily('monospace'),

  },
  dark: {
    background: 'hsl(0 0% 3.9%)',
    foreground: 'hsl(0 0% 98%)',
    card: 'hsl(0 0% 3.9%)',
    cardForeground: 'hsl(0 0% 98%)',
    popover: 'hsl(0 0% 3.9%)',
    popoverForeground: 'hsl(0 0% 98%)',
    primary: accentColor,
    primaryForeground: 'hsl(0 0% 9%)',
    secondary: 'hsl(0 0% 14.9%)',
    secondaryForeground: 'hsl(0 0% 98%)',
    muted: 'hsl(0 0% 14.9%)',
    mutedForeground: 'hsl(0 0% 63.9%)',
    accent: 'hsl(0 0% 14.9%)',
    accentForeground: 'hsl(0 0% 98%)',
    destructive: 'hsl(0 70.9% 59.4%)',
    border: 'hsl(0 0% 14.9%)',
    input: 'hsl(0 0% 14.9%)',
    ring: 'hsl(300 0% 45%)',
    radius: '0.625rem',
    chart1: 'hsl(220 70% 50%)',
    chart2: 'hsl(160 60% 45%)',
    chart3: 'hsl(30 80% 55%)',
    chart4: 'hsl(280 65% 60%)',
    chart5: 'hsl(340 75% 55%)',
     // Font families

    fontSerif: () => fontManager.getFontFamily('serif'),

    fontSans: () => fontManager.getFontFamily('sansSerif'),

    fontMono: () => fontManager.getFontFamily('monospace'),

  },
});

// Legacy THEME for backward compatibility
export const THEME = createTheme();

// Function to create NAV_THEME with dynamic accent color
export const createNavTheme = (accentColor: string = '#2563EB'): Record<'light' | 'dark', Theme> => {
  const dynamicTheme = createTheme(accentColor);
  return {
    light: {
      ...DefaultTheme,
      colors: {
        background: dynamicTheme.light.background,
        border: dynamicTheme.light.border,
        card: dynamicTheme.light.card,
        notification: dynamicTheme.light.destructive,
        primary: dynamicTheme.light.primary,
        text: dynamicTheme.light.foreground,
      },
    },
    dark: {
      ...DarkTheme,
      colors: {
        background: dynamicTheme.dark.background,
        border: dynamicTheme.dark.border,
        card: dynamicTheme.dark.card,
        notification: dynamicTheme.dark.destructive,
        primary: dynamicTheme.dark.primary,
        text: dynamicTheme.dark.foreground,
      },
    },
  };
};
 
export const NAV_THEME: Record<'light' | 'dark', Theme> = createNavTheme();
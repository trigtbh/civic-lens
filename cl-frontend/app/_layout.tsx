import '@/global.css';
import '@/styles/settings.css';

import { NAV_THEME } from '@/lib/theme';
import { FontProvider } from '@/lib/FontProvider';
import { SettingsProvider } from '@/lib/SettingsContext';
import { DynamicThemeProvider } from '@/lib/DynamicThemeProvider';
import { setCustomFonts } from '@/lib/fontUtils';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Preload fonts
        await setCustomFonts({
          serif: require('@/assets/fonts/Merriweather-VariableFont_opsz,wdth,wght.ttf'),
          sansSerif: require('@/assets/fonts/Gantari-VariableFont_wght.ttf'),
          // Add other fonts here as needed
        });
      } catch (e) {
        console.warn('Failed to load fonts:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Hide the splash screen once the app is ready
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // Keep splash screen visible
  }

  return (
    <SettingsProvider>
      <FontProvider>
        <DynamicThemeProvider>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          {/* Disable default screen animations so navigation appears immediately */}
          <Stack screenOptions={{ animation: 'none' }} />
          <PortalHost />
        </DynamicThemeProvider>
      </FontProvider>
    </SettingsProvider>
  );
}

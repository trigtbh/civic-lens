import { Stack, useRouter } from 'expo-router';
import { CreateAccount } from '@/components/CreateAccount';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View, LayoutAnimation, Platform, UIManager } from 'react-native';

const SCREEN_OPTIONS = {
  light: {
    title: 'Create Account',
    headerTransparent: false,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.light.background },
    headerShown: false,
  // no animation
  },
  dark: {
    title: 'Create Account',
    headerTransparent: false,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.dark.background },
    headerShown: false,
  // no animation
  },
};

export default function CreateAccountScreen() {
  const { colorScheme } = useColorScheme();

  // No manual fade; show immediately

  const handleLanguageSelected = (language: any) => {
    console.log('Language selected:', language);
    // Here you could save to AsyncStorage or your app's state management
  };

  const router = useRouter();

  const handleNext = () => {
    // Animate layout change then navigate
    try { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); } catch (e) {}
    router.push('/main-app' as any);
  };

  // Enable LayoutAnimation on Android
  React.useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* cast options as any to allow animation string values */}
      <Stack.Screen options={SCREEN_OPTIONS[colorScheme ?? 'light'] as any} />
      <CreateAccount 
        onLanguageSelected={handleLanguageSelected}
        onNext={handleNext}
      />
    </View>
  );
}
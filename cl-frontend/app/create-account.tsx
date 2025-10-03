import { Stack } from 'expo-router';
import { CreateAccount } from '@/components/CreateAccount';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Animated } from 'react-native';

const SCREEN_OPTIONS = {
  light: {
    title: 'Create Account',
    headerTransparent: false,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.light.background },
    headerShown: false,
    // use a fade animation when this screen appears
    animation: 'fade',
  },
  dark: {
    title: 'Create Account',
    headerTransparent: false,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.dark.background },
    headerShown: false,
    animation: 'fade',
  },
};

export default function CreateAccountScreen() {
  const { colorScheme } = useColorScheme();

  // Animated opacity for a manual fade-in effect
  const opacity = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const handleLanguageSelected = (language: any) => {
    console.log('Language selected:', language);
    // Here you could save to AsyncStorage or your app's state management
  };

  const handleNext = () => {
    console.log('Proceeding to next step');
    // Here you could navigate to the next step in the onboarding flow
  };

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      {/* cast options as any to allow animation string values */}
      <Stack.Screen options={SCREEN_OPTIONS[colorScheme ?? 'light'] as any} />
      <CreateAccount 
        onLanguageSelected={handleLanguageSelected}
        onNext={handleNext}
      />
    </Animated.View>
  );
}
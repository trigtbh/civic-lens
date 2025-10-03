import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { Stack, Redirect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View, ScrollView, Animated } from 'react-native';
import { useSettings } from '@/lib/SettingsContext';
import { useRouter } from 'expo-router';

const SCREEN_OPTIONS = {
  light: {
    title: 'Civic Lens',
    headerTransparent: true,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.light.background },
    headerShown: false,
  },
  dark: {
    title: 'Civic Lens',
    headerTransparent: true,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.dark.background },
    headerShown: false,
  },
};

export default function LandingPage() {
  const { colorScheme } = useColorScheme();
  const { showMainApp } = useSettings(); // CHANGE THIS!
  const router = useRouter();
  // Animated opacity for fade-out when navigating away
  const opacity = React.useRef(new Animated.Value(1)).current;

  const handleGetStarted = () => {
    // Fade out, then navigate when animation completes
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.push('/create-account');
      // reset opacity back to 1 in case user navigates back
      opacity.setValue(1);
    });
  };

  // If showMainApp is true, redirect to the main app page
  if (showMainApp) {
    return <Redirect href="/main-app" />;
  }

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <Stack.Screen options={SCREEN_OPTIONS[colorScheme ?? 'light']} />
      <ScrollView className="flex-1">
        <View className="flex-1 items-center justify-center gap-6 p-8">
          {/* Hero Section */}
          <View className="items-center gap-4 mt-12">
            <Text className="text-4xl font-bold text-center">
              Welcome to Civic Lens
            </Text>
            <Text className="text-lg text-center text-muted-foreground max-w-md">
              Your gateway to understanding civic information and engaging with your community.
            </Text>
          </View>

          {/* Feature Highlights */}
          <View className="gap-4 w-full max-w-md mt-8">
            <View className="p-4 bg-card rounded-lg border">
              <Text className="text-xl font-semibold mb-2">📊 Track Legislation</Text>
              <Text className="text-muted-foreground">
                Stay informed about bills and policies that affect your community.
              </Text>
            </View>

            <View className="p-4 bg-card rounded-lg border">
              <Text className="text-xl font-semibold mb-2">🌍 Local Information</Text>
              <Text className="text-muted-foreground">
                Access relevant local government information and resources.
              </Text>
            </View>

            <View className="p-4 bg-card rounded-lg border">
              <Text className="text-xl font-semibold mb-2">🔔 Get Notified</Text>
              <Text className="text-muted-foreground">
                Receive updates on topics and issues that matter to you.
              </Text>
            </View>
          </View>

          {/* Call to Action */}
          <View className="gap-3 w-full max-w-md mt-8 mb-12">
            <Button className="w-full" onPress={handleGetStarted}>
              <Text>Get Started</Text>
            </Button>
            <Button variant="outline" className="w-full">
              <Text>Learn More</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

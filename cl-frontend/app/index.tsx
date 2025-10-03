import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { THEME } from '@/lib/theme';
import { Stack, Redirect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { GlobeIcon } from 'lucide-react-native';
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
  const handleGetStarted = () => {
    // Navigate immediately to the create-account flow (no fade)
    router.push('/create-account');
  };

  // If showMainApp is true, redirect to the main app page
  if (showMainApp) {
    return <Redirect href="/main-app" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={SCREEN_OPTIONS[colorScheme ?? 'light']} />
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center items-center p-6">
            <View className="w-full max-w-md">
              {/* Header */}
              <View className="items-center mb-8">
                <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-4">
                  <Icon as={GlobeIcon} size={32} className="text-primary-foreground" />
                </View>
                <Text variant="h2" className="text-center mb-2">Welcome to Civic Lens</Text>
                <Text variant="muted" className="text-center">Your gateway to understanding civic information and engaging with your community.</Text>
              </View>

              {/* Feature Highlights */}
              <View className="gap-4">
                <Card>
                  <CardContent>
                    <Text className="text-xl font-semibold mb-2">📊 Track Legislation</Text>
                    <Text className="text-muted-foreground">Stay informed about bills and policies that affect your community.</Text>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Text className="text-xl font-semibold mb-2">🌍 Local Information</Text>
                    <Text className="text-muted-foreground">Access relevant local government information and resources.</Text>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Text className="text-xl font-semibold mb-2">🔔 Get Notified</Text>
                    <Text className="text-muted-foreground">Receive updates on topics and issues that matter to you.</Text>
                  </CardContent>
                </Card>
              </View>

              {/* Call to Action */}
              <View className="gap-3 w-full mt-8 mb-12">
                <Button className="w-full" onPress={handleGetStarted}>
                  <Text className="font-medium">Get Started</Text>
                </Button>
                <Button variant="outline" className="w-full">
                  <Text className="font-medium">Learn More</Text>
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

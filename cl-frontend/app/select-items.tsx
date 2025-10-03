import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { ScrollView, SafeAreaView, View, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { GlobeIcon } from 'lucide-react-native';

const SCREEN_OPTIONS = {
  light: {
    title: 'Select Items',
    headerTransparent: false,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.light.background },
    headerShown: false,
  // no animation
  },
  dark: {
    title: 'Select Items',
    headerTransparent: false,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.dark.background },
    headerShown: false,
  // no animation
  },
};

const SAMPLE_ITEMS = [
  { id: 'item1', title: 'Neighborhood Watch', description: 'Local safety and events' },
  { id: 'item2', title: 'Transportation', description: 'Public transit updates' },
  { id: 'item3', title: 'Education', description: 'School board and policies' },
];

export default function SelectItemsScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  // No animated fade-in; show immediately
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});

  // Detect RTL from document/navigator/localStorage similar to CreateAccount
  const isRtlLang = React.useMemo(() => {
    const rtl = new Set(['ar', 'fa', 'he', 'ur']);
    let code: string | undefined;
    try {
      if (typeof localStorage !== 'undefined') code = localStorage.getItem('preferredLanguage') || undefined;
    } catch (e) {}
    try {
      if (!code && typeof document !== 'undefined' && document.documentElement?.lang) code = document.documentElement.lang;
    } catch (e) {}
    try {
      if (!code) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nav = (typeof navigator !== 'undefined' ? (navigator as any).language || (navigator as any).userLanguage : undefined) as string | undefined;
        if (nav) code = nav;
      }
    } catch (e) {}
    if (!code) return false;
    return rtl.has(code.split('-')[0]);
  }, []);

  const toggle = (id: string) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleContinue = () => {
    const chosen = SAMPLE_ITEMS.filter(i => selected[i.id]);
    console.log('Selected items:', chosen);
    // Animate then navigate
    try { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); } catch (e) {}
    router.push('/create-account/final' as any);
  };

  // Enable LayoutAnimation on Android
  React.useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={SCREEN_OPTIONS[colorScheme ?? 'light'] as any} />
      <SafeAreaView className="flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center p-6">
          <View className="w-full max-w-md">
            {/* Header */}
            <View className={`${isRtlLang ? 'items-end' : 'items-center'} mb-6`}> 
              <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-4">
                <Icon as={GlobeIcon} size={32} className="text-primary-foreground" />
              </View>
              <Text variant="h2" className={`${isRtlLang ? 'text-right' : 'text-center'} mb-2`}>Choose topics you're interested in</Text>
              <Text variant="muted" className={`${isRtlLang ? 'text-right' : 'text-center'}`}>You can pick multiple items</Text>
            </View>

            {/* Single card containing many items rendered as oval chips */}
            <Card>
              <CardContent>
                <View className={`${isRtlLang ? 'flex-row-reverse' : 'flex-row'} flex-wrap gap-3 justify-center items-center`}>
                  {SAMPLE_ITEMS.map(item => {
                    const isSelected = !!selected[item.id];
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => toggle(item.id)}
                        className={
                          `px-4 py-2 rounded-full border items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'bg-card border-border'}`
                        }
                      >
                        <Text className={`${isSelected ? 'text-primary-foreground' : ''}`}>{item.title}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </CardContent>
            </Card>

            <View className="mt-6">
              <Button className="w-full" onPress={handleContinue}>
                <Text className="font-medium">Continue</Text>
              </Button>
            </View>
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

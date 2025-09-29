import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { Link, Stack } from 'expo-router';
import { MenuIcon, MoonStarIcon, StarIcon, SunIcon, HomeIcon, SettingsIcon, XIcon, InfoIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Image, type ImageStyle, View, ScrollView, Modal, Pressable, Dimensions } from 'react-native';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const SCREEN_OPTIONS = {
  light: {
    headerTransparent: true,
    headerShadowVisible: false,
    headerStyle: { backgroundColor: THEME.light.background },
    headerTitleAlign: 'center' as const,
    headerTitle: () => <HeaderTitle />,
    headerLeft: () => <SettingsMenu />,
    headerRight: () => <ThemeToggle />,
  },
  dark: {
    headerTransparent: true,
    headerShadowVisible: false,
    headerStyle: { backgroundColor: THEME.dark.background },
    headerTitleAlign: 'center' as const,
    headerTitle: () => <HeaderTitle />,
    headerLeft: () => <SettingsMenu />,
    headerRight: () => <ThemeToggle />,
  },
};

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

// Global settings menu state
let globalToggleSettings: (() => void) | null = null;


export default function Screen() {
  const { colorScheme } = useColorScheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  // Set global toggle function
  React.useEffect(() => {
    globalToggleSettings = toggleSettings;
    return () => {
      globalToggleSettings = null;
    };
  }, [isSettingsOpen]);

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS[colorScheme ?? 'light']} />
      <View className="flex-1 items-center justify-center gap-8 p-4">
        <Image source={LOGO[colorScheme ?? 'light']} style={IMAGE_STYLE} resizeMode="contain" />
        <View className="items-center gap-4">
          <View className="flex-row items-center gap-3">
            <Icon as={HomeIcon} className="size-6 text-primary" />
            <Text 
              style={{ fontFamily: THEME[colorScheme ?? 'light'].fontSerif() }}
              className="text-2xl font-semibold text-foreground"
            >
              Welcome to Civic Lens
            </Text>
          </View>
        </View>
        <View className="gap-2 p-4">
          <Text className="ios:text-foreground font-mono text-sm text-muted-foreground">
            1. Edit <Text variant="code">app/index.tsx</Text> to get started.
          </Text>
          <Text className="ios:text-foreground font-mono text-sm text-muted-foreground">
            2. Save to see your changes instantly.
          </Text>
        </View>
        <View className="flex-row gap-2">
          <Link href="https://reactnativereusables.com" asChild>
            <Button>
              <Text>Browse the Docs</Text>
            </Button>
          </Link>
          <Link href="https://github.com/founded-labs/react-native-reusables" asChild>
            <Button variant="ghost">
              <Text>Star the Repo</Text>
              <Icon as={StarIcon} />
            </Button>
          </Link>
        </View>
      </View>
      <SettingsCard isOpen={isSettingsOpen} onClose={closeSettings} />
    </>
  );
}

function HeaderTitle() {
  const { colorScheme } = useColorScheme();
  
  return (
    <View className="flex-row items-center gap-2">
      <Icon as={HomeIcon} className="size-5 text-primary" />
      <Text 
        style={{ 
          fontFamily: THEME[colorScheme ?? 'light'].fontSerif(),
          fontSize: 20,
          fontWeight: '600',
          color: THEME[colorScheme ?? 'light'].foreground
        }}
      >
        Civic Lens
      </Text>
    </View>
  );
}

function SettingsCard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { colorScheme } = useColorScheme();
  const [selectedCategory, setSelectedCategory] = useState('appearance');
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const isNarrowScreen = screenDimensions.width < 640; // Tailwind's sm breakpoint

  const categories = [
    { id: 'appearance', label: 'Appearance', icon: SunIcon },
    { id: 'privacy', label: 'Privacy', icon: SettingsIcon },
    { id: 'about', label: 'About', icon: InfoIcon },
  ];

  const settingsContent = {
    appearance: [
      { label: 'Theme', value: 'Auto', onPress: () => console.log('Theme pressed') },
      { label: 'Font Size', value: 'Medium', onPress: () => console.log('Font Size pressed') },
      { label: 'Color Scheme', value: 'Default', onPress: () => console.log('Color Scheme pressed') },
      { label: 'Display Mode', value: 'Comfortable', onPress: () => console.log('Display Mode pressed') },
    ],
    privacy: [
      { label: 'Data Collection', value: 'Enabled', onPress: () => console.log('Data Collection pressed') },
      { label: 'Location Services', value: 'Disabled', onPress: () => console.log('Location pressed') },
      { label: 'Analytics', value: 'Anonymous', onPress: () => console.log('Analytics pressed') },
      { label: 'Cookies', value: 'Essential Only', onPress: () => console.log('Cookies pressed') },
    ],
    about: [
      { label: 'Version', value: '1.0.0', onPress: () => console.log('Version pressed') },
      { label: 'Help & Support', value: '', onPress: () => console.log('Help pressed') },
      { label: 'Terms of Service', value: '', onPress: () => console.log('Terms pressed') },
      { label: 'Privacy Policy', value: '', onPress: () => console.log('Privacy Policy pressed') },
      { label: 'Licenses', value: '', onPress: () => console.log('Licenses pressed') },
    ],
  };

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className={`bg-background rounded-2xl w-full ${isNarrowScreen ? 'max-w-sm' : 'max-w-4xl'} max-h-[85%] border border-border overflow-hidden`}>
          {isNarrowScreen ? (
            /* Mobile/Narrow Screen Layout */
            <View className="flex-col h-full">
              {/* Header with tabs */}
              <View className="border-b border-border">
                <View className="flex-row items-center justify-between p-4 border-b border-border">
                  <View className="flex-row items-center gap-2">
                    <Icon as={SettingsIcon} className="size-5 text-primary" />
                    <Text 
                      style={{ fontFamily: THEME[colorScheme ?? 'light'].fontSerif() }}
                      className="text-lg font-semibold text-foreground"
                    >
                      Settings
                    </Text>
                  </View>
                  <Button
                    onPress={onClose}
                    size="icon"
                    variant="ghost"
                    className="rounded-full"
                  >
                    <Icon as={XIcon} className="size-5" />
                  </Button>
                </View>
                
                {/* Tab Navigation */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2 py-3">
                  <View className="flex-row gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        size="sm"
                        className={`flex-row items-center gap-2 px-4 py-2 rounded-full ${
                          selectedCategory === category.id ? 'bg-primary' : 'bg-muted/30'
                        }`}
                        onPress={() => setSelectedCategory(category.id)}
                      >
                        <Icon 
                          as={category.icon} 
                          className={`size-4 ${
                            selectedCategory === category.id ? 'text-primary-foreground' : 'text-muted-foreground'
                          }`} 
                        />
                        <Text 
                          className={`text-sm font-medium ${
                            selectedCategory === category.id ? 'text-primary-foreground' : 'text-foreground'
                          }`}
                        >
                          {category.label}
                        </Text>
                      </Button>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Content Area */}
              <ScrollView className="flex-1 p-4">
                <View className="space-y-2">
                  {settingsContent[selectedCategory as keyof typeof settingsContent]?.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="flex-row justify-between items-center p-4 rounded-lg bg-muted/20 border border-border/50"
                      onPress={() => {
                        item.onPress();
                      }}
                    >
                      <Text className="text-base text-foreground">{item.label}</Text>
                      {item.value && (
                        <Text className="text-sm text-muted-foreground">{item.value}</Text>
                      )}
                    </Button>
                  ))}
                </View>
              </ScrollView>

              {/* Footer */}
              <View className="p-4 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full"
                  onPress={onClose}
                >
                  <Text>Done</Text>
                </Button>
              </View>
            </View>
          ) : (
            /* Desktop/Wide Screen Layout */
            <View className="flex-row h-full">
              {/* Sidebar */}
              <View className="w-48 bg-muted/30 border-r border-border">
                {/* Sidebar Header */}
                <View className="p-4 border-b border-border">
                  <View className="flex-row items-center gap-2">
                    <Icon as={SettingsIcon} className="size-5 text-primary" />
                    <Text 
                      style={{ fontFamily: THEME[colorScheme ?? 'light'].fontSerif() }}
                      className="text-lg font-semibold text-foreground"
                    >
                      Settings
                    </Text>
                  </View>
                </View>

                {/* Category List */}
                <ScrollView className="flex-1 p-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className={`flex-row justify-start items-center gap-3 p-3 mb-1 rounded-lg ${
                        selectedCategory === category.id ? 'bg-primary' : ''
                      }`}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <Icon 
                        as={category.icon} 
                        className={`size-4 ${
                          selectedCategory === category.id ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`} 
                      />
                      <Text 
                        className={`text-sm ${
                          selectedCategory === category.id ? 'text-primary-foreground font-medium' : 'text-foreground'
                        }`}
                      >
                        {category.label}
                      </Text>
                    </Button>
                  ))}
                </ScrollView>
              </View>

              {/* Main Content */}
              <View className="flex-1 flex-col">
                {/* Main Header */}
                <View className="flex-row items-center justify-between p-6 border-b border-border">
                  <Text 
                    style={{ fontFamily: THEME[colorScheme ?? 'light'].fontSerif() }}
                    className="text-xl font-semibold text-foreground capitalize"
                  >
                    {categories.find(cat => cat.id === selectedCategory)?.label}
                  </Text>
                  <Button
                    onPress={onClose}
                    size="icon"
                    variant="ghost"
                    className="rounded-full"
                  >
                    <Icon as={XIcon} className="size-5" />
                  </Button>
                </View>

                {/* Content Area */}
                <ScrollView className="flex-1 p-6">
                  <View className="space-y-2">
                    {settingsContent[selectedCategory as keyof typeof settingsContent]?.map((item, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="flex-row justify-between items-center p-4 rounded-lg bg-muted/20 border border-border/50"
                        onPress={() => {
                          item.onPress();
                        }}
                      >
                        <Text className="text-base text-foreground">{item.label}</Text>
                        {item.value && (
                          <Text className="text-sm text-muted-foreground">{item.value}</Text>
                        )}
                      </Button>
                    ))}
                  </View>
                </ScrollView>

                {/* Footer */}
                <View className="p-6 border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full"
                    onPress={onClose}
                  >
                    <Text>Done</Text>
                  </Button>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function SettingsMenu() {
  const handleSettingsPress = () => {
    console.log('Settings button pressed');
    if (globalToggleSettings) {
      globalToggleSettings();
    }
  };

  return (
    <Button
      onPress={handleSettingsPress}
      size="icon"
      variant="ghost"
      className="rounded-full web:mx-4">
      <Icon as={SettingsIcon} className="size-5" />
    </Button>
  );
}

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}

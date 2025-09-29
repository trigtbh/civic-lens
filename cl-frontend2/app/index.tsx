import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsCard } from '@/components/SettingsCard';
import { useSettings } from '@/lib/SettingsContext';
import { THEME } from '@/lib/theme';
import { Link, Stack } from 'expo-router';
import { MenuIcon, MoonStarIcon, StarIcon, SunIcon, HomeIcon, SettingsIcon, XIcon, InfoIcon, ChevronRightIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Image, type ImageStyle, View, ScrollView, Modal, Dimensions } from 'react-native';

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
  const { getScaledFontSize, getSpacing } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // ===== SAMPLE STATE FOR DEMONSTRATING COMPONENTS =====
  const [switchValue, setSwitchValue] = useState(false);
  const [selectValue, setSelectValue] = useState('option1');
  const [modalVisible, setModalVisible] = useState(false);
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

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

  // ===== USEEFFECT SAMPLE - DIMENSIONS LISTENER =====
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS[colorScheme ?? 'light']} />
      <ScrollView className="flex-1 p-4">
        {/* ===== ORIGINAL CONTENT ===== */}
        <View className="items-center justify-center gap-8 py-8">
          <Image source={LOGO[colorScheme ?? 'light']} style={IMAGE_STYLE} resizeMode="contain" />
          <View className="items-center gap-4">
            <View className="flex-row items-center gap-3">
              <Icon as={HomeIcon} className="size-6 text-primary" />
              <Text 
                style={{ 
                  fontFamily: THEME[colorScheme ?? 'light'].fontSerif(),
                  fontSize: getScaledFontSize(24)
                }}
                className="font-semibold text-foreground"
              >
                Welcome to Civic Lens
              </Text>
            </View>
          </View>
          <View className="gap-2 p-4">
            <Text 
              style={{ fontSize: getScaledFontSize(14) }}
              className="ios:text-foreground font-mono text-muted-foreground"
            >
              1. Edit <Text variant="code" style={{ fontSize: getScaledFontSize(14) }}>app/index.tsx</Text> to get started.
            </Text>
            <Text 
              style={{ fontSize: getScaledFontSize(14) }}
              className="ios:text-foreground font-mono text-muted-foreground"
            >
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

        {/* ===== COMPONENT SAMPLES SECTION ===== */}
        <View className="gap-8 p-4 border-t border-border">
          <Text 
            style={{ fontSize: getScaledFontSize(20) }}
            className="font-bold text-center text-foreground"
          >
            🧩 Component Samples
          </Text>

          {/* ===== ICON SAMPLES ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ fontSize: getScaledFontSize(18) }}
              className="font-semibold text-foreground"
            >📍 Icon Component Samples</Text>
            <View className="flex-row flex-wrap gap-4 items-center">
              <View className="items-center gap-2">
                <Icon as={SunIcon} className="size-6 text-yellow-500" />
                <Text style={{ fontSize: getScaledFontSize(12) }} className="text-muted-foreground">SunIcon</Text>
              </View>
              <View className="items-center gap-2">
                <Icon as={SettingsIcon} className="size-6 text-blue-500" />
                <Text style={{ fontSize: getScaledFontSize(12) }} className="text-muted-foreground">SettingsIcon</Text>
              </View>
              <View className="items-center gap-2">
                <Icon as={XIcon} className="size-6 text-red-500" />
                <Text style={{ fontSize: getScaledFontSize(12) }} className="text-muted-foreground">XIcon</Text>
              </View>
              <View className="items-center gap-2">
                <Icon as={InfoIcon} className="size-6 text-green-500" />
                <Text style={{ fontSize: getScaledFontSize(12) }} className="text-muted-foreground">InfoIcon</Text>
              </View>
              <View className="items-center gap-2">
                <Icon as={ChevronRightIcon} className="size-6 text-purple-500" />
                <Text style={{ fontSize: getScaledFontSize(12) }} className="text-muted-foreground">ChevronRightIcon</Text>
              </View>
            </View>
          </View>

          {/* ===== TEXT COMPONENT SAMPLES ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ fontSize: getScaledFontSize(18) }}
              className="font-semibold text-foreground"
            >📍 Text Component Samples</Text>
            <View className="gap-3">
              <Text style={{ fontSize: getScaledFontSize(16) }} className="text-foreground">Default Text</Text>
              <Text variant="code" style={{ fontSize: getScaledFontSize(16) }}>Code Variant Text</Text>
              <Text 
                style={{ fontSize: getScaledFontSize(18) }}
                className="font-bold text-primary"
              >Large Bold Primary Text</Text>
              <Text 
                style={{ fontSize: getScaledFontSize(14) }}
                className="text-muted-foreground"
              >Small Muted Text</Text>
            </View>
          </View>

          {/* ===== COLOR SCHEME TEST ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ fontSize: getScaledFontSize(18) }}
              className="font-semibold text-foreground"
            >🎨 Color Scheme Test</Text>
            <View className="gap-3">
              <View className="flex-row gap-3">
                <View className="bg-primary p-4 rounded-lg flex-1">
                  <Text 
                    style={{ fontSize: getScaledFontSize(16) }}
                    className="text-primary-foreground text-center font-bold"
                  >Primary Color</Text>
                </View>
                <View className="bg-accent p-4 rounded-lg flex-1">
                  <Text 
                    style={{ fontSize: getScaledFontSize(16) }}
                    className="text-accent-foreground text-center font-bold"
                  >Accent Color</Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <View className="border border-primary p-3 rounded-lg flex-1">
                  <Text 
                    style={{ fontSize: getScaledFontSize(16) }}
                    className="text-primary text-center"
                  >Primary Border</Text>
                </View>
                <View className="border border-accent p-3 rounded-lg flex-1">
                  <Text 
                    style={{ fontSize: getScaledFontSize(16) }}
                    className="text-accent text-center"
                  >Accent Border</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ===== FONT SIZE TEST ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ fontSize: getScaledFontSize(18) }}
              className="font-semibold text-foreground"
            >📝 Font Size Test</Text>
            <View className="gap-2">
              <Text style={{ fontSize: getScaledFontSize(12) }} className="text-foreground">Extra Small (scaled 12px)</Text>
              <Text style={{ fontSize: getScaledFontSize(14) }} className="text-foreground">Small (scaled 14px)</Text>
              <Text style={{ fontSize: getScaledFontSize(16) }} className="text-foreground">Base (scaled 16px)</Text>
              <Text style={{ fontSize: getScaledFontSize(18) }} className="text-foreground">Large (scaled 18px)</Text>
              <Text style={{ fontSize: getScaledFontSize(20) }} className="text-foreground">Extra Large (scaled 20px)</Text>
              <Text style={{ fontSize: getScaledFontSize(24) }} className="text-foreground">2X Large (scaled 24px)</Text>
            </View>
          </View>

          {/* ===== SWITCH COMPONENT SAMPLE ===== */}
          {/* <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text className="text-lg font-semibold text-foreground">📍 Switch Component Sample</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-foreground">Toggle Switch (Value: {switchValue ? 'ON' : 'OFF'})</Text>
              <Switch
                checked={switchValue}
                onCheckedChange={setSwitchValue}
              />
            </View>
          </View> */}

          {/* ===== SELECT COMPONENT SAMPLE ===== */}
          {/* <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text className="text-lg font-semibold text-foreground">📍 Select Component Sample</Text>
            <View className="gap-3">
              <Text className="text-base text-foreground">Selected Value: {selectValue}</Text>
              <Select 
                value={{ value: selectValue, label: selectValue === 'option1' ? 'Option 1' : selectValue === 'option2' ? 'Option 2' : 'Option 3' }}
                onValueChange={(option) => option && setSelectValue(option.value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem label="Option 1" value="option1">
                    Option 1
                  </SelectItem>
                  <SelectItem label="Option 2" value="option2">
                    Option 2
                  </SelectItem>
                  <SelectItem label="Option 3" value="option3">
                    Option 3
                  </SelectItem>
                </SelectContent>
              </Select>
            </View>
          </View> */}

          {/* ===== MODAL COMPONENT SAMPLE ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ fontSize: getScaledFontSize(18) }}
              className="font-semibold text-foreground"
            >📍 Modal Component Sample</Text>
            <Button onPress={() => setModalVisible(true)}>
              <Text>Open Sample Modal</Text>
            </Button>
          </View>

          {/* ===== SCROLLVIEW SAMPLE ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ fontSize: getScaledFontSize(18) }}
              className="font-semibold text-foreground"
            >📍 ScrollView Sample</Text>
            <Text 
              style={{ fontSize: getScaledFontSize(14) }}
              className="text-muted-foreground"
            >This entire page is wrapped in a ScrollView!</Text>
            <View className="h-32 border border-border rounded-lg">
              <ScrollView className="flex-1 p-3" horizontal>
                <View className="flex-row gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <View key={item} className="w-20 h-20 bg-primary/20 rounded-lg items-center justify-center">
                      <Text 
                        style={{ fontSize: getScaledFontSize(16) }}
                        className="text-foreground font-bold"
                      >{item}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* ===== DIMENSIONS SAMPLE ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ fontSize: getScaledFontSize(18) }}
              className="font-semibold text-foreground"
            >📍 Dimensions Sample</Text>
            <View className="gap-2">
              <Text 
                style={{ fontSize: getScaledFontSize(16) }}
                className="text-foreground"
              >Screen Width: {screenDimensions.width}px</Text>
              <Text 
                style={{ fontSize: getScaledFontSize(16) }}
                className="text-foreground"
              >Screen Height: {screenDimensions.height}px</Text>
              <Text 
                style={{ fontSize: getScaledFontSize(14) }}
                className="text-muted-foreground"
              >Rotate your device to see values change!</Text>
            </View>
          </View>

          {/* ===== USEEFFECT SAMPLE ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ fontSize: getScaledFontSize(18) }}
              className="font-semibold text-foreground"
            >📍 useEffect Sample</Text>
            <Text 
              style={{ fontSize: getScaledFontSize(14) }}
              className="text-muted-foreground"
            >
              useEffect is being used to listen to screen dimension changes. 
              The effect runs when the component mounts and cleans up when it unmounts.
            </Text>
          </View>

          {/* ===== THEME SAMPLE ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ fontSize: getScaledFontSize(18) }}
              className="font-semibold text-foreground"
            >📍 THEME Object Sample</Text>
            <View className="gap-2">
              <Text 
                style={{ 
                  fontFamily: THEME[colorScheme ?? 'light'].fontSerif(),
                  fontSize: getScaledFontSize(16)
                }}
                className="text-foreground"
              >
                This text uses THEME.fontSerif()
              </Text>
              <Text 
                style={{ fontSize: getScaledFontSize(14) }}
                className="text-muted-foreground"
              >
                Current color scheme: {colorScheme ?? 'light'}
              </Text>
            </View>
          </View>

          {/* ===== USECOLORSCHEME SAMPLE ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ fontSize: getScaledFontSize(18) }}
              className="font-semibold text-foreground"
            >📍 useColorScheme Sample</Text>
            <Text 
              style={{ fontSize: getScaledFontSize(14) }}
              className="text-muted-foreground"
            >
              Current color scheme from hook: {colorScheme ?? 'light'}
            </Text>
            <Text 
              style={{ fontSize: getScaledFontSize(14) }}
              className="text-muted-foreground"
            >
              Toggle the theme using the button in the header!
            </Text>
          </View>

          {/* ===== VIEW COMPONENT SAMPLE ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ fontSize: getScaledFontSize(18) }}
              className="font-semibold text-foreground"
            >📍 View Component Sample</Text>
            <Text 
              style={{ fontSize: getScaledFontSize(14) }}
              className="text-muted-foreground"
            >
              Every container you see here is a View component with different styling!
            </Text>
            <View className="flex-row gap-2">
              <View className="flex-1 h-12 bg-red-500/20 rounded-lg items-center justify-center">
                <Text 
                  style={{ fontSize: getScaledFontSize(12) }}
                  className="text-foreground"
                >View 1</Text>
              </View>
              <View className="flex-1 h-12 bg-blue-500/20 rounded-lg items-center justify-center">
                <Text 
                  style={{ fontSize: getScaledFontSize(12) }}
                  className="text-foreground"
                >View 2</Text>
              </View>
              <View className="flex-1 h-12 bg-green-500/20 rounded-lg items-center justify-center">
                <Text 
                  style={{ fontSize: getScaledFontSize(12) }}
                  className="text-foreground"
                >View 3</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ===== MODAL SAMPLE (SHOWN WHEN BUTTON IS PRESSED) ===== */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-background rounded-2xl p-6 w-full max-w-sm border border-border">
            <View className="flex-row items-center justify-between mb-4">
              <Text 
                style={{ fontSize: getScaledFontSize(18) }}
                className="font-semibold text-foreground"
              >Sample Modal</Text>
              <Button
                onPress={() => setModalVisible(false)}
                size="icon"
                variant="ghost"
                className="rounded-full"
              >
                <Icon as={XIcon} className="size-5" />
              </Button>
            </View>
            <Text 
              style={{ fontSize: getScaledFontSize(16) }}
              className="text-muted-foreground mb-4"
            >
              This is a sample modal showing how the Modal component works!
            </Text>
            <Button onPress={() => setModalVisible(false)} className="w-full">
              <Text>Close Modal</Text>
            </Button>
          </View>
        </View>
      </Modal>

      <SettingsCard isOpen={isSettingsOpen} onClose={closeSettings} />
    </>
  );
}

function HeaderTitle() {
  const { colorScheme } = useColorScheme();
  const { getScaledFontSize } = useSettings();
  
  return (
    <View className="flex-row items-center gap-2">
      <Icon as={HomeIcon} className="size-5 text-primary" />
      <Text 
        style={{ 
          fontFamily: THEME[colorScheme ?? 'light'].fontSerif(),
          fontSize: getScaledFontSize(20),
          fontWeight: '600',
          color: THEME[colorScheme ?? 'light'].foreground
        }}
      >
        Civic Lens
      </Text>
    </View>
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

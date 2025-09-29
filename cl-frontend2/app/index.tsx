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
  
  // Default neutral text color with !important to override theme classes
  const neutralTextColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const neutralTextStyle = { color: neutralTextColor, fontStyle: 'normal' };
  
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
              <Icon as={HomeIcon} className="size-6" />
              <Text 
                style={{ 
                  fontFamily: THEME[colorScheme ?? 'light'].fontSerif(),
                  fontSize: getScaledFontSize(24)
                }}
                className="font-semibold"
              >
                Welcome to Civic Lens
              </Text>
            </View>
          </View>
          <View className="gap-2 p-4">
            <Text 
              style={{ fontSize: getScaledFontSize(14) }}
              className="font-mono"
            >
              1. Edit <Text variant="code" style={{ fontSize: getScaledFontSize(14) }}>app/index.tsx</Text> to get started.
            </Text>
            <Text 
              style={{ fontSize: getScaledFontSize(14) }}
              className="font-mono"
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
            style={{ 
              fontSize: getScaledFontSize(20),
              color: neutralTextColor
            }}
            className="font-bold text-center"
          >
            🧩 Component Samples
          </Text>

          {/* ===== ICON SAMPLES ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ 
                fontSize: getScaledFontSize(18),
                color: neutralTextColor
              }}
              className="font-semibold"
            >📍 Icon Component Samples</Text>
            <View className="flex-row flex-wrap gap-4 items-center">
              <View className="items-center gap-2">
                <Icon as={SunIcon} className="size-6" />
                <Text style={{ 
                  fontSize: getScaledFontSize(12),
                  color: neutralTextColor
                }}>SunIcon</Text>
              </View>
              <View className="items-center gap-2">
                <Icon as={SettingsIcon} className="size-6" />
                <Text style={{ 
                  fontSize: getScaledFontSize(12),
                  color: neutralTextColor
                }}>SettingsIcon</Text>
              </View>
              <View className="items-center gap-2">
                <Icon as={XIcon} className="size-6" />
                <Text style={{ 
                  fontSize: getScaledFontSize(12),
                  color: neutralTextColor
                }}>XIcon</Text>
              </View>
              <View className="items-center gap-2">
                <Icon as={InfoIcon} className="size-6" />
                <Text style={{ 
                  fontSize: getScaledFontSize(12),
                  color: neutralTextColor
                }}>InfoIcon</Text>
              </View>
              <View className="items-center gap-2">
                <Icon as={ChevronRightIcon} className="size-6" />
                <Text style={{ 
                  fontSize: getScaledFontSize(12),
                  color: neutralTextColor
                }}>ChevronRightIcon</Text>
              </View>
            </View>
          </View>

          {/* ===== TEXT COMPONENT SAMPLES ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ 
                fontSize: getScaledFontSize(18),
                color: neutralTextColor
              }}
              className="font-semibold"
            >📍 Text Component Samples</Text>
            <View className="gap-3">
              <Text style={{ 
                fontSize: getScaledFontSize(16),
                color: neutralTextColor
              }}>Default Text</Text>
              <Text variant="code" style={{ fontSize: getScaledFontSize(16) }}>Code Variant Text</Text>
              <Text 
                style={{ 
                  fontSize: getScaledFontSize(18),
                  color: neutralTextColor
                }}
                className="font-bold"
              >Large Bold Text</Text>
              <Text 
                style={{ 
                  fontSize: getScaledFontSize(14),
                  color: neutralTextColor
                }}
              >Small Text</Text>
            </View>
          </View>

          {/* ===== COLOR SCHEME TEST ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ 
                fontSize: getScaledFontSize(18),
                color: neutralTextColor
              }}
              className="font-semibold"
            >🎨 Color Scheme Test</Text>
            <View className="gap-3">
              <View className="flex-row gap-3">
                <View className="bg-muted p-4 rounded-lg flex-1">
                  <Text 
                    style={{ 
                      fontSize: getScaledFontSize(16),
                      color: neutralTextColor
                    }}
                    className="text-center font-bold"
                  >Muted Color</Text>
                </View>
                <View className="bg-muted p-4 rounded-lg flex-1">
                  <Text 
                    style={{ 
                      fontSize: getScaledFontSize(16),
                      color: neutralTextColor
                    }}
                    className="text-center font-bold"
                  >Muted Color</Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <View className="border border-border p-3 rounded-lg flex-1">
                  <Text 
                    style={{ 
                      fontSize: getScaledFontSize(16),
                      color: neutralTextColor
                    }}
                    className="text-center"
                  >Border</Text>
                </View>
                <View className="border border-border p-3 rounded-lg flex-1">
                  <Text 
                    style={{ 
                      fontSize: getScaledFontSize(16),
                      color: neutralTextColor
                    }}
                    className="text-center"
                  >Border</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ===== FONT SIZE TEST ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ 
                fontSize: getScaledFontSize(18),
                color: neutralTextColor
              }}
              className="font-semibold"
            >📝 Font Size Test</Text>
            <View className="gap-2">
              <Text style={{ 
                fontSize: getScaledFontSize(12),
                color: neutralTextColor
              }}>Extra Small (scaled 12px)</Text>
              <Text style={{ 
                fontSize: getScaledFontSize(14),
                color: neutralTextColor
              }}>Small (scaled 14px)</Text>
              <Text style={{ 
                fontSize: getScaledFontSize(16),
                color: neutralTextColor
              }}>Base (scaled 16px)</Text>
              <Text style={{ 
                fontSize: getScaledFontSize(18),
                color: neutralTextColor
              }}>Large (scaled 18px)</Text>
              <Text style={{ 
                fontSize: getScaledFontSize(20),
                color: neutralTextColor
              }}>Extra Large (scaled 20px)</Text>
              <Text style={{ 
                fontSize: getScaledFontSize(24),
                color: neutralTextColor
              }}>2X Large (scaled 24px)</Text>
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
              style={{ 
                fontSize: getScaledFontSize(18),
                color: neutralTextColor
              }}
              className="font-semibold"
            >📍 Modal Component Sample</Text>
            <Button onPress={() => setModalVisible(true)}>
              <Text>Open Sample Modal</Text>
            </Button>
          </View>

          {/* ===== SCROLLVIEW SAMPLE ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ 
                fontSize: getScaledFontSize(18),
                color: neutralTextColor
              }}
              className="font-semibold"
            >📍 ScrollView Sample</Text>
            <Text 
              style={{ 
                fontSize: getScaledFontSize(14),
                color: neutralTextColor
              }}
            >This entire page is wrapped in a ScrollView!</Text>
            <View className="h-32 border border-border rounded-lg">
              <ScrollView className="flex-1 p-3" horizontal>
                <View className="flex-row gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <View key={item} className="w-20 h-20 bg-muted/20 rounded-lg items-center justify-center">
                      <Text 
                        style={{ 
                          fontSize: getScaledFontSize(16),
                          color: neutralTextColor
                        }}
                        className="font-bold"
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
              style={{ 
                fontSize: getScaledFontSize(18),
                color: neutralTextColor
              }}
              className="font-semibold"
            >📍 Dimensions Sample</Text>
            <View className="gap-2">
              <Text 
                style={{ 
                  fontSize: getScaledFontSize(16),
                  color: neutralTextColor
                }}
              >Screen Width: {screenDimensions.width}px</Text>
              <Text 
                style={{ 
                  fontSize: getScaledFontSize(16),
                  color: neutralTextColor
                }}
              >Screen Height: {screenDimensions.height}px</Text>
              <Text 
                style={{ 
                  fontSize: getScaledFontSize(14),
                  color: neutralTextColor
                }}
              >Rotate your device to see values change!</Text>
            </View>
          </View>

          {/* ===== USEEFFECT SAMPLE ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ 
                fontSize: getScaledFontSize(18),
                color: neutralTextColor
              }}
              className="font-semibold"
            >📍 useEffect Sample</Text>
            <Text 
              style={{ 
                fontSize: getScaledFontSize(14),
                color: neutralTextColor
              }}
            >
              useEffect is being used to listen to screen dimension changes. 
              The effect runs when the component mounts and cleans up when it unmounts.
            </Text>
          </View>

          {/* ===== THEME SAMPLE ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ 
                fontSize: getScaledFontSize(18),
                color: neutralTextColor
              }}
              className="font-semibold"
            >📍 THEME Object Sample</Text>
            <View className="gap-2">
              <Text 
                style={{ 
                  fontFamily: THEME[colorScheme ?? 'light'].fontSerif(),
                  fontSize: getScaledFontSize(16),
                  color: neutralTextColor
                }}
              >
                This text uses THEME.fontSerif()
              </Text>
              <Text 
                style={{ 
                  fontSize: getScaledFontSize(14),
                  color: neutralTextColor
                }}
              >
                Current color scheme: {colorScheme ?? 'light'}
              </Text>
            </View>
          </View>

          {/* ===== USECOLORSCHEME SAMPLE ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ 
                fontSize: getScaledFontSize(18),
                color: neutralTextColor
              }}
              className="font-semibold"
            >📍 useColorScheme Sample</Text>
            <Text 
              style={{ 
                fontSize: getScaledFontSize(14),
                color: neutralTextColor
              }}
            >
              Current color scheme from hook: {colorScheme ?? 'light'}
            </Text>
            <Text 
              style={{ 
                fontSize: getScaledFontSize(14),
                color: neutralTextColor
              }}
            >
              Toggle the theme using the button in the header!
            </Text>
          </View>

          {/* ===== VIEW COMPONENT SAMPLE ===== */}
          <View className="gap-4 p-4 bg-muted/20 rounded-lg">
            <Text 
              style={{ 
                fontSize: getScaledFontSize(18),
                color: neutralTextColor
              }}
              className="font-semibold"
            >📍 View Component Sample</Text>
            <Text 
              style={{ 
                fontSize: getScaledFontSize(14),
                color: neutralTextColor
              }}
            >
              Every container you see here is a View component with different styling!
            </Text>
            <View className="flex-row gap-2">
              <View className="flex-1 h-12 bg-muted/20 rounded-lg items-center justify-center">
                <Text 
                  style={{ 
                    fontSize: getScaledFontSize(12),
                    color: neutralTextColor
                  }}
                >View 1</Text>
              </View>
              <View className="flex-1 h-12 bg-muted/20 rounded-lg items-center justify-center">
                <Text 
                  style={{ 
                    fontSize: getScaledFontSize(12),
                    color: neutralTextColor
                  }}
                >View 2</Text>
              </View>
              <View className="flex-1 h-12 bg-muted/20 rounded-lg items-center justify-center">
                <Text 
                  style={{ 
                    fontSize: getScaledFontSize(12),
                    color: neutralTextColor
                  }}
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
                style={{ 
                  fontSize: getScaledFontSize(18),
                  color: neutralTextColor
                }}
                className="font-semibold"
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
              style={{ 
                fontSize: getScaledFontSize(16),
                color: neutralTextColor
              }}
              className="mb-4"
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
  const neutralTextColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  
  return (
    <View className="flex-row items-center gap-2">
      <Icon as={HomeIcon} className="size-5" />
      <Text 
        style={{ 
          fontFamily: THEME[colorScheme ?? 'light'].fontSerif(),
          fontSize: getScaledFontSize(20),
          fontWeight: '600',
          color: neutralTextColor
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

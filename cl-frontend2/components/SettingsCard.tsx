import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
// import { Switch } from '@/components/ui/switch';
import { NativeSwitch as Switch } from '@/components/ui/native-switch';
import { THEME } from '@/lib/theme';
import { useSettings } from '@/lib/SettingsContext';
import { SunIcon, SettingsIcon, XIcon, InfoIcon, ChevronRightIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Modal, Dimensions, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';

// Add global type declarations for React Native font/spacing scaling
declare global {
  var fontScale: number;
  var spacingMode: {
    spacing1: number;
    spacing2: number;
    spacing3: number;
    spacing4: number;
    spacing6: number;
  };
}

interface AnimatedSelectItemProps {
  item: {
    label: string;
    value: string;
    options?: { label: string; value: string }[];
    onChange: (value: string) => void;
  };
  selectKey: string;
  isExpanded: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  className?: string;
  colorScheme?: string;
}

function AnimatedSelectItem({ item, selectKey, isExpanded, onToggle, onSelect, className, colorScheme }: AnimatedSelectItemProps) {
  const { getScaledFontSize, getSpacing } = useSettings();
  const animatedHeight = useSharedValue(48); // Base button height
  const animatedBorderOpacity = useSharedValue(0.3); // Border opacity
  const animatedOptionsOpacity = useSharedValue(0); // Options opacity
  
  // Calculate expanded height based on options
  const expandedHeight = (item.options?.length || 0) * 48 + 8;
  
  // Text color based on theme
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  
  useEffect(() => {
    animatedHeight.value = withTiming(isExpanded ? expandedHeight : 48, {
      duration: 300,
    });
    animatedBorderOpacity.value = withTiming(isExpanded ? 0.8 : 0.3, {
      duration: 300,
    });
    // Add delay for expanding to let height animation start first
    if (isExpanded) {
      // Delay showing options until height animation is well underway
      setTimeout(() => {
        animatedOptionsOpacity.value = withTiming(1, { duration: 150 });
      }, 120); // Start opacity after 120ms of height animation
    } else {
      // Immediately start hiding options when collapsing
      animatedOptionsOpacity.value = withTiming(0, { duration: 80 });
    }
  }, [isExpanded, animatedHeight, animatedBorderOpacity, animatedOptionsOpacity, expandedHeight]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));
  
  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderWidth: 1,
    borderColor: `rgba(156, 163, 175, ${isExpanded ? 0.8 : 0.5})`, // Gray border with opacity based on state
  }));
  
  const animatedOptionsStyle = useAnimatedStyle(() => ({
    opacity: animatedOptionsOpacity.value,
  }));
  
  return (
    <View className={className}>
      <Text className="text-base text-foreground mb-3">{item.label}</Text>
      <Animated.View 
        className="rounded-xl bg-background overflow-hidden"
        style={[animatedStyle, animatedBorderStyle]}
      >
        {!isExpanded ? (
          /* Collapsed state - show selected option */
          <Pressable
            onPress={onToggle}
            className="w-full p-3 flex-row justify-between items-center h-12"
          >
            <Text className="text-foreground">
              {item.options?.find(opt => opt.value === item.value)?.label || item.value}
            </Text>
            <Icon as={ChevronRightIcon} className="size-4 text-muted-foreground" />
          </Pressable>
        ) : (
          /* Expanded state - show all options */
          <Animated.View style={animatedOptionsStyle}>
            {item.options?.map((option, optionIndex) => (
              <Pressable
                key={option.value}
                onPress={() => onSelect(option.value)}
                className={`px-4 py-3 h-12 ${
                  optionIndex < item.options!.length - 1 ? 'border-b border-border/20' : ''
                } ${
                  item.value === option.value 
                    ? 'bg-accent/20' 
                    : 'bg-transparent active:bg-muted'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <Text 
                    className={`flex-1 text-base ${
                      item.value === option.value 
                        ? 'text-accent-foreground font-semibold' 
                        : 'text-foreground font-medium'
                    }`}
                    style={{ fontSize: getScaledFontSize(16) }}
                  >
                    {option.label}
                  </Text>
                  {item.value === option.value && (
                    <View className="size-2 rounded-full ml-3" style={{ backgroundColor: '#3B82F6' }} />
                  )}
                </View>
              </Pressable>
            ))}
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

interface AnimatedSelectItemDesktopProps {
  item: {
    label: string;
    value: string;
    options?: { label: string; value: string }[];
    onChange: (value: string) => void;
  };
  selectKey: string;
  isExpanded: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  colorScheme?: string;
}

function AnimatedSelectItemDesktop({ item, selectKey, isExpanded, onToggle, onSelect, colorScheme }: AnimatedSelectItemDesktopProps) {
  const { getScaledFontSize, getSpacing } = useSettings();
  const animatedHeight = useSharedValue(48); // Base button height
  const animatedBorderOpacity = useSharedValue(0.3); // Border opacity
  const animatedOptionsOpacity = useSharedValue(0); // Options opacity
  
  // Calculate expanded height based on options
  const expandedHeight = (item.options?.length || 0) * 48 + 8;
  
  // Text color based on theme
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  
  useEffect(() => {
    animatedHeight.value = withTiming(isExpanded ? expandedHeight : 48, {
      duration: 300,
    });
    animatedBorderOpacity.value = withTiming(isExpanded ? 0.8 : 0.3, {
      duration: 300,
    });
    // Add delay for expanding to let height animation start first
    if (isExpanded) {
      // Delay showing options until height animation is well underway
      setTimeout(() => {
        animatedOptionsOpacity.value = withTiming(1, { duration: 150 });
      }, 120); // Start opacity after 120ms of height animation
    } else {
      // Immediately start hiding options when collapsing
      animatedOptionsOpacity.value = withTiming(0, { duration: 80 });
    }
  }, [isExpanded, animatedHeight, animatedBorderOpacity, animatedOptionsOpacity, expandedHeight]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));
  
  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderWidth: 1,
    borderColor: `rgba(156, 163, 175, ${isExpanded ? 0.8 : 0.5})`, // Gray border with opacity based on state
  }));
  
  const animatedOptionsStyle = useAnimatedStyle(() => ({
    opacity: animatedOptionsOpacity.value,
  }));
  
  return (
    <View 
      className="flex-row justify-between items-start rounded-lg bg-muted/10 border border-border/30"
      style={{ 
        padding: getSpacing('spacing4')
      }}
    >
      <Text 
        className="text-base text-foreground pt-3"
        style={{ fontSize: getScaledFontSize(16) }}
      >
        {item.label}
      </Text>
      <Animated.View 
        className="w-48 rounded-xl bg-background overflow-hidden"
        style={[animatedStyle, animatedBorderStyle]}
      >
        {!isExpanded ? (
          /* Collapsed state - show selected option */
          <Pressable
            onPress={onToggle}
            className="w-full p-3 flex-row justify-between items-center h-12"
          >
            <Text 
              className="flex-1" 
              style={{ 
                color: textColor,
                fontSize: getScaledFontSize(16)
              }}
            >
              {item.options?.find(opt => opt.value === item.value)?.label || item.value}
            </Text>
            <Icon as={ChevronRightIcon} className="size-4 text-muted-foreground" />
          </Pressable>
        ) : (
          /* Expanded state - show all options */
          <Animated.View style={animatedOptionsStyle}>
            {item.options?.map((option, optionIndex) => (
              <Pressable
                key={option.value}
                onPress={() => onSelect(option.value)}
                className={`px-4 py-3 h-12 ${
                  optionIndex < item.options!.length - 1 ? 'border-b border-border/20' : ''
                } ${
                  item.value === option.value 
                    ? 'bg-accent/20' 
                    : 'bg-transparent active:bg-muted'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <Text className={`flex-1 text-base ${
                    item.value === option.value 
                      ? 'text-accent-foreground font-semibold' 
                      : 'text-foreground font-medium'
                  }`}>
                    {option.label}
                  </Text>
                  {item.value === option.value && (
                    <View className="size-2 rounded-full ml-3" style={{ backgroundColor: '#3B82F6' }} />
                  )}
                </View>
              </Pressable>
            ))}
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}


interface SettingsCardProps {
  isOpen: boolean;
  onClose: () => void;
}


// export default function SettingsCard({ isOpen, onClose }: SettingsCardProps) {
//     return (
//         <View></View>
//     )
// }


export function SettingsCard({ isOpen, onClose }: SettingsCardProps) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { fontScale, spacingMode, updateFontScale, updateSpacingMode, getScaledFontSize, getSpacing } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState('appearance');
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

  // Storage keys
  const STORAGE_KEYS = {
    theme: 'app_theme',
    fontSize: 'app_font_size',
    colorScheme: 'app_color_scheme',
    displayMode: 'app_display_mode',
    dataCollection: 'app_data_collection',
    locationServices: 'app_location_services',
    analytics: 'app_analytics',
    cookies: 'app_cookies'
  };

  // Cross-platform storage utility
  const storage = {
    async getItem(key: string): Promise<string | null> {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          return localStorage.getItem(key);
        }
        return null;
      } catch {
        return null;
      }
    },
    async setItem(key: string, value: string): Promise<void> {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(key, value);
        }
      } catch (error) {
        console.log('Storage error:', error);
      }
    }
  };

  // Load settings from storage
  const loadStoredSettings = async () => {
    try {
      const stored = await Promise.all([
        storage.getItem(STORAGE_KEYS.theme),
        storage.getItem(STORAGE_KEYS.fontSize),
        storage.getItem(STORAGE_KEYS.colorScheme),
        storage.getItem(STORAGE_KEYS.displayMode),
        storage.getItem(STORAGE_KEYS.dataCollection),
        storage.getItem(STORAGE_KEYS.locationServices),
        storage.getItem(STORAGE_KEYS.analytics),
        storage.getItem(STORAGE_KEYS.cookies)
      ]);
      
      if (stored[0]) setThemeValue(stored[0]);
      if (stored[1]) setFontSizeValue(stored[1]);
      if (stored[2]) setColorSchemeValue(stored[2]);
      if (stored[3]) setDisplayModeValue(stored[3]);
      if (stored[4]) setDataCollectionEnabled(stored[4] === 'true');
      if (stored[5]) setLocationServicesEnabled(stored[5] === 'true');
      if (stored[6]) setAnalyticsValue(stored[6]);
      if (stored[7]) setCookiesValue(stored[7]);
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  // Save setting to storage
  const saveSetting = async (key: string, value: string | boolean) => {
    try {
      await storage.setItem(key, value.toString());
    } catch (error) {
      console.log('Error saving setting:', error);
    }
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    // Load stored settings on mount
    loadStoredSettings();

    return () => subscription?.remove();
  }, []);

  const isNarrowScreen = screenDimensions.width < 640; // Tailwind's sm breakpoint

  const [themeValue, setThemeValue] = useState('light');
  const [fontSizeValue, setFontSizeValue] = useState('medium');
  const [colorSchemeValue, setColorSchemeValue] = useState('default');
  const [displayModeValue, setDisplayModeValue] = useState('comfortable');
  const [dataCollectionEnabled, setDataCollectionEnabled] = useState(true);
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [analyticsValue, setAnalyticsValue] = useState('anonymous');
  const [cookiesValue, setCookiesValue] = useState('essential');
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});
  const [expandedSelects, setExpandedSelects] = useState<{[key: string]: boolean}>({});

  // Apply font size scaling when it changes
  useEffect(() => {
    // Apply font size scaling
    const fontScales = {
      small: 0.875,
      medium: 1,
      large: 1.125,
      xl: 1.25
    };
    
    const scale = fontScales[fontSizeValue as keyof typeof fontScales];
    updateFontScale(scale);
    
    // For web platforms
    if (typeof document !== 'undefined') {
      const scaleStr = scale.toString();
      document.documentElement.style.setProperty('--font-scale', scaleStr);
      document.documentElement.style.setProperty('--text-xs', `${0.75 * scale}rem`);
      document.documentElement.style.setProperty('--text-sm', `${0.875 * scale}rem`);
      document.documentElement.style.setProperty('--text-base', `${1 * scale}rem`);
      document.documentElement.style.setProperty('--text-lg', `${1.125 * scale}rem`);
      document.documentElement.style.setProperty('--text-xl', `${1.25 * scale}rem`);
      document.documentElement.style.setProperty('--text-2xl', `${1.5 * scale}rem`);
    }
  }, [fontSizeValue, updateFontScale]);

  useEffect(() => {
    // Apply color scheme
    if (typeof document !== 'undefined') {
      const colorSchemes = {
        default: { 
          primary: '59 130 246',
          primaryForeground: '255 255 255',
          accent: '245 158 11',
          accentForeground: '255 255 255'
        },
        blue: { 
          primary: '37 99 235',
          primaryForeground: '255 255 255',
          accent: '14 165 233',
          accentForeground: '255 255 255'
        },
        green: { 
          primary: '5 150 105',
          primaryForeground: '255 255 255',
          accent: '16 185 129',
          accentForeground: '255 255 255'
        },
        purple: { 
          primary: '124 58 237',
          primaryForeground: '255 255 255',
          accent: '168 85 247',
          accentForeground: '255 255 255'
        }
      };
      const scheme = colorSchemes[colorSchemeValue as keyof typeof colorSchemes];
      if (scheme) {
        document.documentElement.style.setProperty('--primary', scheme.primary);
        document.documentElement.style.setProperty('--primary-foreground', scheme.primaryForeground);
        document.documentElement.style.setProperty('--accent', scheme.accent);
        document.documentElement.style.setProperty('--accent-foreground', scheme.accentForeground);
      }
    }
  }, [colorSchemeValue]);

  useEffect(() => {
    // Apply display mode spacing
    updateSpacingMode(displayModeValue as 'compact' | 'comfortable' | 'spacious');
    
    // For web platforms
    if (typeof document !== 'undefined') {
      const webSpacingModes = {
        compact: { 
          spacing1: '0.25rem',
          spacing2: '0.5rem',
          spacing3: '0.75rem',
          spacing4: '1rem',
          spacing6: '1.5rem'
        },
        comfortable: { 
          spacing1: '0.5rem',
          spacing2: '0.75rem',
          spacing3: '1rem',
          spacing4: '1.25rem',
          spacing6: '2rem'
        },
        spacious: { 
          spacing1: '0.75rem',
          spacing2: '1rem',
          spacing3: '1.5rem',
          spacing4: '2rem',
          spacing6: '3rem'
        }
      };
      const mode = webSpacingModes[displayModeValue as keyof typeof webSpacingModes];
      if (mode) {
        document.documentElement.style.setProperty('--spacing-1', mode.spacing1);
        document.documentElement.style.setProperty('--spacing-2', mode.spacing2);
        document.documentElement.style.setProperty('--spacing-3', mode.spacing3);
        document.documentElement.style.setProperty('--spacing-4', mode.spacing4);
        document.documentElement.style.setProperty('--spacing-6', mode.spacing6);
        document.body.className = document.body.className.replace(/spacing-\w+/g, '') + ` spacing-${displayModeValue}`;
      }
    }
  }, [displayModeValue, updateSpacingMode]);

  const categories = [
    { id: 'appearance', label: 'Appearance', icon: SunIcon },
    { id: 'privacy', label: 'Privacy', icon: SettingsIcon },
    { id: 'about', label: 'About', icon: InfoIcon },
  ];

  const settingsContent = {
    appearance: [
      { 
        label: 'Theme', 
        type: 'select' as const,
        value: themeValue,
        options: [
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' }
        ],
        onChange: (value: string) => {
          setThemeValue(value);
          saveSetting(STORAGE_KEYS.theme, value);
          // Apply the theme immediately
          setColorScheme(value as 'light' | 'dark');
        }
      },
      { 
        label: 'Font Size', 
        type: 'select' as const,
        value: fontSizeValue,
        options: [
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' },
          { label: 'Extra Large', value: 'xl' }
        ],
        onChange: (value: string) => {
          setFontSizeValue(value);
          saveSetting(STORAGE_KEYS.fontSize, value);
          // Apply font size scaling to all text elements
          const fontScales = {
            small: '0.875', // 14px base
            medium: '1', // 16px base  
            large: '1.125', // 18px base
            xl: '1.25' // 20px base
          };
          if (typeof document !== 'undefined') {
            const scale = fontScales[value as keyof typeof fontScales];
            document.documentElement.style.setProperty('--font-scale', scale);
            // Apply to common text sizes
            document.documentElement.style.setProperty('--text-xs', `${0.75 * parseFloat(scale)}rem`);
            document.documentElement.style.setProperty('--text-sm', `${0.875 * parseFloat(scale)}rem`);
            document.documentElement.style.setProperty('--text-base', `${1 * parseFloat(scale)}rem`);
            document.documentElement.style.setProperty('--text-lg', `${1.125 * parseFloat(scale)}rem`);
            document.documentElement.style.setProperty('--text-xl', `${1.25 * parseFloat(scale)}rem`);
            document.documentElement.style.setProperty('--text-2xl', `${1.5 * parseFloat(scale)}rem`);
          }
        }
      },
      // Add a preview section to show settings are working
      { 
        label: 'Preview', 
        type: 'info' as const,
        value: `Font: ${fontSizeValue} (${(global.fontScale || 1).toFixed(2)}x) | Spacing: ${displayModeValue}`,
        onChange: () => {} // No-op for info type
      },
      { 
        label: 'Color Scheme', 
        type: 'select' as const,
        value: colorSchemeValue,
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Blue', value: 'blue' },
          { label: 'Green', value: 'green' },
          { label: 'Purple', value: 'purple' }
        ],
        onChange: (value: string) => {
          setColorSchemeValue(value);
          saveSetting(STORAGE_KEYS.colorScheme, value);
          // Apply color scheme to actual Tailwind CSS variables
          if (typeof document !== 'undefined') {
            const colorSchemes = {
              default: { 
                primary: '59 130 246', // blue-500 in RGB
                primaryForeground: '255 255 255',
                accent: '245 158 11', // amber-500 in RGB
                accentForeground: '255 255 255'
              },
              blue: { 
                primary: '37 99 235', // blue-600 in RGB
                primaryForeground: '255 255 255',
                accent: '14 165 233', // sky-500 in RGB
                accentForeground: '255 255 255'
              },
              green: { 
                primary: '5 150 105', // emerald-600 in RGB
                primaryForeground: '255 255 255',
                accent: '16 185 129', // emerald-500 in RGB
                accentForeground: '255 255 255'
              },
              purple: { 
                primary: '124 58 237', // violet-600 in RGB
                primaryForeground: '255 255 255',
                accent: '168 85 247', // violet-500 in RGB
                accentForeground: '255 255 255'
              }
            };
            const scheme = colorSchemes[value as keyof typeof colorSchemes];
            if (scheme) {
              // Update CSS custom properties that NativeWind/Tailwind uses
              document.documentElement.style.setProperty('--primary', scheme.primary);
              document.documentElement.style.setProperty('--primary-foreground', scheme.primaryForeground);
              document.documentElement.style.setProperty('--accent', scheme.accent);
              document.documentElement.style.setProperty('--accent-foreground', scheme.accentForeground);
            }
          }
        }
      },
      { 
        label: 'Display Mode', 
        type: 'select' as const,
        value: displayModeValue,
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' }
        ],
        onChange: (value: string) => {
          setDisplayModeValue(value);
          saveSetting(STORAGE_KEYS.displayMode, value);
          // Apply spacing changes to actual Tailwind spacing variables
          if (typeof document !== 'undefined') {
            const spacingModes = {
              compact: { 
                padding: '0.5rem',
                gap: '0.25rem',
                spacing1: '0.25rem', // space-1
                spacing2: '0.5rem',  // space-2
                spacing3: '0.75rem', // space-3
                spacing4: '1rem',    // space-4
                spacing6: '1.5rem'   // space-6
              },
              comfortable: { 
                padding: '1rem',
                gap: '0.5rem',
                spacing1: '0.5rem',
                spacing2: '0.75rem',
                spacing3: '1rem',
                spacing4: '1.25rem',
                spacing6: '2rem'
              },
              spacious: { 
                padding: '1.5rem',
                gap: '0.75rem',
                spacing1: '0.75rem',
                spacing2: '1rem',
                spacing3: '1.5rem',
                spacing4: '2rem',
                spacing6: '3rem'
              }
            };
            const mode = spacingModes[value as keyof typeof spacingModes];
            if (mode) {
              // Update CSS custom properties that affect spacing
              document.documentElement.style.setProperty('--spacing-1', mode.spacing1);
              document.documentElement.style.setProperty('--spacing-2', mode.spacing2);
              document.documentElement.style.setProperty('--spacing-3', mode.spacing3);
              document.documentElement.style.setProperty('--spacing-4', mode.spacing4);
              document.documentElement.style.setProperty('--spacing-6', mode.spacing6);
              // Add a CSS class to body to apply spacing mode
              document.body.className = document.body.className.replace(/spacing-\w+/g, '') + ` spacing-${value}`;
            }
          }
        }
      },
    ],
    privacy: [
      { 
        label: 'Data Collection', 
        type: 'switch' as const,
        value: dataCollectionEnabled,
        onChange: (value: boolean) => {
          setDataCollectionEnabled(value);
          saveSetting(STORAGE_KEYS.dataCollection, value);
          console.log('Data collection:', value ? 'enabled' : 'disabled');
        }
      },
      { 
        label: 'Location Services', 
        type: 'switch' as const,
        value: locationServicesEnabled,
        onChange: (value: boolean) => {
          setLocationServicesEnabled(value);
          saveSetting(STORAGE_KEYS.locationServices, value);
          console.log('Location services:', value ? 'enabled' : 'disabled');
        }
      },
      { 
        label: 'Analytics', 
        type: 'select' as const,
        value: analyticsValue,
        options: [
          { label: 'Disabled', value: 'disabled' },
          { label: 'Anonymous', value: 'anonymous' },
          { label: 'Full', value: 'full' }
        ],
        onChange: (value: string) => {
          setAnalyticsValue(value);
          saveSetting(STORAGE_KEYS.analytics, value);
          console.log('Analytics level:', value);
        }
      },
      { 
        label: 'Cookies', 
        type: 'select' as const,
        value: cookiesValue,
        options: [
          { label: 'Essential Only', value: 'essential' },
          { label: 'Functional', value: 'functional' },
          { label: 'All Cookies', value: 'all' }
        ],
        onChange: (value: string) => {
          setCookiesValue(value);
          saveSetting(STORAGE_KEYS.cookies, value);
          console.log('Cookie preference:', value);
        }
      },
    ],
    about: [
      { label: 'Version', type: 'info' as const, value: '1.0.0' },
      { label: 'Help & Support', type: 'button' as const, onPress: () => console.log('Help pressed') },
      { label: 'Terms of Service', type: 'button' as const, onPress: () => console.log('Terms pressed') },
      { label: 'Privacy Policy', type: 'button' as const, onPress: () => console.log('Privacy Policy pressed') },
      { label: 'Licenses', type: 'button' as const, onPress: () => console.log('Licenses pressed') },
    ],
  };

  

  if (!isOpen) return null;



  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4" style={{ zIndex: 1000 }}>
        <View className={`bg-background rounded-2xl w-full ${isNarrowScreen ? 'max-w-sm' : 'max-w-4xl'} max-h-[85%] border border-border overflow-visible`} style={{ zIndex: 1001 }}>
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
                        onPress={() => {
                          setSelectedCategory(category.id);
                          setExpandedSelects({});
                        }}
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
              <ScrollView className="flex-1 p-6 pb-8">
                <View className="gap-6 pb-4">
                  {settingsContent[selectedCategory as keyof typeof settingsContent]?.map((item, index) => {
                    if (item.type === 'info') {
                      // Display as non-interactive text item
                      return (
                        <View
                          key={index}
                          className="flex-row justify-between items-center p-6 rounded-xl bg-muted/10 border border-border/30 min-h-[70px]"
                        >
                          <Text className="text-base text-foreground flex-1">{item.label}</Text>
                          <Text className="text-sm text-muted-foreground ml-4 font-medium">{item.value}</Text>
                        </View>
                      );
                    }
                    
                    if (item.type === 'switch') {
                      // Display as switch control
                      return (
                        <View
                          key={index}
                          className="flex-row justify-between items-center p-6 rounded-xl bg-muted/10 border border-border/30 min-h-[70px]"
                        >
                          <Text className="text-base text-foreground flex-1">{item.label}</Text>
                          <Switch
                            checked={item.value}
                            onCheckedChange={item.onChange}
                          />
                        </View>
                      );
                    }
                    
                    if (item.type === 'select') {
                      const selectKey = `${selectedCategory}-${index}`;
                      const isExpanded = expandedSelects[selectKey] || false;
                      
                      // Display as animated select
                      return (
                        <AnimatedSelectItem
                          key={index}
                          item={item}
                          selectKey={selectKey}
                          isExpanded={isExpanded}
                          colorScheme={colorScheme}
                          onToggle={() => {
                            setExpandedSelects(prev => ({
                              ...prev,
                              [selectKey]: !prev[selectKey]
                            }));
                          }}
                          onSelect={(value) => {
                            item.onChange(value);
                            setExpandedSelects(prev => ({
                              ...prev,
                              [selectKey]: false
                            }));
                          }}
                          className="flex-col gap-3 p-6 rounded-xl bg-muted/10 border border-border/30"
                        />
                      );
                    }
                    
                    if (item.type === 'info') {
                      // Display as info/preview text
                      return (
                        <View 
                          key={index}
                          className="p-4 rounded-xl bg-blue-50 border border-blue-200"
                          style={{ 
                            padding: global.spacingMode?.spacing4 || 16 
                          }}
                        >
                          <Text 
                            className="text-sm font-medium text-blue-700"
                            style={{ fontSize: (global.fontScale || 1) * 14 }}
                          >
                            {item.label}
                          </Text>
                          <Text 
                            className="text-sm text-blue-600 mt-1"
                            style={{ fontSize: (global.fontScale || 1) * 12 }}
                          >
                            {item.value}
                          </Text>
                        </View>
                      );
                    }
                    
                    // Display as interactive button
                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        className="flex-row justify-between items-center p-6 rounded-xl bg-muted/20 border border-border/50 min-h-[70px]"
                        onPress={() => {
                          item.onPress && item.onPress();
                        }}
                      >
                        <Text className="text-base text-foreground flex-1">{item.label}</Text>
                        <Icon as={ChevronRightIcon} className="size-4 text-muted-foreground" />
                      </Button>
                    );
                  })}
                </View>
              </ScrollView>
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
                      onPress={() => {
                        setSelectedCategory(category.id);
                        setExpandedSelects({});
                      }}
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
                  <View className="gap-4">
                    {settingsContent[selectedCategory as keyof typeof settingsContent]?.map((item, index) => {
                      if (item.type === 'info') {
                        // Display as non-interactive text item
                        return (
                          <View
                            key={index}
                            className="flex-row justify-between items-center p-4 rounded-xl bg-muted/10 border border-border/30"
                          >
                            <Text className="text-base text-foreground">{item.label}</Text>
                            <Text className="text-sm text-muted-foreground font-medium">{item.value}</Text>
                          </View>
                        );
                      }
                      
                      if (item.type === 'switch') {
                        // Display as switch control
                        return (
                          <View
                            key={index}
                            className="flex-row justify-between items-center p-4 rounded-xl bg-muted/10 border border-border/30"
                          >
                            <Text className="text-base text-foreground">{item.label}</Text>
                            <Switch
                              checked={item.value}
                              onCheckedChange={item.onChange}
                            />
                          </View>
                        );
                      }
                      
                      if (item.type === 'select') {
                        const selectKey = `${selectedCategory}-${index}-desktop`;
                        const isExpanded = expandedSelects[selectKey] || false;
                        
                        // Display as animated select
                        return (
                          <AnimatedSelectItemDesktop
                            key={index}
                            item={item}
                            selectKey={selectKey}
                            isExpanded={isExpanded}
                            colorScheme={colorScheme}
                            onToggle={() => {
                              setExpandedSelects(prev => ({
                                ...prev,
                                [selectKey]: !prev[selectKey]
                              }));
                            }}
                            onSelect={(value) => {
                              item.onChange(value);
                              setExpandedSelects(prev => ({
                                ...prev,
                                [selectKey]: false
                              }));
                            }}
                          />
                        );
                      }
                      
                      // Display as interactive button
                      return (
                        <Button
                          key={index}
                          variant="ghost"
                          className="flex-row justify-between items-center p-4 rounded-xl bg-muted/20 border border-border/50"
                          onPress={() => {
                            item.onPress && item.onPress();
                          }}
                        >
                          <Text className="text-base text-foreground">{item.label}</Text>
                          <Icon as={ChevronRightIcon} className="size-4 text-muted-foreground" />
                        </Button>
                      );
                      })}
                    </View>
                  </ScrollView>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
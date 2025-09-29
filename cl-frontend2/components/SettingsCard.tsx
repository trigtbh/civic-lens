import { Button } from '@/components/ui/button';



import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
// import { Switch } from '@/components/ui/switch';
import { NativeSwitch as Switch } from '@/components/ui/native-switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { THEME } from '@/lib/theme';
import { SunIcon, SettingsIcon, XIcon, InfoIcon, ChevronRightIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useState, useEffect } from 'react';
import { View, ScrollView, Modal, Dimensions } from 'react-native';


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

  const [themeValue, setThemeValue] = useState('auto');
  const [fontSizeValue, setFontSizeValue] = useState('medium');
  const [colorSchemeValue, setColorSchemeValue] = useState('default');
  const [displayModeValue, setDisplayModeValue] = useState('comfortable');
  const [dataCollectionEnabled, setDataCollectionEnabled] = useState(true);
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [analyticsValue, setAnalyticsValue] = useState('anonymous');
  const [cookiesValue, setCookiesValue] = useState('essential');

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
          { label: 'Auto', value: 'auto' },
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' }
        ],
        onChange: setThemeValue
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
        onChange: setFontSizeValue
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
        onChange: setColorSchemeValue
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
        onChange: setDisplayModeValue
      },
    ],
    privacy: [
      { 
        label: 'Data Collection', 
        type: 'switch' as const,
        value: dataCollectionEnabled,
        onChange: setDataCollectionEnabled
      },
      { 
        label: 'Location Services', 
        type: 'switch' as const,
        value: locationServicesEnabled,
        onChange: setLocationServicesEnabled
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
        onChange: setAnalyticsValue
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
        onChange: setCookiesValue
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
              <ScrollView className="flex-1 p-6">
                <View className="gap-6">
                  {settingsContent[selectedCategory as keyof typeof settingsContent]?.map((item, index) => {
                    if (item.type === 'info') {
                      // Display as non-interactive text item
                      return (
                        <View
                          key={index}
                          className="flex-row justify-between items-center p-6 rounded-lg bg-muted/10 border border-border/30 min-h-[70px]"
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
                          className="flex-row justify-between items-center p-6 rounded-lg bg-muted/10 border border-border/30 min-h-[70px]"
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
                      // Display as select dropdown
                      return (
                        <View
                          key={index}
                          className="flex-col gap-3 p-6 rounded-lg bg-muted/10 border border-border/30"
                        >
                          <Text className="text-base text-foreground">{item.label}</Text>
                          <Select value={{ value: item.value, label: item.options?.find(opt => opt.value === item.value)?.label || '' }} onValueChange={(option) => option && item.onChange(option.value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              {item.options?.map((option) => (
                                <SelectItem key={option.value} label={option.label} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </View>
                      );
                    }
                    
                    // Display as interactive button
                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        className="flex-row justify-between items-center p-6 rounded-lg bg-muted/20 border border-border/50 min-h-[70px]"
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
                  <View className="gap-4">
                    {settingsContent[selectedCategory as keyof typeof settingsContent]?.map((item, index) => {
                      if (item.type === 'info') {
                        // Display as non-interactive text item
                        return (
                          <View
                            key={index}
                            className="flex-row justify-between items-center p-4 rounded-lg bg-muted/10 border border-border/30"
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
                            className="flex-row justify-between items-center p-4 rounded-lg bg-muted/10 border border-border/30"
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
                        // Display as select dropdown
                        return (
                          <View
                            key={index}
                            className="flex-row justify-between items-center p-4 rounded-lg bg-muted/10 border border-border/30"
                          >
                            <Text className="text-base text-foreground">{item.label}</Text>
                            <View className="w-48">
                              <Select value={{ value: item.value, label: item.options?.find(opt => opt.value === item.value)?.label || '' }} onValueChange={(option) => option && item.onChange(option.value)}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                  {item.options?.map((option) => (
                                    <SelectItem key={option.value} label={option.label} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </View>
                          </View>
                        );
                      }
                      
                      // Display as interactive button
                      return (
                        <Button
                          key={index}
                          variant="ghost"
                          className="flex-row justify-between items-center p-4 rounded-lg bg-muted/20 border border-border/50"
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
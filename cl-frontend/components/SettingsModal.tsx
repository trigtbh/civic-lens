import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  Switch as RNSwitch, 
  Dimensions, 
  Modal,
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import type { Option } from '@/components/ui/select';
import { 
  SettingsIcon, 
  PaletteIcon, 
  UserIcon, 
  BellIcon, 
  ShieldIcon,
  MoonIcon,
  SunIcon,
  TypeIcon,
  VolumeXIcon,
  DatabaseIcon,
  LockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { cn } from '@/lib/utils';
import { useSettings } from '@/lib/SettingsContext';

interface SettingsModalProps {
  children: React.ReactNode;
}

interface LocalOption {
  label: string;
  value: string;
  hex?: string;
}

type SettingsCategory = {
  id: string;
  name: string;
  icon: any;
  description: string;
};

const SETTINGS_CATEGORIES: SettingsCategory[] = [
  { 
    id: 'appearance', 
    name: 'Appearance', 
    icon: PaletteIcon,
    description: 'Themes, display & sounds'
  },
  { 
    id: 'account', 
    name: 'Account', 
    icon: UserIcon,
    description: 'Profile, privacy & notifications'
  },
];

const FONT_SIZE_OPTIONS: LocalOption[] = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'Extra Large', value: 'xl' },
];

const PRIVACY_LEVEL_OPTIONS: LocalOption[] = [
  { label: 'Minimal', value: 'minimal' },
  { label: 'Standard', value: 'standard' },
  { label: 'Strict', value: 'strict' },
];

const ACCENT_COLOR_OPTIONS: LocalOption[] = [
  { label: 'Blue', value: 'blue', hex: '#2563EB' },
  { label: 'Purple', value: 'purple', hex: '#7C3AED' },
  { label: 'Green', value: 'green', hex: '#16A34A' },
  { label: 'Orange', value: 'orange', hex: '#F97316' },
  { label: 'Red', value: 'red', hex: '#EF4444' },
  { label: 'Pink', value: 'pink', hex: '#EC4899' },
  { label: 'Teal', value: 'teal', hex: '#0D9488' },
  { label: 'Cyan', value: 'cyan', hex: '#0891B2' },
  { label: 'Indigo', value: 'indigo', hex: '#4338CA' },
  { label: 'Violet', value: 'violet', hex: '#7C3AED' },
  { label: 'Emerald', value: 'emerald', hex: '#059669' },
  { label: 'Lime', value: 'lime', hex: '#65A30D' },
  { label: 'Amber', value: 'amber', hex: '#D97706' },
  { label: 'Rose', value: 'rose', hex: '#F43F5E' },
  { label: 'Sky', value: 'sky', hex: '#0284C7' },
  { label: 'Slate', value: 'slate', hex: '#64748B' },
  { label: 'Yellow', value: 'yellow', hex: '#EAB308' },
  { label: 'Fuchsia', value: 'fuchsia', hex: '#C026D3' },
];

const SwitchComponent = ({ checked, onCheckedChange, disabled = false }: { 
  checked: boolean; 
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) => {
  if (Platform.OS === 'web') {
    return (
      <View className="flex items-center justify-center">
        <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
      </View>
    );
  }
  return (
    <View className="flex items-center justify-center">
      <RNSwitch 
        value={checked} 
        onValueChange={onCheckedChange} 
        disabled={disabled}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={checked ? '#f5dd4b' : '#f4f3f4'}
      />
    </View>
  );
};

export function SettingsModal({ children }: SettingsModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [privacyLevel, setPrivacyLevel] = useState<LocalOption>({ label: 'Standard', value: 'standard' });
  const [email, setEmail] = useState('user@example.com');
  const [displayName, setDisplayName] = useState('John Doe');

  const { fontSize, updateFontSize, accentColor, updateAccentColor } = useSettings();

  // Helper function to get font size option object
  const getFontSizeOption = (size: 'small' | 'medium' | 'large' | 'xl'): LocalOption => {
    const options = {
      small: { label: 'Small', value: 'small' },
      medium: { label: 'Medium', value: 'medium' },
      large: { label: 'Large', value: 'large' },
      xl: { label: 'Extra Large', value: 'xl' }
    };
    return options[size];
  };

  const currentFontSizeOption = getFontSizeOption(fontSize);

  const { width } = Dimensions.get('window');
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android' || (Platform.OS === 'web' && width < 768);

  React.useEffect(() => {
    if (!isMobile && !selectedCategory) {
      setSelectedCategory('appearance');
    }
  }, [isMobile, selectedCategory]);

  const handleDarkModeToggle = () => {
    toggleColorScheme();
    setDarkMode(!darkMode);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(isMobile ? null : 'appearance');
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBackPress = () => {
    setSelectedCategory(null);
  };

  const showChangePasswordAlert = () => {
    Alert.alert(
      'Change Password',
      'This would open a password change flow in a real app.',
      [{ text: 'OK' }]
    );
  };

  const showFontSizePicker = () => {
    Alert.alert(
      'Font Size',
      'Select your preferred font size',
      [
        { text: 'Small', onPress: () => updateFontSize('small') },
        { text: 'Medium', onPress: () => updateFontSize('medium') },
        { text: 'Large', onPress: () => updateFontSize('large') },
        { text: 'Extra Large', onPress: () => updateFontSize('xl') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const showPrivacyLevelPicker = () => {
    Alert.alert(
      'Privacy Level',
      'Choose your privacy preferences',
      [
        { text: 'Minimal', onPress: () => setPrivacyLevel({ label: 'Minimal', value: 'minimal' }) },
        { text: 'Standard', onPress: () => setPrivacyLevel({ label: 'Standard', value: 'standard' }) },
        { text: 'Strict', onPress: () => setPrivacyLevel({ label: 'Strict', value: 'strict' }) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleFontSizeChange = (option: Option) => {
    if (option && option.label && option.value) {
      updateFontSize(option.value as 'small' | 'medium' | 'large' | 'xl');
    }
  };

  const handlePrivacyLevelChange = (option: Option) => {
    if (option && option.label && option.value) {
      setPrivacyLevel({ label: option.label, value: option.value });
    }
  };

  const showAccentColorPicker = () => {
    Alert.alert(
      'Accent Color',
      'Choose your preferred accent color',
      [
        { text: 'Blue', onPress: () => updateAccentColor({ label: 'Blue', value: 'blue', hex: '#2563EB' }) },
        { text: 'Purple', onPress: () => updateAccentColor({ label: 'Purple', value: 'purple', hex: '#7C3AED' }) },
        { text: 'Green', onPress: () => updateAccentColor({ label: 'Green', value: 'green', hex: '#16A34A' }) },
        { text: 'Orange', onPress: () => updateAccentColor({ label: 'Orange', value: 'orange', hex: '#F97316' }) },
        { text: 'Red', onPress: () => updateAccentColor({ label: 'Red', value: 'red', hex: '#EF4444' }) },
        { text: 'Pink', onPress: () => updateAccentColor({ label: 'Pink', value: 'pink', hex: '#EC4899' }) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleAccentColorChange = (option: Option) => {
    if (option && option.label && option.value) {
      const colorOption = ACCENT_COLOR_OPTIONS.find(color => color.value === option.value);
      if (colorOption && colorOption.hex) {
        updateAccentColor({
          label: colorOption.label,
          value: colorOption.value,
          hex: colorOption.hex
        });
      }
    }
  };

  const renderSettingItem = ({ 
    icon, 
    title, 
    description, 
    rightComponent,
    onPress 
  }: {
    icon: any;
    title: string;
    description: string;
    rightComponent?: React.ReactNode;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center gap-4 p-4 bg-card rounded-xl border border-border active:bg-card/80"
    >
      <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
        <Icon as={icon} size={20} className="text-primary" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-foreground">{title}</Text>
        <Text className="text-sm text-muted-foreground mt-0.5" numberOfLines={2}>
          {description}
        </Text>
      </View>
      {rightComponent && (
        <View className="ml-2">
          {rightComponent}
        </View>
      )}
      {onPress && !rightComponent && (
        <Icon as={ChevronRightIcon} size={16} className="text-muted-foreground" />
      )}
    </TouchableOpacity>
  );

  // For mobile, we handle the press directly  
  const handlePress = () => {
    setOpen(true);
  };

  if (isMobile) {
    return (
      <>
        {React.cloneElement(children as React.ReactElement<any>, {
          onPress: handlePress,
        })}
        <Modal
          visible={open}
          animationType="slide"
          presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
          onRequestClose={handleClose}
        >
          <SafeAreaView className="flex-1 bg-background">
            <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={darkMode ? '#000' : '#fff'} />
            
            {selectedCategory ? (
              <View className="flex-1">
                <View className="flex-row items-center justify-between p-4 border-b border-border bg-background">
                  <TouchableOpacity
                    onPress={handleBackPress}
                    className="flex-row items-center gap-2"
                  >
                    <Icon as={ChevronLeftIcon} size={24} className="text-foreground" />
                    <Text className="text-lg font-medium text-foreground">Settings</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={handleClose}>
                    <Text className="text-lg font-medium text-primary">Done</Text>
                  </TouchableOpacity>
                </View>

                <View className="px-4 py-3 border-b border-border/50">
                  <Text className="text-xl font-bold text-foreground">
                    {SETTINGS_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  </Text>
                </View>

                <ScrollView 
                  className="flex-1" 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ padding: 16 }}
                >
                  <View className="gap-4">
                    {selectedCategory === 'appearance' && (
                      <>
                        <View className="border border-border rounded-md p-3">
                          <View className="flex-row items-center gap-3">
                            <Icon as={darkMode ? MoonIcon : SunIcon} size={20} />
                            <View className="flex-1">
                              <Text className="font-medium text-base">Dark Mode</Text>
                              <Text className="text-sm text-muted-foreground mt-1">
                                Switch between light and dark themes
                              </Text>
                            </View>
                            <SwitchComponent
                              checked={darkMode}
                              onCheckedChange={handleDarkModeToggle}
                            />
                          </View>
                        </View>

                        <View className="border border-border rounded-md p-3">
                          <View className="flex-row items-center gap-3">
                            <Icon as={TypeIcon} size={20} />
                            <View className="flex-1">
                              <Text className="font-medium text-base">Font Size</Text>
                              <Text className="text-sm text-muted-foreground mt-1">
                                Adjust text size for better readability
                              </Text>
                            </View>
                          </View>

                          <View className="mt-2">
                            <Accordion type="single" collapsible>
                              <AccordionItem value="font-size" className="border border-border rounded-md">
                                <AccordionTrigger className="px-3 py-2">
                                  <Text className="text-sm">{currentFontSizeOption.label}</Text>
                                </AccordionTrigger>
                                <AccordionContent className="p-3 pb-4 border-t border-border h-auto min-h-[260px] mb-4">
                                  <View className="flex-col gap-2">
                                    {FONT_SIZE_OPTIONS.map((option) => (
                                      <Button
                                        key={option.value}
                                        size="sm"
                                        variant={currentFontSizeOption.value === option.value ? 'secondary' : 'ghost'}
                                        className={cn(
                                          'w-full justify-start border border-border rounded-md px-3 py-3 min-h-[56px]',
                                          currentFontSizeOption.value === option.value ? 'border-primary' : ''
                                        )}
                                        onPress={() => updateFontSize(option.value as 'small' | 'medium' | 'large' | 'xl')}
                                      >
                                        <Text 
                                          disableFontScaling={true}
                                          className={cn(
                                          option.value === 'small' ? 'text-sm leading-relaxed' :
                                          option.value === 'medium' ? 'text-base leading-relaxed' :
                                          option.value === 'large' ? 'text-lg leading-relaxed' :
                                          'text-xl leading-relaxed'
                                        )}>{option.label}</Text>
                                      </Button>
                                    ))}
                                  </View>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </View>
                        </View>

                        <View className="border border-border rounded-md p-3">
                          <View className="flex-row items-center gap-3">
                            <Icon as={PaletteIcon} size={20} />
                            <View className="flex-1">
                              <Text className="font-medium text-base">Accent Color</Text>
                              <Text className="text-sm text-muted-foreground mt-1">
                                Choose your preferred accent color
                              </Text>
                            </View>
                          </View>

                          <View className="mt-2">
                            <Accordion type="single" collapsible>
                              <AccordionItem value="accent-color" className="border border-border rounded-md">
                                <AccordionTrigger className="px-3 py-2">
                                  <View className="flex-row items-center gap-2">
                                    <View style={{ backgroundColor: accentColor.hex || '#2563EB' }} className="w-5 h-5 rounded-sm border border-border" />
                                    <Text className="text-sm">{accentColor.label}</Text>
                                  </View>
                                </AccordionTrigger>
                                <AccordionContent className="p-3 border-t border-border">
                                  <View className="flex-row flex-wrap gap-2 justify-center items-center">
                                    {ACCENT_COLOR_OPTIONS.map((option) => (
                                      <Button
                                        key={option.value}
                                        size="sm"
                                        variant={accentColor.value === option.value ? 'secondary' : 'ghost'}
                                        className={cn(
                                          'border rounded-md p-1',
                                          accentColor.value === option.value ? 'border border-primary' : 'border border-border'
                                        )}
                                        onPress={() => updateAccentColor({
                                          label: option.label,
                                          value: option.value,
                                          hex: option.hex || '#2563EB'
                                        })}
                                      >
                                        <View
                                          style={{ backgroundColor: option.hex || '#000' }}
                                          className={cn(
                                            'w-6 h-6 rounded-sm border',
                                            accentColor.value === option.value ? 'border-primary' : 'border-border'
                                          )}
                                        />
                                      </Button>
                                    ))}
                                  </View>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </View>
                        </View>

                        <View className="border border-border rounded-md p-3">
                          <View className="flex-row items-center gap-3">
                            <Icon as={VolumeXIcon} size={20} />
                            <View className="flex-1">
                              <Text className="font-medium text-base">Sound Effects</Text>
                              <Text className="text-sm text-muted-foreground mt-1">
                                Enable interface sound effects and haptic feedback
                              </Text>
                            </View>
                            <SwitchComponent
                              checked={soundEnabled}
                              onCheckedChange={setSoundEnabled}
                            />
                          </View>
                        </View>
                      </>
                    )}

                    {selectedCategory === 'account' && (
                      <>
                        <View className="mb-4">
                          <Text className="text-lg font-semibold text-foreground mb-3">Profile</Text>
                          
                          <View className="gap-4">
                            <View className="p-4 bg-card rounded-xl border border-border">
                              <Label className="text-sm font-medium text-foreground mb-2">Email Address</Label>
                              <Input 
                                value={email}
                                onChangeText={setEmail}
                                placeholder="your.email@example.com" 
                                keyboardType="email-address"
                                className="bg-background/50"
                              />
                            </View>
                            
                            <View className="p-4 bg-card rounded-xl border border-border">
                              <Label className="text-sm font-medium text-foreground mb-2">Display Name</Label>
                              <Input 
                                value={displayName}
                                onChangeText={setDisplayName}
                                placeholder="Your Name" 
                                className="bg-background/50"
                              />
                            </View>
                          </View>
                        </View>

                        <View className="mb-4">
                          <Text className="text-lg font-semibold text-foreground mb-3">Preferences</Text>
                          
                          <View className="gap-4">
                            <View className="border border-border rounded-md p-3">
                              <View className="flex-row items-center gap-3">
                                <Icon as={BellIcon} size={20} />
                                <View className="flex-1">
                                  <Text className="font-medium text-base">Push Notifications</Text>
                                  <Text className="text-sm text-muted-foreground mt-1">Receive updates and alerts on your device</Text>
                                </View>
                                <SwitchComponent
                                  checked={notifications}
                                  onCheckedChange={setNotifications}
                                />
                              </View>
                            </View>

                            <View className="border border-border rounded-md p-3">
                              <View className="flex-row items-center gap-3">
                                <Icon as={DatabaseIcon} size={20} />
                                <View className="flex-1">
                                  <Text className="font-medium text-base">Auto Sync</Text>
                                  <Text className="text-sm text-muted-foreground mt-1">Automatically sync data across all your devices</Text>
                                </View>
                                <SwitchComponent
                                  checked={autoSync}
                                  onCheckedChange={setAutoSync}
                                />
                              </View>
                            </View>

                            <View className="border border-border rounded-md p-3">
                              <View className="flex-row items-center gap-3">
                                <Icon as={ShieldIcon} size={20} />
                                <View className="flex-1">
                                  <Text className="font-medium text-base">Privacy Level</Text>
                                  <Text className="text-sm text-muted-foreground mt-1">Manage your privacy and data preferences</Text>
                                </View>
                              </View>

                              <View className="mt-2">
                                <Accordion type="single" collapsible>
                                  <AccordionItem value="privacy-level" className="border border-border rounded-md">
                                    <AccordionTrigger className="px-3 py-2">
                                      <Text className="text-sm">{privacyLevel.label}</Text>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-3 border-t border-border">
                                      <View className="flex-row flex-wrap gap-2 justify-center items-center">
                                        {PRIVACY_LEVEL_OPTIONS.map((option) => (
                                          <Button
                                            key={option.value}
                                            size="sm"
                                            variant={privacyLevel.value === option.value ? 'secondary' : 'ghost'}
                                            className="border border-border rounded-md px-3 py-1"
                                            onPress={() => setPrivacyLevel(option)}
                                          >
                                            <Text>{option.label}</Text>
                                          </Button>
                                        ))}
                                      </View>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </View>
                            </View>
                          </View>
                        </View>

                        <View>
                          <Text className="text-lg font-semibold text-foreground mb-3">Security</Text>
                          
                          <View className="border border-border rounded-md p-3">
                            <View className="flex-row items-center gap-3">
                              <Icon as={LockIcon} size={20} />
                              <View className="flex-1">
                                <Text className="font-medium text-base">Change Password</Text>
                                <Text className="text-sm text-muted-foreground mt-1">
                                  Update your account password for better security
                                </Text>
                              </View>
                              <Button variant="ghost" size="sm" onPress={showChangePasswordAlert}>
                                <Text>Change</Text>
                              </Button>
                            </View>
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                </ScrollView>
              </View>
            ) : (
              <View className="flex-1">
                <View className="flex-row items-center justify-between p-4 border-b border-border bg-background">
                  <Text className="text-xl font-bold text-foreground">Settings</Text>
                  <TouchableOpacity onPress={handleClose}>
                    <Icon as={XIcon} size={24} className="text-foreground" />
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  className="flex-1" 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ padding: 16 }}
                >
                  <View className="gap-4">
                    {SETTINGS_CATEGORIES.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        onPress={() => handleCategoryPress(category.id)}
                        className="flex-row items-center gap-4 p-4 bg-card rounded-xl border border-border active:bg-card/80"
                      >
                        <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                          <Icon as={category.icon} size={24} className="text-primary" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-lg font-semibold text-foreground">{category.name}</Text>
                          <Text className="text-sm text-muted-foreground mt-1">
                            {category.description}
                          </Text>
                        </View>
                        <Icon as={ChevronRightIcon} size={20} className="text-muted-foreground" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </SafeAreaView>
        </Modal>
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
  <DialogContent className="w-full max-w-2xl md:max-w-4xl lg:max-w-5xl h-auto max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-2">
            <Icon as={SettingsIcon} size={20} />
            <Text>Settings</Text>
          </DialogTitle>
        </DialogHeader>
        
        <View className="flex-row flex-1 min-h-0">
          <View className="w-48 border-r border-border pr-4">
            <ScrollView className="flex-1">
              <View className="gap-2 pt-2">
                {SETTINGS_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => setSelectedCategory(category.id)}
                    className={cn(
                      'flex-row items-center gap-3 p-3 rounded-lg',
                      selectedCategory === category.id 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <Icon 
                      as={category.icon} 
                      size={18} 
                      className={cn(
                        selectedCategory === category.id 
                          ? 'text-primary' 
                          : 'text-muted-foreground'
                      )}
                    />
                    <Text className={cn(
                      'text-sm font-medium',
                      selectedCategory === category.id 
                        ? 'text-primary' 
                        : 'text-foreground'
                    )}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          
          <View className="flex-1 min-h-0">
            {selectedCategory && (
              <ScrollView className="flex-1 p-6">
                <View className="gap-6">
                  {selectedCategory === 'appearance' && (
                    <>
                      <View className="flex-row items-center justify-between border border-border rounded-md p-3">
                        <View className="flex-row items-center gap-3 flex-1">
                          <Icon as={darkMode ? MoonIcon : SunIcon} size={20} />
                          <View className="flex-1">
                            <Text className="font-medium text-base">Dark Mode</Text>
                            <Text className="text-sm text-muted-foreground mt-1">
                              Switch between light and dark themes
                            </Text>
                          </View>
                        </View>
                        <SwitchComponent
                          checked={darkMode}
                          onCheckedChange={handleDarkModeToggle}
                        />
                      </View>
                      
                      <View className="flex-row items-center gap-3 border border-border rounded-md p-3">
                        <View className="flex-row items-center gap-3 flex-1">
                          <Icon as={TypeIcon} size={20} />
                          <View className="flex-1">
                            <Text className="font-medium text-base">Font Size</Text>
                            <Text className="text-sm text-muted-foreground mt-1">
                              Adjust text size for better readability
                            </Text>
                          </View>
                        </View>

                        <View className="w-40">
                          <Accordion type="single" collapsible className="border border-border rounded-md p-1">
                            <AccordionItem value="font-size" className="border border-border rounded-md">
                              <AccordionTrigger className="px-3">
                                <Text className="text-sm">{currentFontSizeOption.label}</Text>
                              </AccordionTrigger>
                              <AccordionContent className="p-3 border-t border-border min-h-[260px]">
                                <View className="flex-col gap-2">
                                    {FONT_SIZE_OPTIONS.map((option) => (
                                      <Button
                                        key={option.value}
                                        size="sm"
                                        variant={currentFontSizeOption.value === option.value ? 'secondary' : 'ghost'}
                                        className={cn(
                                          'w-full justify-start border border-border rounded-md px-3 py-3 min-h-[56px]',
                                          currentFontSizeOption.value === option.value ? 'border-primary' : ''
                                        )}
                                        onPress={() => updateFontSize(option.value as 'small' | 'medium' | 'large' | 'xl')}
                                      >
                                        <Text 
                                          disableFontScaling={true}
                                          className={cn(
                                          option.value === 'small' ? 'text-sm leading-relaxed' :
                                          option.value === 'medium' ? 'text-base leading-relaxed' :
                                          option.value === 'large' ? 'text-lg leading-relaxed' :
                                          'text-xl leading-relaxed'
                                        )}>{option.label}</Text>
                                      </Button>
                                    ))}
                                </View>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </View>
                      </View>

                      <View className="flex-row items-center gap-3 border border-border rounded-md p-3">
                        <View className="flex-row items-center gap-3 flex-1">
                          <Icon as={PaletteIcon} size={20} />
                          <View className="flex-1">
                            <Text className="font-medium text-base">Accent Color</Text>
                            <Text className="text-sm text-muted-foreground mt-1">
                              Choose your preferred accent color
                            </Text>
                          </View>
                        </View>

                        <View className="w-40">
                          <Accordion type="single" collapsible className="border border-border rounded-md p-1">
                            <AccordionItem value="accent-color" className="border border-border rounded-md">
                              <AccordionTrigger className="px-3 py-2">
                                <View className="flex-row items-center gap-2">
                                  <View style={{ backgroundColor: accentColor.hex || '#2563EB' }} className="w-5 h-5 rounded-sm border border-border" />
                                  <Text className="text-sm">{accentColor.label}</Text>
                                </View>
                              </AccordionTrigger>
                              <AccordionContent className="p-3 border-t border-border min-h-[260px]">
                                <View className="flex-row flex-wrap gap-2 justify-center items-center">
                                  {ACCENT_COLOR_OPTIONS.map((option) => (
                                    <Button
                                      key={option.value}
                                      size="sm"
                                      variant={accentColor.value === option.value ? 'secondary' : 'ghost'}
                                      className={cn(
                                        'border rounded-md p-1',
                                        accentColor.value === option.value ? 'border border-primary' : 'border border-border'
                                      )}
                                      onPress={() => updateAccentColor({
                                        label: option.label,
                                        value: option.value,
                                        hex: option.hex || '#2563EB'
                                      })}
                                    >
                                      <View
                                        style={{ backgroundColor: option.hex || '#000' }}
                                        className={cn(
                                          'w-6 h-6 rounded-sm border',
                                          accentColor.value === option.value ? 'border-primary' : 'border-border'
                                        )}
                                      />
                                    </Button>
                                  ))}
                                </View>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </View>
                      </View>

                      <View className="flex-row items-center justify-between border border-border rounded-md p-3">
                        <View className="flex-row items-center gap-3 flex-1">
                          <Icon as={VolumeXIcon} size={20} />
                          <View className="flex-1">
                            <Text className="font-medium text-base">Sound Effects</Text>
                            <Text className="text-sm text-muted-foreground mt-1">
                              Enable interface sound effects
                            </Text>
                          </View>
                        </View>
                        <SwitchComponent
                          checked={soundEnabled}
                          onCheckedChange={setSoundEnabled}
                        />
                      </View>
                    </>
                  )}

                  {selectedCategory === 'account' && (
                    <>
                      <View className="gap-3">
                        <Label className="font-medium text-base">Email Address</Label>
                        <Input 
                          value={email}
                          onChangeText={setEmail}
                          placeholder="your.email@example.com" 
                          keyboardType="email-address"
                        />
                      </View>
                      
                      <View className="gap-3">
                        <Label className="font-medium text-base">Display Name</Label>
                        <Input 
                          value={displayName}
                          onChangeText={setDisplayName}
                          placeholder="Your Name" 
                        />
                      </View>
                      
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3 flex-1">
                          <Icon as={BellIcon} size={20} />
                          <View className="flex-1">
                            <Text className="font-medium text-base">Push Notifications</Text>
                            <Text className="text-sm text-muted-foreground mt-1">
                              Receive updates and alerts
                            </Text>
                          </View>
                        </View>
                        <SwitchComponent
                          checked={notifications}
                          onCheckedChange={setNotifications}
                        />
                      </View>
                      
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3 flex-1">
                          <Icon as={DatabaseIcon} size={20} />
                          <View className="flex-1">
                            <Text className="font-medium text-base">Auto Sync</Text>
                            <Text className="text-sm text-muted-foreground mt-1">
                              Automatically sync data across devices
                            </Text>
                          </View>
                        </View>
                        <SwitchComponent
                          checked={autoSync}
                          onCheckedChange={setAutoSync}
                        />
                      </View>

                      <View className="flex-row items-center gap-3">
                        <View className="flex-row items-center gap-3 flex-1">
                          <Icon as={ShieldIcon} size={20} />
                          <View className="flex-1">
                            <Text className="font-medium text-base">Privacy Level</Text>
                            <Text className="text-sm text-muted-foreground mt-1">
                              Manage your privacy and data preferences
                            </Text>
                          </View>
                        </View>

                        <View className="w-40">
                          <Accordion type="single" collapsible className="border border-border rounded-md p-1">
                            <AccordionItem value="privacy-level" className="border border-border rounded-md">
                              <AccordionTrigger className="px-3 py-2">
                                <Text className="text-sm">{privacyLevel.label}</Text>
                              </AccordionTrigger>
                              <AccordionContent className="p-3 border-t border-border">
                                <View className="flex-row flex-wrap gap-2 justify-center items-center">
                                  {PRIVACY_LEVEL_OPTIONS.map((option) => (
                                    <Button
                                      key={option.value}
                                      size="sm"
                                      variant={privacyLevel.value === option.value ? 'secondary' : 'ghost'}
                                      className="border border-border rounded-md px-3 py-1"
                                      onPress={() => setPrivacyLevel(option)}
                                    >
                                      <Text>{option.label}</Text>
                                    </Button>
                                  ))}
                                </View>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </View>
                      </View>

                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3 flex-1">
                          <Icon as={LockIcon} size={20} />
                          <View className="flex-1">
                            <Text className="font-medium text-base">Change Password</Text>
                            <Text className="text-sm text-muted-foreground mt-1">
                              Update your account password
                            </Text>
                          </View>
                        </View>
                        <Button variant="ghost" size="sm" onPress={showChangePasswordAlert}>
                          <Text>Change</Text>
                        </Button>
                      </View>
                    </>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
        
        <View className="pt-4 border-t border-border">
          <Button 
            variant="outline" 
            onPress={() => setOpen(false)}
            className="w-full"
          >
            <Text>Close</Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
}

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { THEME } from '@/lib/theme';
import { Link, Stack } from 'expo-router';
import { MoonStarIcon, StarIcon, SunIcon, SettingsIcon, UserPlusIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, type ImageStyle, View } from 'react-native';
import { SettingsModal } from '@/components/SettingsModal';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const SCREEN_OPTIONS = {
  light: {
    title: 'React Native Reusables',
    headerTransparent: true,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.light.background },
    headerLeft: () => <SettingsButton />,
  },
  dark: {
    title: 'React Native Reusables',
    headerTransparent: true,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.dark.background },
    headerLeft: () => <SettingsButton />,
  },
};

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

export default function Screen() {
  const { colorScheme } = useColorScheme();
  const [switchChecked, setSwitchChecked] = React.useState(true);
  const [checkboxChecked, setCheckboxChecked] = React.useState(true);
  const [radioValue, setRadioValue] = React.useState('option1');

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS[colorScheme ?? 'light']} />
      <View className="flex-1 items-center justify-center gap-8 p-4">
        <Image source={LOGO[colorScheme ?? 'light']} style={IMAGE_STYLE} resizeMode="contain" />
        <View className="gap-2 p-4">
          <Text className="ios:text-foreground font-mono text-sm text-muted-foreground">
            1. Edit <Text variant="code">app/index.tsx</Text> to get started.
          </Text>
          <Text className="ios:text-foreground font-mono text-sm text-muted-foreground">
            2. Save to see your changes instantly.
          </Text>
        </View>
        <View className="flex-row gap-2 flex-wrap justify-center">
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
          <Link href="/create-account" asChild>
            <Button variant="outline">
              <Text>Create Account</Text>
              <Icon as={UserPlusIcon} />
            </Button>
          </Link>
        </View>

        {/* Accent Color Test Elements */}
        <View className="w-full max-w-sm gap-4 p-4 bg-card rounded-lg border">
          <Text className="text-lg font-semibold text-center">Accent Color Test Elements</Text>
          
          <View className="gap-3">
            <Text className="text-sm font-medium">Button (Default - uses bg-primary)</Text>
            <Button className="w-full">
              <Text>Primary Button</Text>
            </Button>
          </View>

          <View className="gap-3">
            <Text className="text-sm font-medium">Switch (uses bg-primary when checked)</Text>
            <View className="flex-row items-center gap-2">
              <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} />
              <Text className="text-sm">Interactive Switch</Text>
            </View>
          </View>

          <View className="gap-3">
            <Text className="text-sm font-medium">Checkbox (uses bg-primary when checked)</Text>
            <View className="flex-row items-center gap-2">
              <Checkbox checked={checkboxChecked} onCheckedChange={setCheckboxChecked} />
              <Text className="text-sm">Interactive Checkbox</Text>
            </View>
          </View>

          <View className="gap-3">
            <Text className="text-sm font-medium">Progress Bar (uses bg-primary)</Text>
            <Progress value={75} className="w-full" />
            <Text className="text-xs text-muted-foreground">75% Complete</Text>
          </View>

          <View className="gap-3">
            <Text className="text-sm font-medium">Badge (uses bg-primary)</Text>
            <View className="flex-row gap-2 flex-wrap">
              <Badge>Default Badge</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
            </View>
          </View>

          <View className="gap-3">
            <Text className="text-sm font-medium">Radio Group (uses bg-primary for indicator)</Text>
            <RadioGroup value={radioValue} onValueChange={setRadioValue}>
              <View className="flex-row items-center gap-2">
                <RadioGroupItem value="option1" />
                <Text className="text-sm">Option 1</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <RadioGroupItem value="option2" />
                <Text className="text-sm">Option 2</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <RadioGroupItem value="option3" />
                <Text className="text-sm">Option 3</Text>
              </View>
            </RadioGroup>
          </View>
        </View>
      </View>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

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

function SettingsButton() {
  return (
    <SettingsModal>
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full web:mx-4">
        <Icon as={SettingsIcon} className="size-5" />
      </Button>
    </SettingsModal>
  );
}

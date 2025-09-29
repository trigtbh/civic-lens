import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { BellIcon, UserIcon, PaletteIcon, TypeIcon, XIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { colorScheme } = useColorScheme();

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-foreground mb-3">{title}</Text>
      <View className="space-y-2">{children}</View>
    </View>
  );

  const SettingsItem = ({ 
    icon, 
    title, 
    description, 
    onPress 
  }: { 
    icon: any; 
    title: string; 
    description: string; 
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center p-3 bg-card rounded-lg border border-border active:bg-accent">
      <Icon as={icon} className="size-5 text-muted-foreground mr-3" />
      <View className="flex-1">
        <Text className="text-base font-medium text-foreground">{title}</Text>
        <Text className="text-sm text-muted-foreground">{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View 
          className="bg-background rounded-lg shadow-lg w-full max-w-md border border-border"
          style={{ 
            backgroundColor: colorScheme === 'dark' ? THEME.dark.card : THEME.light.card,
            borderColor: colorScheme === 'dark' ? THEME.dark.border : THEME.light.border,
          }}>
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-border">
            <Text className="text-xl font-semibold text-foreground">Settings</Text>
            <Button
              onPress={onClose}
              size="icon"
              variant="ghost"
              className="rounded-full">
              <Icon as={XIcon} className="size-5" />
            </Button>
          </View>

          {/* Content */}
          <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
            <SettingsSection title="Display Options">
              <SettingsItem
                icon={PaletteIcon}
                title="Theme"
                description="Choose your preferred color scheme"
                onPress={() => console.log('Theme settings')}
              />
              <SettingsItem
                icon={TypeIcon}
                title="Typography"
                description="Customize fonts and text size"
                onPress={() => console.log('Typography settings')}
              />
            </SettingsSection>

            <SettingsSection title="User Account">
              <SettingsItem
                icon={UserIcon}
                title="Profile"
                description="Manage your account information"
                onPress={() => console.log('Profile settings')}
              />
              <SettingsItem
                icon={BellIcon}
                title="Notifications"
                description="Configure notification preferences"
                onPress={() => console.log('Notification settings')}
              />
            </SettingsSection>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
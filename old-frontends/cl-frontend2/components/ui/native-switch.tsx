import React from 'react';
import { Switch as RNSwitch, Platform } from 'react-native';
import { cn } from '@/lib/utils';

interface NativeSwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const NativeSwitch = React.forwardRef<RNSwitch, NativeSwitchProps>(
  ({ checked, onCheckedChange, disabled, className, ...props }, ref) => {
    return (
      <RNSwitch
        ref={ref}
        value={checked}
        onValueChange={onCheckedChange}
        disabled={disabled}
        // Apply some basic styling to match your design
        thumbColor={checked ? '#ffffff' : '#f4f3f4'}
        trackColor={{ 
          false: Platform.OS === 'ios' ? '#767577' : '#81b0ff',
          true: '#81b0ff' 
        }}
        ios_backgroundColor="#3e3e3e"
        {...props}
      />
    );
  }
);

NativeSwitch.displayName = 'NativeSwitch';
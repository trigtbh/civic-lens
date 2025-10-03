import { cn } from '@/lib/utils';
import * as SwitchPrimitives from '@rn-primitives/switch';
import { Platform, Switch as RNSwitch } from 'react-native';
import * as React from 'react';
import { useSettings } from '@/lib/SettingsContext';

const Switch = React.forwardRef<
  SwitchPrimitives.RootRef | RNSwitch,
  SwitchPrimitives.RootProps
>(({ className, ...props }, ref) => {
  const { accentColor } = useSettings();

  // Use native switch on mobile platforms
  if (Platform.OS !== 'web') {
    return (
      <RNSwitch
        ref={ref as React.RefObject<RNSwitch>}
        value={props.checked}
        onValueChange={props.onCheckedChange}
        disabled={props.disabled}
        trackColor={{
          false: '#767577',
          true: accentColor.hex,
        }}
        thumbColor={props.checked ? '#ffffff' : '#f4f3f4'}
        ios_backgroundColor="#767577"
        style={{ opacity: props.disabled ? 0.5 : 1 }}
      />
    );
  }

  // Use custom switch on web
  return (
    <SwitchPrimitives.Root
      ref={ref as React.RefObject<SwitchPrimitives.RootRef>}
      className={cn(
        'flex h-[1.15rem] w-8 shrink-0 flex-row items-center rounded-full border border-transparent shadow-sm shadow-black/5',
        Platform.select({
          web: 'focus-visible:border-ring focus-visible:ring-ring/50 peer inline-flex outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed',
        }),
        props.checked ? 'bg-primary' : 'bg-input dark:bg-input/80',
        props.disabled && 'opacity-50',
        className
      )}
      {...props}>
      <SwitchPrimitives.Thumb
        className={cn(
          'bg-background size-4 rounded-full transition-transform',
          Platform.select({
            web: 'pointer-events-none block ring-0',
          }),
          props.checked
            ? 'dark:bg-primary-foreground translate-x-3.5'
            : 'dark:bg-foreground translate-x-0'
        )}
      />
    </SwitchPrimitives.Root>
  );
});

Switch.displayName = 'Switch';

export { Switch };

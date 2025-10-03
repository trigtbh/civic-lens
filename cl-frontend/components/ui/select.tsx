import { Icon } from '@/components/ui/icon';
import { NativeOnlyAnimatedView } from '@/components/ui/native-only-animated-view';
import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as SelectPrimitive from '@rn-primitives/select';
import { Check, ChevronDown, ChevronDownIcon, ChevronUpIcon } from 'lucide-react-native';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';

type Option = SelectPrimitive.Option;

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

function SelectValue({
  ref,
  className,
  ...props
}: SelectPrimitive.ValueProps &
  React.RefAttributes<SelectPrimitive.ValueRef> & {
    className?: string;
  }) {
  const { value } = SelectPrimitive.useRootContext();
  return (
    <SelectPrimitive.Value
      ref={ref}
      className={cn(
        'text-foreground line-clamp-1 flex flex-row items-center gap-2 text-sm',
        !value && 'text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

function SelectTrigger({
  ref,
  className,
  children,
  size = 'default',
  ...props
}: SelectPrimitive.TriggerProps &
  React.RefAttributes<SelectPrimitive.TriggerRef> & {
    children?: React.ReactNode;
    size?: 'default' | 'sm';
  }) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        'border-input dark:bg-input/30 dark:active:bg-input/50 bg-background flex h-10 flex-row items-center justify-between gap-2 rounded-md border px-3 py-2 shadow-sm shadow-black/5 sm:h-9',
        Platform.select({
          web: 'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:hover:bg-input/50 w-fit whitespace-nowrap text-sm outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0',
        }),
        props.disabled && 'opacity-50',
        size === 'sm' && 'h-8 py-2 sm:py-1.5',
        className
      )}
      {...props}>
      <>{children}</>
      <Icon as={ChevronDown} aria-hidden={true} className="text-muted-foreground size-4" />
    </SelectPrimitive.Trigger>
  );
}

const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

function SelectContent({
  className,
  children,
  position = 'popper',
  portalHost,
  ...props
}: SelectPrimitive.ContentProps &
  React.RefAttributes<SelectPrimitive.ContentRef> & {
    className?: string;
    portalHost?: string;
  }) {
  const contentRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const el = contentRef.current as HTMLElement | null;
    if (!el) return;

    const getComputedVars = () => {
      const root = document.documentElement;
      const highlightRaw = (getComputedStyle(root).getPropertyValue('--highlight') || '').trim();
      const primaryRaw = (getComputedStyle(root).getPropertyValue('--primary') || '').trim();
      const accentFgRaw = (getComputedStyle(root).getPropertyValue('--accent-foreground') || '').trim();

      const normalize = (v: string, fallback: string) => {
        if (!v) return fallback;
        v = v.trim();
        if (v.startsWith('hsl(')) return v;
        if (v.split(' ').length === 3) return `hsl(${v})`;
        return v;
      };

      const lighten = (hsl: string, amount = 18) => {
        const m = hsl.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
        if (!m) return hsl;
        const h = m[1];
        const s = m[2];
        const l = Math.min(100, parseInt(m[3], 10) + amount);
        return `hsl(${h} ${s}% ${l}%)`;
      };

      const primary = normalize(primaryRaw, 'hsl(0 0% 96.1%)');
      const highlight = highlightRaw ? normalize(highlightRaw, '') : lighten(primary, 18);
      const accentFg = normalize(accentFgRaw, 'hsl(0 0% 9%)');
      return { highlight, accentFg, primary };
    };

    const { highlight, accentFg, primary } = getComputedVars();
    if (highlight) el.style.setProperty('--highlight', highlight);
    if (accentFg) el.style.setProperty('--accent-foreground', accentFg);
    if (primary) el.style.setProperty('--primary', primary);

    // Tag the content node so we can inject scoped rules that override other utilities
    el.setAttribute('data-theme-content', '1');

    // Inject a high-specificity style to force highlight usage for selected/hovered items
    const styleId = 'civic-lens-select-highlight-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        [data-theme-content="1"] [data-selected],
        [data-theme-content="1"] [aria-selected="true"],
        [data-theme-content="1"] [data-state="checked"],
        [data-theme-content="1"] [role="option"]:hover,
        [data-theme-content="1"] [data-highlighted],
        [data-theme-content="1"] [data-state="open"] {
          background: var(--highlight) !important;
          color: var(--accent-foreground) !important;
        }
      `;
      document.head.appendChild(style);
    }

    // also observe document root for changes and update if vars change
    const ro = new MutationObserver(() => {
      const { highlight: nh, accentFg: naf, primary: np } = getComputedVars();
      if (nh) el.style.setProperty('--highlight', nh);
      if (naf) el.style.setProperty('--accent-foreground', naf);
      if (np) el.style.setProperty('--primary', np);
    });
    ro.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

    return () => ro.disconnect();
  }, [portalHost, position, className]);
  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <SelectPrimitive.Overlay style={Platform.select({ native: StyleSheet.absoluteFill })}>
          <TextClassContext.Provider value="text-popover-foreground">
            <NativeOnlyAnimatedView className="z-50" entering={FadeIn} exiting={FadeOut}>
              <SelectPrimitive.Content
                ref={contentRef}
                className={cn(
                  'bg-popover border-border relative z-50 min-w-[8rem] rounded-md border shadow-md shadow-black/5',
                  Platform.select({
                    web: cn(
                      'animate-in fade-in-0 zoom-in-95 origin-(--radix-select-content-transform-origin) max-h-52 overflow-y-auto overflow-x-hidden',
                      props.side === 'bottom' && 'slide-in-from-top-2',
                      props.side === 'top' && 'slide-in-from-bottom-2'
                    ),
                    native: 'p-1',
                  }),
                  position === 'popper' &&
                    Platform.select({
                      web: cn(
                        props.side === 'bottom' && 'translate-y-1',
                        props.side === 'top' && '-translate-y-1'
                      ),
                    }),
                  className
                )}
                position={position}
                {...props}>
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                  className={cn(
                    'p-1',
                    position === 'popper' &&
                      cn(
                        'w-full',
                        Platform.select({
                          web: 'h-[var(--radix-select-trigger-height)] min-w-[var(--radix-select-trigger-width)]',
                        })
                      )
                  )}>
                  {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
              </SelectPrimitive.Content>
            </NativeOnlyAnimatedView>
          </TextClassContext.Provider>
        </SelectPrimitive.Overlay>
      </FullWindowOverlay>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.LabelProps & React.RefAttributes<SelectPrimitive.LabelRef>) {
  return (
    <SelectPrimitive.Label
      className={cn('text-muted-foreground px-2 py-2 text-xs sm:py-1.5', className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.ItemProps & React.RefAttributes<SelectPrimitive.ItemRef>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        // Use highlight for hover/active/selected backgrounds and accent-foreground for contrast
  'active:bg-[hsl(var(--highlight))] hover:bg-[hsl(var(--highlight))] group relative flex w-full flex-row items-center gap-2 rounded-sm py-2 pl-2 pr-8 sm:py-1.5 data-[selected]:bg-[hsl(var(--highlight))]',
        Platform.select({
          web: 'focus:bg-[hsl(var(--highlight))] *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 cursor-default outline-none data-[disabled]:pointer-events-none [&_svg]:pointer-events-none',
        }),
        props.disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      <View className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon as={Check} className="text-muted-foreground size-4 shrink-0" />
        </SelectPrimitive.ItemIndicator>
      </View>
      <SelectPrimitive.ItemText className="text-foreground group-data-[selected]:!text-[hsl(var(--accent-foreground))] group-hover:group-data-[selected]:!text-[hsl(var(--accent-foreground))] group-hover:!text-[hsl(var(--accent-foreground))] group-active:!text-[hsl(var(--accent-foreground))] group-focus:!text-[hsl(var(--accent-foreground))] select-none text-sm" />
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.SeparatorProps & React.RefAttributes<SelectPrimitive.SeparatorRef>) {
  return (
    <SelectPrimitive.Separator
      className={cn(
        'bg-border -mx-1 my-1 h-px',
        Platform.select({ web: 'pointer-events-none' }),
        className
      )}
      {...props}
    />
  );
}

/**
 * @platform Web only
 * Returns null on native platforms
 */
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  if (Platform.OS !== 'web') {
    return null;
  }
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}>
      <Icon as={ChevronUpIcon} className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

/**
 * @platform Web only
 * Returns null on native platforms
 */
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  if (Platform.OS !== 'web') {
    return null;
  }
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}>
      <Icon as={ChevronDownIcon} className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

/**
 * @platform Native only
 * Returns the children on the web
 */
function NativeSelectScrollView({ className, ...props }: React.ComponentProps<typeof ScrollView>) {
  if (Platform.OS === 'web') {
    return <>{props.children}</>;
  }
  return <ScrollView className={cn('max-h-52', className)} {...props} />;
}

export {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type Option,
};

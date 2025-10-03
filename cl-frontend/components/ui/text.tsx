import { cn } from '@/lib/utils';
import * as Slot from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role } from 'react-native';
import { useSettings } from '@/lib/SettingsContext';
import extractor, { addTextsFromNode, registerText, postTexts } from './text-extractor';

const textVariants = cva(
  cn(
    'text-foreground text-base',
    Platform.select({
      web: 'select-text',
    })
  ),
  {
    variants: {
      variant: {
        default: '',
        h1: cn(
          'text-center text-4xl font-extrabold tracking-tight',
          Platform.select({ web: 'scroll-m-20 text-balance' })
        ),
        h2: cn(
          'border-border border-b pb-2 text-3xl font-semibold tracking-tight',
          Platform.select({ web: 'scroll-m-20 first:mt-0' })
        ),
        h3: cn('text-2xl font-semibold tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        h4: cn('text-xl font-semibold tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        p: 'mt-3 leading-7 sm:mt-6',
        blockquote: 'mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6',
        code: cn(
          'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'
        ),
        lead: 'text-muted-foreground text-xl',
        large: 'text-lg font-semibold',
        small: 'text-sm font-medium leading-none',
        muted: 'text-muted-foreground text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps['variant']>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  blockquote: Platform.select({ web: 'blockquote' as Role }),
  code: Platform.select({ web: 'code' as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
};

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  variant = 'default',
  disableFontScaling = false,
  ...props
}: React.ComponentProps<typeof RNText> & 
  TextVariantProps & 
  React.RefAttributes<RNText> & {
    asChild?: boolean;
    disableFontScaling?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const { fontScale } = useSettings();
  const Component = asChild ? Slot.Text : RNText;
  
  // Apply font scaling to text (unless disabled)
  const scaledProps = React.useMemo(() => {
    if (fontScale !== 1 && !disableFontScaling) {
      const currentStyle = Array.isArray(props.style) ? props.style : [props.style];
      return {
        ...props,
        style: [
          ...currentStyle,
          { fontSize: fontScale * 16 } // Base font size of 16px scaled
        ]
      };
    }
    return props;
  }, [fontScale, props, disableFontScaling]);

  // Extract any string/number children for translation collection.
  // We run this in an effect so it happens during rendering lifecycle but
  // doesn't block the UI. It will collect nested children as well.
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const children = (props as any).children as React.ReactNode;
    if (children) {
      try {
        const newly = addTextsFromNode(children);
        if (newly && newly.length) {
          // Log newly discovered strings (only the message strings themselves)
          // eslint-disable-next-line no-console
          newly.forEach(s => console.log(s));
          // Fire-and-forget POST to backend to persist the texts
          try {
            postTexts(newly).catch(() => {});
          } catch (e) {
            // swallow
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[Text extractor] error while extracting texts', err);
      }
    }
    // Also handle the single-value case explicitly
    if (typeof children === 'string' || typeof children === 'number') {
      const s = registerText(children);
      if (s) {
        // eslint-disable-next-line no-console
        console.log(s);
      }
    }
  }, [props.children]);
  
  return (
    <Component
      className={cn(textVariants({ variant }), textClass, className)}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...scaledProps}
    />
  );
}export { Text, TextClassContext };

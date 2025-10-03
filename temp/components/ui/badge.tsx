import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as Slot from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, View, Text } from 'react-native';
import type { ViewProps } from 'react-native';
import * as React from 'react';

const badgeVariants = cva(
  cn(
    'border-border group shrink-0 flex-row items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-0.5',
    Platform.select({
      web: 'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-fit whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3',
    })
  ),
  {
    variants: {
      variant: {
        default: cn(
          'bg-primary border-transparent',
          Platform.select({ web: '[a&]:hover:bg-primary/90' })
        ),
        secondary: cn(
          'bg-secondary border-transparent',
          Platform.select({ web: '[a&]:hover:bg-secondary/90' })
        ),
        destructive: cn(
          'bg-destructive border-transparent',
          Platform.select({ web: '[a&]:hover:bg-destructive/90' })
        ),
        outline: Platform.select({ web: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground' }),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const badgeTextVariants = cva('text-xs font-medium', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-white',
      outline: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type BadgeProps = ViewProps & { children?: React.ReactNode; className?: string };

const Badge = React.forwardRef<any, BadgeProps>(({ children, className, ...props }, ref) => {
  const renderChildren = (child: React.ReactNode) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return <Text className={className}>{child}</Text>;
    }
    if (Array.isArray(child)) {
      return child.map((c, i) =>
        typeof c === 'string' || typeof c === 'number' ? <Text key={i}>{c}</Text> : c
      );
    }
    return child;
  };

  return (
    <View ref={ref} {...props} className={className}>
      {renderChildren(children)}
    </View>
  );
});

Badge.displayName = 'Badge';

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };

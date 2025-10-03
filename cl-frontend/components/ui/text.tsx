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
  
  // Simple in-memory cache to avoid refetching the same string-target pair
  const translationCache = React.useRef<Map<string, string>>(new Map());

  // Resolve target language: prefer localStorage 'preferredLanguage', then document.lang, then navigator, then 'en'
  const resolveTargetLang = () => {
    try {
      if (typeof localStorage !== 'undefined') {
        const pref = localStorage.getItem('preferredLanguage');
        if (pref) return pref;
      }
    } catch (e) {
      // ignore
    }
    try {
      if (typeof document !== 'undefined' && document.documentElement?.lang) {
        return document.documentElement.lang;
      }
    } catch (e) {
      // ignore
    }
    try {
      // navigator.language may be like 'en-US' -> take first part
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nav = (typeof navigator !== 'undefined' ? (navigator as any).language || (navigator as any).userLanguage : undefined) as string | undefined;
      if (nav) return nav.split('-')[0];
    } catch (e) {
      // ignore
    }
    return 'en';
  };

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
  
  // If children is a plain string/number, attempt to fetch a translation and render it when available.
  // We don't block initial render; we render the original text and replace it when translation arrives.
  const [translated, setTranslated] = React.useState<string | null>(null);
  const [isTranslating, setIsTranslating] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const children = (props as any).children as React.ReactNode;
    if (typeof children === 'string' || typeof children === 'number') {
      const text = String(children).trim();
      if (!text) return;
      const target = resolveTargetLang();
      // Debug: show that we're attempting to translate this text
      // eslint-disable-next-line no-console
      console.log('[Text] detected string child for translation:', { text, target });
      const cacheKey = `${target}::${text}`;
      const cached = translationCache.current.get(cacheKey);
      if (cached) {
        // eslint-disable-next-line no-console
        console.log('[Text] cache hit for', cacheKey, '->', cached);
        setTranslated(cached);
        return;
      }

      let didCancel = false;
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : undefined;

      const doFetch = async () => {
        setIsTranslating(true);
        // eslint-disable-next-line no-console
        console.log('[Text] starting translation fetch for', cacheKey);
        console.log(target);
        let target2 = "zh";
        try {
          const resp = await fetch('https://translate.civiclens.app/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: text, source: 'en', target: target2 }),
            signal: controller?.signal,
          });
          if (!resp.ok) throw new Error(`status ${resp.status}`);
          const body = await resp.json();
          // Accept either {alternatives: [str]} or {translation: str}
          let result: string | undefined;
          if (body) {
            if (Array.isArray(body.alternatives) && body.alternatives.length) result = body.alternatives[0];
            if (!result && typeof body.translation === 'string') result = body.translation;
            if (!result && typeof body.text === 'string') result = body.text;
            if (!result && typeof body.translatedText === 'string') result = body.translatedText;
          }
          if (!didCancel && result) {
            translationCache.current.set(cacheKey, result);
            setTranslated(result);
            // eslint-disable-next-line no-console
            console.log('[Text] translation received for', cacheKey, '->', result);
          } else {
            // eslint-disable-next-line no-console
            console.log('[Text] translation fetch returned no result for', cacheKey, body);
          }
        } catch (err) {
          // noop: leave translated as null and render original
          // eslint-disable-next-line no-console
          console.debug('[Text] translation fetch failed for', cacheKey, err);
        } finally {
          if (!didCancel) setIsTranslating(false);
        }
      };

      // Fire-and-forget; update state when available
      doFetch();

      return () => {
        didCancel = true;
        try {
          controller?.abort();
        } catch (e) {
          // ignore
        }
      };
    }
    // If not a string/number, clear any previous translated state
    setTranslated(null);
    setIsTranslating(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.children]);

  // If we have a translated string, render that instead of children.
  // Otherwise render as before (children may be string, elements, etc).
  const children = (props as any).children as React.ReactNode;
  const content = typeof children === 'string' || typeof children === 'number' ? (translated ?? children) : children;

  return (
    <Component
      className={cn(textVariants({ variant }), textClass, className)}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...scaledProps}
    >
      {content}
    </Component>
  );
}

export { Text, TextClassContext };

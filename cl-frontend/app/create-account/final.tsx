import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { SafeAreaView, ScrollView, View, TextInput, Animated } from 'react-native';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { GlobeIcon } from 'lucide-react-native';
import translateLib from '@/lib/translate';
import { useTranslateBlocking } from '@/lib/useTranslateBlocking';

const SCREEN_OPTIONS = {
  light: {
    title: 'Create Account',
    headerTransparent: false,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.light.background },
    headerShown: false,
    animation: 'fade',
  },
  dark: {
    title: 'Create Account',
    headerTransparent: false,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.dark.background },
    headerShown: false,
    animation: 'fade',
  },
};

function strengthLabel(score: number) {
  switch (score) {
    case 0: return 'Very weak';
    case 1: return 'Weak';
    case 2: return 'Fair';
    case 3: return 'Good';
    case 4: return 'Strong';
    case 5: return 'Very strong';
    default: return '';
  }
}

export default function CreateAccountFinal() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  const opacity = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [opacity]);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [score, setScore] = React.useState(0);
  const [satisfied, setSatisfied] = React.useState<number>(0);
  const [checksState, setChecksState] = React.useState({
    length8: false,
    lower: false,
    upper: false,
    digit: false,
    symbol: false,
  });

  // Translate placeholders (top-level hooks)
  const { translated: usernameTranslated, loading: usernameLoading } = useTranslateBlocking('Choose a username');
  const { translated: passwordTranslated, loading: passwordLoading } = useTranslateBlocking('Create a strong password');

  React.useEffect(() => {
    // Checklist-based scoring: count requirements met and map to labels
    const pw = password || '';
    const checks = {
      length8: pw.length >= 8,
      lower: /[a-z]/.test(pw),
      upper: /[A-Z]/.test(pw),
      digit: /\d/.test(pw),
      symbol: /[^A-Za-z0-9]/.test(pw),
    };

    // Basic blacklist check for very common passwords
    const blacklist = ['password','123456','123456789','qwerty','abc123','letmein','admin','welcome','iloveyou'];
    const lower = pw.toLowerCase();
    const isCommon = pw.length > 0 && blacklist.includes(lower);

    let count = 0;
    for (const k of Object.keys(checks)) {
      if ((checks as any)[k]) count++;
    }

    // If common password, treat as 0 satisfied
    if (isCommon) {
      count = 0;
      setChecksState({ length8: false, lower: false, upper: false, digit: false, symbol: false });
    } else {
      setChecksState(checks);
    }

    setSatisfied(count);

    // Map satisfied count to score and labels (0-5 -> Very weak..Very strong)
    // 0 -> Very weak, 1 -> Weak, 2 -> Fair, 3 -> Good, 4 -> Strong, 5 -> Very strong
    let s = 0;
    if (count >= 5) s = 5; else s = count; // keep 0..5 in 's'
    setScore(s);
  }, [password]);

  const handleCreate = () => {
    // TODO: integrate with backend or auth provider
    console.log('Creating account', { username, password });
    router.push('/main-app' as any);
  };

  const isRtlLang = React.useMemo(() => {
    const rtl = new Set(['ar', 'fa', 'he', 'ur']);
    let code: string | undefined;
    try { if (typeof localStorage !== 'undefined') code = localStorage.getItem('preferredLanguage') || undefined; } catch (e) {}
    try { if (!code && typeof document !== 'undefined' && document.documentElement?.lang) code = document.documentElement.lang; } catch (e) {}
    try {
      if (!code) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nav = (typeof navigator !== 'undefined' ? (navigator as any).language || (navigator as any).userLanguage : undefined) as string | undefined;
        if (nav) code = nav;
      }
    } catch (e) {}
    if (!code) return false;
    return rtl.has(code.split('-')[0]);
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <Stack.Screen options={SCREEN_OPTIONS[colorScheme ?? 'light'] as any} />
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center items-center p-6">
            <View className="w-full max-w-md">
              <View className={`${isRtlLang ? 'items-end' : 'items-center'} mb-8`}>
                <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-4">
                  <Icon as={GlobeIcon} size={32} className="text-primary-foreground" />
                </View>
                <Text variant="h2" className={`${isRtlLang ? 'text-right' : 'text-center'} mb-2`}>Finish creating your account</Text>
                <Text variant="muted" className={`${isRtlLang ? 'text-right' : 'text-center'}`}>Pick a username and a secure password</Text>
              </View>

              <Card className="mb-4">
                <CardContent className="gap-4">
                  <Text variant="default" className="text-muted-foreground">Username</Text>
                  {usernameLoading ? (
                    <TextInput value={username} onChangeText={setUsername} placeholder={undefined} className="text-foreground border-input rounded-md border px-3 py-2" autoCapitalize="none" />
                  ) : (
                    <TextInput value={username} onChangeText={setUsername} placeholder={usernameTranslated ?? 'Choose a username'} className="text-foreground border-input rounded-md border px-3 py-2" autoCapitalize="none" />
                  )}

                  <Text variant="default" className="text-muted-foreground">Password</Text>
                  {passwordLoading ? (
                    <TextInput value={password} onChangeText={setPassword} placeholder={undefined} secureTextEntry className="text-foreground border-input rounded-md border px-3 py-2" />
                  ) : (
                    <TextInput value={password} onChangeText={setPassword} placeholder={passwordTranslated ?? 'Create a strong password'} secureTextEntry className="text-foreground border-input rounded-md border px-3 py-2" />
                  )}

                  {/* Strength indicator and checklist */}
                  <View className="mt-2">
                    <Text variant="default" className="text-muted-foreground">Strength: {strengthLabel(score)}</Text>
                    <View className="h-3 mt-2 w-full bg-border rounded-md overflow-hidden">
                      <View
                        style={{ width: `${(satisfied / 5) * 100}%` }}
                        className={
                          `h-3 ` +
                          (score >= 5 ? 'bg-emerald-500' : score === 4 ? 'bg-lime-500' : score === 3 ? 'bg-yellow-400' : 'bg-red-500')
                        }
                      />
                    </View>

                    <View className="mt-3 space-y-1">
                      <Text variant="small" className={checksState.length8 ? 'text-emerald-700' : 'text-muted-foreground'}>• At least 8 characters</Text>
                      <Text variant="small" className={checksState.lower ? 'text-emerald-700' : 'text-muted-foreground'}>• Lowercase letters</Text>
                      <Text variant="small" className={checksState.upper ? 'text-emerald-700' : 'text-muted-foreground'}>• Uppercase letters</Text>
                      <Text variant="small" className={checksState.digit ? 'text-emerald-700' : 'text-muted-foreground'}>• Numbers</Text>
                      <Text variant="small" className={checksState.symbol ? 'text-emerald-700' : 'text-muted-foreground'}>• Symbols (e.g. !@#$%)</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>

              <View className="mt-4">
                <Button className="w-full" onPress={handleCreate} disabled={!username || score < 4}>
                  <Text className="font-medium">Create account</Text>
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

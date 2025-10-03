import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Pressable, TextInput, Animated } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlobeIcon } from 'lucide-react-native';
import languagesData from '@/data/languages.json';
import type { Option } from '@/components/ui/select';
import { useRouter } from 'expo-router';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface CreateAccountProps {
  onLanguageSelected?: (language: Language) => void;
  onNext?: () => void; // Called once the final account creation step completes
}

const SAMPLE_ITEMS = [
  { id: 'item1', title: 'Neighborhood Watch', description: 'Local safety and events' },
  { id: 'item2', title: 'Transportation', description: 'Public transit updates' },
  { id: 'item3', title: 'Education', description: 'School board and policies' },
];

export function CreateAccount({ onLanguageSelected, onNext }: CreateAccountProps) {
  const router = useRouter();

  // Global language state
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);

  // Topic selection state
  const [selectedTopics, setSelectedTopics] = useState<Record<string, boolean>>({});

  // Final account fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [score, setScore] = useState(0);
  const [satisfied, setSatisfied] = useState(0);
  const [checksState, setChecksState] = useState({
    length8: false,
    lower: false,
    upper: false,
    digit: false,
    symbol: false,
  });

  // Step state: 0 = language, 1 = topics, 2 = final
  const [step, setStep] = useState(0);

  // Animated opacity used to fade between steps
  const opacity = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setLanguages(languagesData);
    const defaultLanguage = languagesData.find(lang => lang.code === 'en');
    if (defaultLanguage) {
      setSelectedLanguage(defaultLanguage);
      onLanguageSelected?.(defaultLanguage);
    }
  }, [onLanguageSelected]);

  // Password strength logic (copied/adapted from final.tsx)
  useEffect(() => {
    const pw = password || '';
    const checks = {
      length8: pw.length >= 8,
      lower: /[a-z]/.test(pw),
      upper: /[A-Z]/.test(pw),
      digit: /\d/.test(pw),
      symbol: /[^A-Za-z0-9]/.test(pw),
    };

    const blacklist = ['password','123456','123456789','qwerty','abc123','letmein','admin','welcome','iloveyou'];
    const lower = pw.toLowerCase();
    const isCommon = pw.length > 0 && blacklist.includes(lower);

    let count = 0;
    for (const k of Object.keys(checks)) {
      if ((checks as any)[k]) count++;
    }

    if (isCommon) {
      count = 0;
      setChecksState({ length8: false, lower: false, upper: false, digit: false, symbol: false });
    } else {
      setChecksState(checks);
    }

    setSatisfied(count);
    let s = 0;
    if (count >= 5) s = 5; else s = count;
    setScore(s);
  }, [password]);

  const selectedOption: Option | undefined = selectedLanguage
    ? { value: selectedLanguage.code, label: `${selectedLanguage.name} (${selectedLanguage.nativeName})` }
    : undefined;

  const handleLanguageChange = (option: Option) => {
    if (option) {
      const language = languages.find(lang => lang.code === option.value);
      if (language) {
        setSelectedLanguage(language);
        onLanguageSelected?.(language);
      }
    }
  };

  const toggleTopic = (id: string) => {
    setSelectedTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const fadeToStep = (next: number) => {
    // If moving into the final (password) step, clear sensitive fields on move-in for safety
    if (next === 2) {
      clearSensitiveFields();
    }

    Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
      setStep(next);
      // start from 0 then fade in
      opacity.setValue(0);
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  // Clear only sensitive fields (username/password/checks) when entering the final step
  const clearSensitiveFields = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setScore(0);
    setSatisfied(0);
    setChecksState({ length8: false, lower: false, upper: false, digit: false, symbol: false });
  };

  const handleNextFromLanguage = () => {
    if (selectedLanguage) fadeToStep(1);
  };

  const handleNextFromTopics = () => {
    // you can allow empty selection if desired; here we allow continue
    fadeToStep(2);
  };

  const handleCreate = () => {
    // Package data into a JSON object and log it for debugging
    const payload = {
      language: selectedLanguage,
      topics: Object.keys(selectedTopics).filter((id) => !!selectedTopics[id]),
      username,
      password,
    };

    console.log('Create account payload:', payload);

    // Continue with navigation
    if (onNext) {
      onNext();
    } else {
      router.push('/main-app' as any);
    }
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

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center p-6">
          <View className="w-full max-w-md">
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-4">
                <Icon as={GlobeIcon} size={32} className="text-primary-foreground" />
              </View>
              <Text variant="h2" className="text-center mb-2">Welcome to Civic Lens</Text>
              <Text variant="muted" className="text-center">
                {step === 0 ? "Let's start by selecting your preferred language" : step === 1 ? "Choose topics you're interested in" : 'Pick a username and a secure password'}
              </Text>
            </View>

            <Animated.View style={{ opacity }}>
              {step === 0 && (
                <View>
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="text-lg">Global Language</CardTitle>
                    </CardHeader>
                    <CardContent className="gap-4">
                      <Text variant="small" className="text-muted-foreground">
                        Choose your preferred language for the app interface
                      </Text>
                      <Select value={selectedOption} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a language" className="text-left" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language.code} value={language.code} label={`${language.name} (${language.nativeName})`}>
                              <View className="flex-1">
                                <Text className="font-medium">{language.name}</Text>
                                <Text variant="small" className="text-muted-foreground">{language.nativeName}</Text>
                              </View>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>

                  <Button className="w-full" onPress={handleNextFromLanguage} disabled={!selectedLanguage}>
                    <Text className="font-medium">Continue</Text>
                  </Button>
                </View>
              )}

              {step === 1 && (
                <View>
                  <Card className="mb-6">
                    <CardContent>
                      <View className="flex-row flex-wrap gap-3 justify-center items-center">
                        {SAMPLE_ITEMS.map(item => {
                          const isSelected = !!selectedTopics[item.id];
                          return (
                            <Pressable
                              key={item.id}
                              onPress={() => toggleTopic(item.id)}
                              className={`px-4 py-2 rounded-full border items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'bg-card border-border'}`}
                            >
                              <Text className={`${isSelected ? 'text-primary-foreground' : ''}`}>{item.title}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </CardContent>
                  </Card>

                  <View className="flex-row gap-3">
                    <Button className="flex-1" variant="secondary" onPress={() => fadeToStep(0)}>
                      <Text>Back</Text>
                    </Button>
                    <Button className="flex-1" onPress={handleNextFromTopics}>
                      <Text className="font-medium">Continue</Text>
                    </Button>
                  </View>
                </View>
              )}

              {step === 2 && (
                <View>
                  <Card className="mb-4">
                    <CardContent className="gap-4">
                      <Text variant="default" className="text-muted-foreground">Username</Text>
                      <TextInput
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Choose a username"
                        className="text-foreground border-input rounded-md border px-3 py-2"
                        autoCapitalize="none"
                      />

                      <Text variant="default" className="text-muted-foreground">Password</Text>
                      <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Create a strong password"
                        secureTextEntry
                        className="text-foreground border-input rounded-md border px-3 py-2"
                      />

                      <Text variant="default" className="text-muted-foreground">Confirm password</Text>
                      <TextInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Re-enter your password"
                        secureTextEntry
                        className="text-foreground border-input rounded-md border px-3 py-2"
                      />

                      {confirmPassword.length > 0 && confirmPassword !== password && (
                        <Text variant="small" className="text-rose-600 mt-2">Passwords do not match</Text>
                      )}

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

                  <View className="flex-row gap-3">
                    <Button className="flex-1" variant="secondary" onPress={() => fadeToStep(1)}>
                      <Text>Back</Text>
                    </Button>
                    <Button className="flex-1" onPress={handleCreate} disabled={!username || score < 4 || password !== confirmPassword}>
                      <Text className="font-medium">Create account</Text>
                    </Button>
                  </View>
                </View>
              )}
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default CreateAccount;
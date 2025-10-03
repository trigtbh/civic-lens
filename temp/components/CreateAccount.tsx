import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlobeIcon, ChevronRightIcon } from 'lucide-react-native';
import languagesData from '@/data/languages.json';
import type { Option } from '@/components/ui/select';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface CreateAccountProps {
  onLanguageSelected?: (language: Language) => void;
  onNext?: () => void;
}

export function CreateAccount({ onLanguageSelected, onNext }: CreateAccountProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    // Load languages from JSON file
    setLanguages(languagesData);
    // Set default language to English
    const defaultLanguage = languagesData.find(lang => lang.code === 'en');
    if (defaultLanguage) {
      setSelectedLanguage(defaultLanguage);
      onLanguageSelected?.(defaultLanguage);
    }
  }, [onLanguageSelected]);

  const handleLanguageChange = (option: Option) => {
    if (option) {
      const language = languages.find(lang => lang.code === option.value);
      if (language) {
        setSelectedLanguage(language);
        onLanguageSelected?.(language);
      }
    }
  };

  const handleNext = () => {
    if (selectedLanguage) {
      onNext?.();
    }
  };

  const selectedOption: Option | undefined = selectedLanguage 
    ? { 
        value: selectedLanguage.code, 
        label: `${selectedLanguage.name} (${selectedLanguage.nativeName})` 
      }
    : undefined;

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center p-6">
          <View className="w-full max-w-md">
            {/* Header */}
            <View className="items-center mb-8">
              <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-4">
                <Icon as={GlobeIcon} size={32} className="text-primary-foreground" />
              </View>
              <Text variant="h2" className="text-center mb-2">
                Welcome to Civic Lens
              </Text>
              <Text variant="muted" className="text-center">
                Let's start by selecting your preferred language
              </Text>
            </View>

            {/* Language Selection Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Global Language</CardTitle>
              </CardHeader>
              <CardContent className="gap-4">
                <Text variant="small" className="text-muted-foreground">
                  Choose your preferred language for the app interface
                </Text>
                
                <Select
                  value={selectedOption}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue 
                      placeholder="Select a language" 
                      className="text-left"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem 
                        key={language.code} 
                        value={language.code}
                        label={`${language.name} (${language.nativeName})`}
                      >
                        <View className="flex-1">
                          <Text className="font-medium">{language.name}</Text>
                          <Text variant="small" className="text-muted-foreground">
                            {language.nativeName}
                          </Text>
                        </View>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedLanguage && (
                  <View className="flex-row items-center gap-2 p-3 bg-muted rounded-md">
                    <Icon as={GlobeIcon} size={16} className="text-muted-foreground" />
                    <Text variant="small" className="flex-1">
                      Selected: {selectedLanguage.nativeName} ({selectedLanguage.name})
                    </Text>
                  </View>
                )}
              </CardContent>
            </Card>

            {/* Continue Button */}
            <Button 
              className="w-full" 
              onPress={handleNext}
              disabled={!selectedLanguage}
            >
              <Text className="font-medium">Continue</Text>
            </Button>

            {/* Footer */}
            <View className="mt-8 items-center">
              <Text variant="small" className="text-muted-foreground text-center">
                You can change your language preference later in settings
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default CreateAccount;
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isAvailable: boolean;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', isAvailable: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isAvailable: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isAvailable: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isAvailable: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', isAvailable: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', isAvailable: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', isAvailable: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', isAvailable: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', isAvailable: false },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', isAvailable: false },
];

export default function LanguageScreen() {
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const success = useThemeColor({}, 'success');

  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleLanguageSelect = (languageCode: string) => {
    if (LANGUAGES.find(lang => lang.code === languageCode)?.isAvailable) {
      setSelectedLanguage(languageCode);
      // Here you would typically save the language preference and apply it
    }
  };

  const availableLanguages = LANGUAGES.filter(lang => lang.isAvailable);
  const comingSoonLanguages = LANGUAGES.filter(lang => !lang.isAvailable);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Language',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <SFSymbol name="chevron.left" color={text} size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Current Selection */}
        <Card style={styles.currentCard} variant="elevated">
          <View style={styles.currentHeader}>
            <SFSymbol name="globe" color={primary} size={24} />
            <View style={styles.currentInfo}>
              <ThemedText type="semiBold" style={styles.currentTitle}>
                Current Language
              </ThemedText>
              <ThemedText style={[styles.currentLanguage, { color: primary }]}>
                {LANGUAGES.find(lang => lang.code === selectedLanguage)?.name}
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Available Languages */}
        <Card style={styles.languagesCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Available Languages
          </ThemedText>
          
          <View style={styles.languagesList}>
            {availableLanguages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  selectedLanguage === language.code && styles.selectedLanguageItem,
                ]}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <View style={styles.languageInfo}>
                  <ThemedText style={styles.languageFlag}>
                    {language.flag}
                  </ThemedText>
                  <View style={styles.languageText}>
                    <ThemedText type="semiBold" style={styles.languageName}>
                      {language.name}
                    </ThemedText>
                    <ThemedText style={[styles.languageNative, { color: muted }]}>
                      {language.nativeName}
                    </ThemedText>
                  </View>
                </View>
                
                {selectedLanguage === language.code && (
                  <SFSymbol name="checkmark.circle.fill" color={success} size={24} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Coming Soon */}
        <Card style={styles.comingSoonCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Coming Soon
          </ThemedText>
          <ThemedText style={[styles.comingSoonDescription, { color: muted }]}>
            These languages are currently being translated and will be available in future updates.
          </ThemedText>
          
          <View style={styles.languagesList}>
            {comingSoonLanguages.map((language) => (
              <View
                key={language.code}
                style={[styles.languageItem, styles.disabledLanguageItem]}
              >
                <View style={styles.languageInfo}>
                  <ThemedText style={[styles.languageFlag, styles.disabledFlag]}>
                    {language.flag}
                  </ThemedText>
                  <View style={styles.languageText}>
                    <ThemedText style={[styles.languageName, { color: muted }]}>
                      {language.name}
                    </ThemedText>
                    <ThemedText style={[styles.languageNative, { color: muted }]}>
                      {language.nativeName}
                    </ThemedText>
                  </View>
                </View>
                
                <View style={styles.comingSoonBadge}>
                  <ThemedText style={styles.comingSoonText}>
                    Soon
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Help Section */}
        <Card style={styles.helpCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Help Us Translate
          </ThemedText>
          <ThemedText style={[styles.helpDescription, { color: muted }]}>
            Want to help translate Roll20 Reforged into your language? We'd love your help!
          </ThemedText>
          
          <TouchableOpacity style={styles.helpButton}>
            <SFSymbol name="heart" color={primary} size={20} />
            <ThemedText style={[styles.helpButtonText, { color: primary }]}>
              Become a Translator
            </ThemedText>
            <SFSymbol name="arrow.up.right" color={primary} size={16} />
          </TouchableOpacity>
        </Card>

        {/* Language Settings */}
        <Card style={styles.settingsCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Language Settings
          </ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <ThemedText type="semiBold" style={styles.settingTitle}>
                Auto-detect Language
              </ThemedText>
              <ThemedText style={[styles.settingDescription, { color: muted }]}>
                Automatically detect language from your device settings
              </ThemedText>
            </View>
            <SFSymbol name="chevron.right" color={muted} size={16} />
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <ThemedText type="semiBold" style={styles.settingTitle}>
                Regional Format
              </ThemedText>
              <ThemedText style={[styles.settingDescription, { color: muted }]}>
                Date, time, and number formatting
              </ThemedText>
            </View>
            <SFSymbol name="chevron.right" color={muted} size={16} />
          </View>
        </Card>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  currentCard: {
    margin: 20,
    padding: 20,
  },
  currentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  currentInfo: {
    flex: 1,
  },
  currentTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  currentLanguage: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  languagesCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  comingSoonCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  helpCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  settingsCard: {
    marginHorizontal: 20,
    marginBottom: 100,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  comingSoonDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  helpDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  languagesList: {
    gap: 4,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectedLanguageItem: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  disabledLanguageItem: {
    opacity: 0.6,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  disabledFlag: {
    opacity: 0.5,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 14,
  },
  comingSoonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#7C3AED',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  helpButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginLeft: 0,
  },
});
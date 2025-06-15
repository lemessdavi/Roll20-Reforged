import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Alert, TextInput } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

interface CampaignForm {
  name: string;
  description: string;
  gameSystem: string;
  maxPlayers: number;
  isPrivate: boolean;
  tags: string[];
}

const GAME_SYSTEMS = [
  'D&D 5e',
  'Pathfinder 2e',
  'Call of Cthulhu',
  'Vampire: The Masquerade',
  'Cyberpunk Red',
  'Shadowrun',
  'World of Darkness',
  'GURPS',
  'Savage Worlds',
  'Custom System',
];

const POPULAR_TAGS = [
  'Beginner Friendly',
  'Roleplay Heavy',
  'Combat Heavy',
  'Mystery',
  'Horror',
  'Political Intrigue',
  'Exploration',
  'Dungeon Crawl',
  'Sandbox',
  'Linear Story',
];

export default function CreateCampaignScreen() {
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const surface = useThemeColor({}, 'surface');
  const success = useThemeColor({}, 'success');

  const [form, setForm] = useState<CampaignForm>({
    name: '',
    description: '',
    gameSystem: '',
    maxPlayers: 6,
    isPrivate: false,
    tags: [],
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { title: 'Basic Info', icon: 'info.circle' },
    { title: 'Game System', icon: 'gamecontroller' },
    { title: 'Settings', icon: 'gear' },
    { title: 'Tags', icon: 'tag' },
  ];

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Campaign Created!',
        `${form.name} has been created successfully.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create campaign. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return form.name.trim().length > 0 && form.description.trim().length > 0;
      case 1:
        return form.gameSystem.length > 0;
      case 2:
        return form.maxPlayers > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Input
              label="Campaign Name"
              value={form.name}
              onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
              placeholder="Enter campaign name"
            />
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Description</ThemedText>
              <TextInput
                style={[styles.textArea, { color: text, borderColor: muted }]}
                value={form.description}
                onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
                placeholder="Describe your campaign..."
                placeholderTextColor={muted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <ThemedText type="semiBold" style={styles.selectionLabel}>
              Choose Game System
            </ThemedText>
            <View style={styles.selectionGrid}>
              {GAME_SYSTEMS.map((system) => (
                <TouchableOpacity
                  key={system}
                  style={[
                    styles.selectionItem,
                    { backgroundColor: surface },
                    form.gameSystem === system && { backgroundColor: primary },
                  ]}
                  onPress={() => setForm(prev => ({ ...prev, gameSystem: system }))}
                >
                  <ThemedText
                    style={[
                      styles.selectionText,
                      form.gameSystem === system && { color: '#FFFFFF' },
                    ]}
                  >
                    {system}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <ThemedText type="semiBold" style={styles.settingTitle}>
                  Maximum Players
                </ThemedText>
                <ThemedText style={[styles.settingDescription, { color: muted }]}>
                  How many players can join this campaign?
                </ThemedText>
              </View>
              <View style={styles.playerCountControl}>
                <TouchableOpacity
                  style={[styles.countButton, { backgroundColor: surface }]}
                  onPress={() => setForm(prev => ({ ...prev, maxPlayers: Math.max(1, prev.maxPlayers - 1) }))}
                >
                  <SFSymbol name="minus" color={text} size={16} />
                </TouchableOpacity>
                <ThemedText type="semiBold" style={styles.countValue}>
                  {form.maxPlayers}
                </ThemedText>
                <TouchableOpacity
                  style={[styles.countButton, { backgroundColor: surface }]}
                  onPress={() => setForm(prev => ({ ...prev, maxPlayers: Math.min(20, prev.maxPlayers + 1) }))}
                >
                  <SFSymbol name="plus" color={text} size={16} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setForm(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
            >
              <View style={styles.settingInfo}>
                <ThemedText type="semiBold" style={styles.settingTitle}>
                  Private Campaign
                </ThemedText>
                <ThemedText style={[styles.settingDescription, { color: muted }]}>
                  Only invited players can join
                </ThemedText>
              </View>
              <View
                style={[
                  styles.toggle,
                  { backgroundColor: form.isPrivate ? primary : surface },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    {
                      backgroundColor: '#FFFFFF',
                      transform: [{ translateX: form.isPrivate ? 20 : 2 }],
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <ThemedText type="semiBold" style={styles.selectionLabel}>
              Campaign Tags (Optional)
            </ThemedText>
            <ThemedText style={[styles.tagDescription, { color: muted }]}>
              Help players find your campaign by adding relevant tags
            </ThemedText>
            <View style={styles.tagsGrid}>
              {POPULAR_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagItem,
                    { backgroundColor: surface },
                    form.tags.includes(tag) && { backgroundColor: primary },
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <ThemedText
                    style={[
                      styles.tagText,
                      form.tags.includes(tag) && { color: '#FFFFFF' },
                    ]}
                  >
                    {tag}
                  </ThemedText>
                  {form.tags.includes(tag) && (
                    <SFSymbol name="checkmark" color="#FFFFFF" size={14} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Create Campaign',
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack}>
              <SFSymbol name="chevron.left" color={text} size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.progressStep}>
              <View
                style={[
                  styles.progressCircle,
                  {
                    backgroundColor: index <= currentStep ? primary : surface,
                    borderColor: index <= currentStep ? primary : muted,
                  },
                ]}
              >
                <SFSymbol
                  name={step.icon as any}
                  color={index <= currentStep ? '#FFFFFF' : muted}
                  size={16}
                />
              </View>
              <ThemedText
                style={[
                  styles.progressLabel,
                  { color: index <= currentStep ? primary : muted },
                ]}
              >
                {step.title}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Step Content */}
        <Card style={styles.contentCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.stepTitle}>
            {steps[currentStep].title}
          </ThemedText>
          {renderStepContent()}
        </Card>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <Button
            title={currentStep === 0 ? 'Cancel' : 'Back'}
            onPress={handleBack}
            variant="outline"
            style={styles.backButton}
          />
          <Button
            title={currentStep === steps.length - 1 ? 'Create Campaign' : 'Next'}
            onPress={handleNext}
            disabled={!isStepValid()}
            loading={isLoading}
            style={styles.nextButton}
          />
        </View>
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  contentCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
  },
  stepTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  stepContent: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 100,
  },
  selectionLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
  selectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  playerCountControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countValue: {
    fontSize: 18,
    minWidth: 32,
    textAlign: 'center',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'relative',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
  },
  tagDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
});
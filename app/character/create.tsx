import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

interface CharacterForm {
  name: string;
  race: string;
  class: string;
  background: string;
  alignment: string;
  level: number;
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
}

const RACES = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling'];
const CLASSES = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];
const BACKGROUNDS = ['Acolyte', 'Criminal', 'Folk Hero', 'Noble', 'Sage', 'Soldier', 'Charlatan', 'Entertainer', 'Guild Artisan', 'Hermit', 'Outlander', 'Sailor'];
const ALIGNMENTS = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];

export default function CreateCharacterScreen() {
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const surface = useThemeColor({}, 'surface');

  const [form, setForm] = useState<CharacterForm>({
    name: '',
    race: '',
    class: '',
    background: '',
    alignment: '',
    level: 1,
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { title: 'Basic Info', icon: 'person' },
    { title: 'Race & Class', icon: 'star' },
    { title: 'Background', icon: 'book' },
    { title: 'Abilities', icon: 'bolt' },
  ];

  const rollAbilityScores = () => {
    const rollStat = () => {
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
      rolls.sort((a, b) => b - a);
      return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
    };

    setForm(prev => ({
      ...prev,
      abilities: {
        strength: rollStat(),
        dexterity: rollStat(),
        constitution: rollStat(),
        intelligence: rollStat(),
        wisdom: rollStat(),
        charisma: rollStat(),
      },
    }));
  };

  const updateAbility = (ability: keyof CharacterForm['abilities'], value: number) => {
    setForm(prev => ({
      ...prev,
      abilities: {
        ...prev.abilities,
        [ability]: Math.max(3, Math.min(18, value)),
      },
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
        'Character Created!',
        `${form.name} has been created successfully.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create character. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return form.name.trim().length > 0;
      case 1:
        return form.race && form.class;
      case 2:
        return form.background && form.alignment;
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
              label="Character Name"
              value={form.name}
              onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
              placeholder="Enter character name"
            />
            <Input
              label="Level"
              value={form.level.toString()}
              onChangeText={(text) => setForm(prev => ({ ...prev, level: parseInt(text) || 1 }))}
              keyboardType="numeric"
              placeholder="1"
            />
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.selectionGroup}>
              <ThemedText type="semiBold" style={styles.selectionLabel}>Race</ThemedText>
              <View style={styles.selectionGrid}>
                {RACES.map((race) => (
                  <TouchableOpacity
                    key={race}
                    style={[
                      styles.selectionItem,
                      { backgroundColor: surface },
                      form.race === race && { backgroundColor: primary },
                    ]}
                    onPress={() => setForm(prev => ({ ...prev, race }))}
                  >
                    <ThemedText
                      style={[
                        styles.selectionText,
                        form.race === race && { color: '#FFFFFF' },
                      ]}
                    >
                      {race}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.selectionGroup}>
              <ThemedText type="semiBold" style={styles.selectionLabel}>Class</ThemedText>
              <View style={styles.selectionGrid}>
                {CLASSES.map((characterClass) => (
                  <TouchableOpacity
                    key={characterClass}
                    style={[
                      styles.selectionItem,
                      { backgroundColor: surface },
                      form.class === characterClass && { backgroundColor: primary },
                    ]}
                    onPress={() => setForm(prev => ({ ...prev, class: characterClass }))}
                  >
                    <ThemedText
                      style={[
                        styles.selectionText,
                        form.class === characterClass && { color: '#FFFFFF' },
                      ]}
                    >
                      {characterClass}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.selectionGroup}>
              <ThemedText type="semiBold" style={styles.selectionLabel}>Background</ThemedText>
              <View style={styles.selectionGrid}>
                {BACKGROUNDS.map((background) => (
                  <TouchableOpacity
                    key={background}
                    style={[
                      styles.selectionItem,
                      { backgroundColor: surface },
                      form.background === background && { backgroundColor: primary },
                    ]}
                    onPress={() => setForm(prev => ({ ...prev, background }))}
                  >
                    <ThemedText
                      style={[
                        styles.selectionText,
                        form.background === background && { color: '#FFFFFF' },
                      ]}
                    >
                      {background}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.selectionGroup}>
              <ThemedText type="semiBold" style={styles.selectionLabel}>Alignment</ThemedText>
              <View style={styles.selectionGrid}>
                {ALIGNMENTS.map((alignment) => (
                  <TouchableOpacity
                    key={alignment}
                    style={[
                      styles.selectionItem,
                      { backgroundColor: surface },
                      form.alignment === alignment && { backgroundColor: primary },
                    ]}
                    onPress={() => setForm(prev => ({ ...prev, alignment }))}
                  >
                    <ThemedText
                      style={[
                        styles.selectionText,
                        form.alignment === alignment && { color: '#FFFFFF' },
                      ]}
                    >
                      {alignment}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.abilitiesHeader}>
              <ThemedText type="semiBold" style={styles.selectionLabel}>Ability Scores</ThemedText>
              <Button
                title="Roll 4d6"
                onPress={rollAbilityScores}
                variant="outline"
                size="small"
              />
            </View>
            
            <View style={styles.abilitiesGrid}>
              {Object.entries(form.abilities).map(([ability, score]) => (
                <View key={ability} style={styles.abilityControl}>
                  <ThemedText style={styles.abilityLabel}>
                    {ability.charAt(0).toUpperCase() + ability.slice(1)}
                  </ThemedText>
                  <View style={styles.abilityInputContainer}>
                    <TouchableOpacity
                      style={[styles.abilityButton, { backgroundColor: surface }]}
                      onPress={() => updateAbility(ability as keyof CharacterForm['abilities'], score - 1)}
                    >
                      <SFSymbol name="minus" color={text} size={16} />
                    </TouchableOpacity>
                    <ThemedText type="semiBold" style={styles.abilityValue}>
                      {score}
                    </ThemedText>
                    <TouchableOpacity
                      style={[styles.abilityButton, { backgroundColor: surface }]}
                      onPress={() => updateAbility(ability as keyof CharacterForm['abilities'], score + 1)}
                    >
                      <SFSymbol name="plus" color={text} size={16} />
                    </TouchableOpacity>
                  </View>
                  <ThemedText style={[styles.abilityModifier, { color: primary }]}>
                    {Math.floor((score - 10) / 2) >= 0 ? '+' : ''}{Math.floor((score - 10) / 2)}
                  </ThemedText>
                </View>
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
          title: 'Create Character',
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
            title={currentStep === steps.length - 1 ? 'Create Character' : 'Next'}
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
  selectionGroup: {
    marginBottom: 24,
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
  abilitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  abilitiesGrid: {
    gap: 16,
  },
  abilityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  abilityLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  abilityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  abilityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  abilityValue: {
    fontSize: 18,
    minWidth: 32,
    textAlign: 'center',
  },
  abilityModifier: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    minWidth: 32,
    textAlign: 'center',
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
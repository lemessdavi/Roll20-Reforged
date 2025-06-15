import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

interface Character {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  hitPoints: { current: number; maximum: number };
  armorClass: number;
  campaign?: string;
  avatar: string;
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills: string[];
  equipment: string[];
  spells: string[];
  background: string;
  alignment: string;
  isActive: boolean;
}

// Mock character data - in a real app, this would come from your data store
const mockCharacter: Character = {
  id: '1',
  name: 'Aria Moonwhisper',
  class: 'Ranger',
  race: 'Elf',
  level: 8,
  hitPoints: { current: 64, maximum: 72 },
  armorClass: 16,
  campaign: 'Lost Mines of Phandelver',
  avatar: 'https://i.pinimg.com/564x/90/f7/e5/90f7e50eedb28b5f31bd13d110d9050b.jpg',
  abilities: {
    strength: 14,
    dexterity: 18,
    constitution: 16,
    intelligence: 12,
    wisdom: 16,
    charisma: 10,
  },
  skills: ['Survival', 'Animal Handling', 'Perception', 'Stealth'],
  equipment: ['Longbow', 'Studded Leather Armor', 'Shortsword', 'Explorer\'s Pack'],
  spells: ['Hunter\'s Mark', 'Cure Wounds', 'Pass Without Trace'],
  background: 'Outlander',
  alignment: 'Chaotic Good',
  isActive: true,
};

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');
  const danger = useThemeColor({}, 'danger');

  const [character] = useState<Character>(mockCharacter);

  const getAbilityModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  const formatModifier = (modifier: number) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const getHealthColor = (current: number, maximum: number) => {
    const percentage = (current / maximum) * 100;
    if (percentage > 75) return success;
    if (percentage > 25) return warning;
    return danger;
  };

  const handleEdit = () => {
    router.push(`/character/edit/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Character',
      'Are you sure you want to delete this character? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            // Handle deletion logic here
            router.back();
          }
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: character.name,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <SFSymbol name="chevron.left" color={text} size={24} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleEdit}>
              <SFSymbol name="pencil" color={primary} size={20} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Character Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: character.avatar }} style={styles.avatar} />
            {character.isActive && (
              <View style={[styles.activeBadge, { backgroundColor: success }]} />
            )}
          </View>
          
          <View style={styles.headerInfo}>
            <ThemedText type="title" style={styles.characterName}>
              {character.name}
            </ThemedText>
            <ThemedText style={[styles.characterClass, { color: muted }]}>
              Level {character.level} {character.race} {character.class}
            </ThemedText>
            <ThemedText style={[styles.characterBackground, { color: muted }]}>
              {character.background} • {character.alignment}
            </ThemedText>
            {character.campaign && (
              <View style={styles.campaignBadge}>
                <SFSymbol name="map" color={primary} size={14} />
                <ThemedText style={[styles.campaignText, { color: primary }]}>
                  {character.campaign}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Core Stats */}
        <Card style={styles.statsCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>Core Stats</ThemedText>
          <View style={styles.coreStats}>
            <View style={styles.statItem}>
              <SFSymbol 
                name="heart.fill" 
                color={getHealthColor(character.hitPoints.current, character.hitPoints.maximum)} 
                size={20} 
              />
              <ThemedText style={styles.statLabel}>Hit Points</ThemedText>
              <ThemedText type="semiBold" style={styles.statValue}>
                {character.hitPoints.current}/{character.hitPoints.maximum}
              </ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <SFSymbol name="shield.fill" color={primary} size={20} />
              <ThemedText style={styles.statLabel}>Armor Class</ThemedText>
              <ThemedText type="semiBold" style={styles.statValue}>
                {character.armorClass}
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Ability Scores */}
        <Card style={styles.abilitiesCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>Ability Scores</ThemedText>
          <View style={styles.abilitiesGrid}>
            {Object.entries(character.abilities).map(([ability, score]) => (
              <View key={ability} style={styles.abilityItem}>
                <ThemedText style={[styles.abilityLabel, { color: muted }]}>
                  {ability.slice(0, 3).toUpperCase()}
                </ThemedText>
                <ThemedText type="semiBold" style={styles.abilityScore}>
                  {score}
                </ThemedText>
                <ThemedText style={[styles.abilityModifier, { color: primary }]}>
                  {formatModifier(getAbilityModifier(score))}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>

        {/* Skills */}
        <Card style={styles.skillsCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>Skills</ThemedText>
          <View style={styles.skillsList}>
            {character.skills.map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <SFSymbol name="checkmark.circle.fill" color={success} size={16} />
                <ThemedText style={styles.skillText}>{skill}</ThemedText>
              </View>
            ))}
          </View>
        </Card>

        {/* Equipment */}
        <Card style={styles.equipmentCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>Equipment</ThemedText>
          <View style={styles.equipmentList}>
            {character.equipment.map((item, index) => (
              <View key={index} style={styles.equipmentItem}>
                <SFSymbol name="bag" color={muted} size={16} />
                <ThemedText style={styles.equipmentText}>{item}</ThemedText>
              </View>
            ))}
          </View>
        </Card>

        {/* Spells */}
        {character.spells.length > 0 && (
          <Card style={styles.spellsCard} variant="elevated">
            <ThemedText type="subtitle" style={styles.sectionTitle}>Spells</ThemedText>
            <View style={styles.spellsList}>
              {character.spells.map((spell, index) => (
                <View key={index} style={styles.spellItem}>
                  <SFSymbol name="sparkles" color={primary} size={16} />
                  <ThemedText style={styles.spellText}>{spell}</ThemedText>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Edit Character"
            onPress={handleEdit}
            style={styles.editButton}
          />
          <Button
            title="Delete Character"
            onPress={handleDelete}
            variant="danger"
            style={styles.deleteButton}
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
  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  activeBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 24,
    marginBottom: 4,
  },
  characterClass: {
    fontSize: 16,
    marginBottom: 4,
  },
  characterBackground: {
    fontSize: 14,
    marginBottom: 8,
  },
  campaignBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  campaignText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  coreStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
  },
  abilitiesCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  abilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  abilityItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  abilityLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  abilityScore: {
    fontSize: 20,
  },
  abilityModifier: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  skillsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  skillsList: {
    gap: 12,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skillText: {
    fontSize: 16,
  },
  equipmentCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  equipmentList: {
    gap: 12,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  equipmentText: {
    fontSize: 16,
  },
  spellsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  spellsList: {
    gap: 12,
  },
  spellItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  spellText: {
    fontSize: 16,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },
  editButton: {
    marginBottom: 8,
  },
  deleteButton: {
    marginBottom: 8,
  },
});
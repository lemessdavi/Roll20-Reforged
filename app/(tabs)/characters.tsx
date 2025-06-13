import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Plus, Sword, Shield, Heart, Zap, User, Star, Crown } from 'lucide-react-native';

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
  isActive: boolean;
}

const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Aria Moonwhisper',
    class: 'Ranger',
    race: 'Elf',
    level: 8,
    hitPoints: { current: 64, maximum: 72 },
    armorClass: 16,
    campaign: 'Lost Mines of Phandelver',
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
    abilities: {
      strength: 14,
      dexterity: 18,
      constitution: 16,
      intelligence: 12,
      wisdom: 16,
      charisma: 10,
    },
    isActive: true,
  },
  {
    id: '2',
    name: 'Thorin Ironforge',
    class: 'Paladin',
    race: 'Dwarf',
    level: 6,
    hitPoints: { current: 58, maximum: 58 },
    armorClass: 18,
    campaign: 'Curse of Strahd',
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
    abilities: {
      strength: 16,
      dexterity: 10,
      constitution: 16,
      intelligence: 11,
      wisdom: 14,
      charisma: 16,
    },
    isActive: true,
  },
  {
    id: '3',
    name: 'Zara Nightblade',
    class: 'Rogue',
    race: 'Tiefling',
    level: 4,
    hitPoints: { current: 28, maximum: 32 },
    armorClass: 15,
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
    abilities: {
      strength: 10,
      dexterity: 18,
      constitution: 14,
      intelligence: 14,
      wisdom: 12,
      charisma: 16,
    },
    isActive: false,
  },
];

export default function CharactersScreen() {
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');
  const danger = useThemeColor({}, 'danger');

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'archived'>('all');

  const filteredCharacters = mockCharacters.filter(character => {
    if (selectedFilter === 'active') return character.isActive;
    if (selectedFilter === 'archived') return !character.isActive;
    return true;
  });

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

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="title" style={styles.title}>Characters</ThemedText>
            <ThemedText style={[styles.subtitle, { color: muted }]}>
              Your heroes and adventurers
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={[styles.createButton, { backgroundColor: primary }]}
            onPress={() => router.push('/character/create')}
          >
            <Plus color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${primary}20` }]}>
                <User color={primary} size={20} />
              </View>
              <View>
                <ThemedText type="semiBold" style={styles.statNumber}>
                  {mockCharacters.length}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: muted }]}>
                  Total Characters
                </ThemedText>
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${success}20` }]}>
                <Star color={success} size={20} />
              </View>
              <View>
                <ThemedText type="semiBold" style={styles.statNumber}>
                  {Math.round(mockCharacters.reduce((acc, c) => acc + c.level, 0) / mockCharacters.length)}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: muted }]}>
                  Avg Level
                </ThemedText>
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${warning}20` }]}>
                <Crown color={warning} size={20} />
              </View>
              <View>
                <ThemedText type="semiBold" style={styles.statNumber}>
                  {mockCharacters.filter(c => c.isActive).length}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: muted }]}>
                  Active
                </ThemedText>
              </View>
            </View>
          </Card>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {[
            { key: 'all', label: 'All Characters' },
            { key: 'active', label: 'Active' },
            { key: 'archived', label: 'Archived' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                selectedFilter === filter.key && { backgroundColor: primary },
              ]}
              onPress={() => setSelectedFilter(filter.key as any)}
            >
              <ThemedText
                style={[
                  styles.filterText,
                  { color: selectedFilter === filter.key ? '#FFFFFF' : muted },
                ]}
              >
                {filter.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Characters List */}
        <View style={styles.charactersContainer}>
          {filteredCharacters.map((character) => (
            <TouchableOpacity
              key={character.id}
              onPress={() => router.push(`/character/${character.id}`)}
            >
              <Card style={styles.characterCard} variant="elevated">
                <View style={styles.characterHeader}>
                  <View style={styles.avatarContainer}>
                    <Image source={{ uri: character.avatar }} style={styles.avatar} />
                    {character.isActive && (
                      <View style={[styles.activeBadge, { backgroundColor: success }]} />
                    )}
                  </View>
                  
                  <View style={styles.characterInfo}>
                    <View style={styles.nameRow}>
                      <ThemedText type="semiBold" style={styles.characterName}>
                        {character.name}
                      </ThemedText>
                      <View style={styles.levelBadge}>
                        <ThemedText style={[styles.levelText, { color: primary }]}>
                          Lv. {character.level}
                        </ThemedText>
                      </View>
                    </View>
                    
                    <ThemedText style={[styles.characterClass, { color: muted }]}>
                      {character.race} {character.class}
                    </ThemedText>
                    
                    {character.campaign && (
                      <ThemedText style={[styles.campaignText, { color: primary }]}>
                        {character.campaign}
                      </ThemedText>
                    )}
                  </View>
                </View>

                {/* Character Stats */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                      <Heart color={getHealthColor(character.hitPoints.current, character.hitPoints.maximum)} size={16} />
                    </View>
                    <View>
                      <ThemedText style={styles.statValue}>
                        {character.hitPoints.current}/{character.hitPoints.maximum}
                      </ThemedText>
                      <ThemedText style={[styles.statLabel, { color: muted }]}>HP</ThemedText>
                    </View>
                  </View>

                  <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                      <Shield color={primary} size={16} />
                    </View>
                    <View>
                      <ThemedText style={styles.statValue}>{character.armorClass}</ThemedText>
                      <ThemedText style={[styles.statLabel, { color: muted }]}>AC</ThemedText>
                    </View>
                  </View>

                  <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                      <Sword color={warning} size={16} />
                    </View>
                    <View>
                      <ThemedText style={styles.statValue}>
                        {formatModifier(getAbilityModifier(character.abilities.strength))}
                      </ThemedText>
                      <ThemedText style={[styles.statLabel, { color: muted }]}>STR</ThemedText>
                    </View>
                  </View>

                  <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                      <Zap color={success} size={16} />
                    </View>
                    <View>
                      <ThemedText style={styles.statValue}>
                        {formatModifier(getAbilityModifier(character.abilities.dexterity))}
                      </ThemedText>
                      <ThemedText style={[styles.statLabel, { color: muted }]}>DEX</ThemedText>
                    </View>
                  </View>
                </View>

                {/* Health Bar */}
                <View style={styles.healthBarContainer}>
                  <View style={styles.healthBarBackground}>
                    <View 
                      style={[
                        styles.healthBarFill, 
                        { 
                          width: `${(character.hitPoints.current / character.hitPoints.maximum) * 100}%`,
                          backgroundColor: getHealthColor(character.hitPoints.current, character.hitPoints.maximum)
                        }
                      ]} 
                    />
                  </View>
                  <ThemedText style={[styles.healthPercentage, { color: muted }]}>
                    {Math.round((character.hitPoints.current / character.hitPoints.maximum) * 100)}%
                  </ThemedText>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty State */}
        {filteredCharacters.length === 0 && (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: `${muted}20` }]}>
              <User color={muted} size={48} />
            </View>
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              No characters found
            </ThemedText>
            <ThemedText style={[styles.emptySubtitle, { color: muted }]}>
              Create your first character to start your adventure
            </ThemedText>
            <Button
              title="Create Character"
              onPress={() => router.push('/character/create')}
              style={styles.emptyButton}
            />
          </View>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  charactersContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  characterCard: {
    padding: 16,
  },
  characterHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  activeBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  characterInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  characterName: {
    fontSize: 18,
    flex: 1,
    marginRight: 12,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
  },
  levelText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  characterClass: {
    fontSize: 14,
    marginBottom: 4,
  },
  campaignText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  healthBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  healthBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  healthBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  healthPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    minWidth: 32,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyButton: {
    minWidth: 160,
  },
});
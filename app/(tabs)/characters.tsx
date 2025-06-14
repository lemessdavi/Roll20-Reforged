import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
    avatar: 'https://i.pinimg.com/564x/90/f7/e5/90f7e50eedb28b5f31bd13d110d9050b.jpg',
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
    avatar:
      'https://as1.ftcdn.net/jpg/05/65/73/90/1000_F_565739091_E9b0x6ayqgOMAg8PN49eN2GyzMer0Hou.jpg',
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
    avatar: 'https://media.craiyon.com/2025-04-03/8O6Alu2zQ-uOPQviMUIz-A.webp',
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

  const filteredCharacters = mockCharacters.filter((character) => {
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
            <ThemedText type="title" style={styles.title}>
              Characters
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: muted }]}>
              Your heroes and adventurers
            </ThemedText>
          </View>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: primary }]}
            onPress={() => router.push('/character/create')}
          >
            <SFSymbol name="plus" color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${primary}20` }]}>
                <SFSymbol name="person" color={primary} size={20} />
              </View>
              <View>
                <ThemedText type="semiBold" style={styles.statNumber}>
                  {mockCharacters.length}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={[styles.statLabel, { color: muted }]}>Total Characters</ThemedText>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${success}20` }]}>
                <SFSymbol name="star" color={success} size={20} />
              </View>
              <View>
                <ThemedText type="semiBold" style={styles.statNumber}>
                  {Math.round(
                    mockCharacters.reduce((acc, c) => acc + c.level, 0) / mockCharacters.length,
                  )}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={[styles.statLabel, { color: muted }]}>Avg Level</ThemedText>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${warning}20` }]}>
                <SFSymbol name="crown" color={warning} size={20} />
              </View>
              <View>
                <ThemedText type="semiBold" style={styles.statNumber}>
                  {mockCharacters.filter((c) => c.isActive).length}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={[styles.statLabel, { color: muted }]}>Active</ThemedText>
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

                    <View style={styles.classRow}>
                      <ThemedText style={[styles.classText, { color: muted }]}>
                        {character.race} {character.class}
                      </ThemedText>
                      {character.campaign && (
                        <ThemedText style={[styles.campaignText, { color: muted }]}>
                          • {character.campaign}
                        </ThemedText>
                      )}
                    </View>
                  </View>
                </View>

                <View style={styles.characterStats}>
                  <View style={styles.statRow}>
                    <View style={styles.statItem}>
                      <SFSymbol
                        name="heart.fill"
                        color={getHealthColor(
                          character.hitPoints.current,
                          character.hitPoints.maximum,
                        )}
                        size={16}
                      />
                      <ThemedText style={styles.statValue}>
                        {character.hitPoints.current}/{character.hitPoints.maximum}
                      </ThemedText>
                    </View>

                    <View style={styles.statItem}>
                      <SFSymbol name="shield.fill" color={primary} size={16} />
                      <ThemedText style={styles.statValue}>AC {character.armorClass}</ThemedText>
                    </View>
                  </View>

                  <View style={styles.abilitiesContainer}>
                    {Object.entries(character.abilities).map(([ability, score]) => (
                      <View key={ability} style={styles.abilityItem}>
                        <ThemedText style={[styles.abilityLabel, { color: muted }]}>
                          {ability.slice(0, 3).toUpperCase()}
                        </ThemedText>
                        <ThemedText style={styles.abilityScore}>{score}</ThemedText>
                        <ThemedText style={[styles.abilityModifier, { color: primary }]}>
                          {formatModifier(getAbilityModifier(score))}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty State */}
        {filteredCharacters.length === 0 && (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: `${muted}20` }]}>
              <SFSymbol name="person" color={muted} size={48} />
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
    padding: 12,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    marginTop: 6,
    fontSize: 11,
    lineHeight: 16,
    flexWrap: 'wrap',
    textAlign: 'center',
    textAlignVertical: 'center',
    maxWidth: 80,
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
  classRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  classText: {
    fontSize: 14,
    flex: 1,
  },
  campaignText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  characterStats: {
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 0,
    marginLeft: 16,
    marginRight: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  abilitiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: 16,
  },
  abilityItem: {
    flex: 1,
    minWidth: 0,
    maxWidth: '18%',
    alignItems: 'center',
    flexDirection: 'column',
  },
  abilityLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  abilityScore: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  abilityModifier: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
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

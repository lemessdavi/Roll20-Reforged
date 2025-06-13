import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Plus, Users, Calendar, Dice6, Map, Crown } from 'lucide-react-native';

interface Campaign {
  id: string;
  name: string;
  description: string;
  gameSystem: string;
  playerCount: number;
  maxPlayers: number;
  nextSession?: Date;
  dmName: string;
  image: string;
  isActive: boolean;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'The Lost Mines of Phandelver',
    description: 'A classic D&D adventure for new players. Explore goblin ambushes, mysterious ruins, and face the Black Spider.',
    gameSystem: 'D&D 5e',
    playerCount: 4,
    maxPlayers: 6,
    nextSession: new Date('2025-01-20T19:00:00'),
    dmName: 'Sarah Chen',
    image: 'https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=800',
    isActive: true,
  },
  {
    id: '2',
    name: 'Curse of Strahd',
    description: 'Gothic horror in the mist-shrouded realm of Barovia. Face vampires, werewolves, and ancient curses.',
    gameSystem: 'D&D 5e',
    playerCount: 5,
    maxPlayers: 6,
    nextSession: new Date('2025-01-22T20:00:00'),
    dmName: 'Marcus Rodriguez',
    image: 'https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=800',
    isActive: true,
  },
  {
    id: '3',
    name: 'Cyberpunk Red: Night City',
    description: 'High-tech, low-life adventures in the dark future of Night City. Corporate espionage and street survival.',
    gameSystem: 'Cyberpunk Red',
    playerCount: 3,
    maxPlayers: 5,
    dmName: 'Alex Kim',
    image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800',
    isActive: false,
  },
];

export default function CampaignsScreen() {
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'dm'>('all');

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    if (selectedFilter === 'active') return campaign.isActive;
    if (selectedFilter === 'dm') return campaign.dmName === 'Sarah Chen'; // Mock current user
    return true;
  });

  const formatNextSession = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="title" style={styles.title}>Campaigns</ThemedText>
            <ThemedText style={[styles.subtitle, { color: muted }]}>
              Your tabletop adventures await
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={[styles.createButton, { backgroundColor: primary }]}
            onPress={() => router.push('/campaign/create')}
          >
            <Plus color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${primary}20` }]}>
                <Map color={primary} size={20} />
              </View>
              <View>
                <ThemedText type="semiBold" style={styles.statNumber}>
                  {mockCampaigns.length}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: muted }]}>
                  Total Campaigns
                </ThemedText>
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${success}20` }]}>
                <Users color={success} size={20} />
              </View>
              <View>
                <ThemedText type="semiBold" style={styles.statNumber}>
                  {mockCampaigns.reduce((acc, c) => acc + c.playerCount, 0)}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: muted }]}>
                  Active Players
                </ThemedText>
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${warning}20` }]}>
                <Calendar color={warning} size={20} />
              </View>
              <View>
                <ThemedText type="semiBold" style={styles.statNumber}>
                  {mockCampaigns.filter(c => c.nextSession).length}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: muted }]}>
                  Upcoming Sessions
                </ThemedText>
              </View>
            </View>
          </Card>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {[
            { key: 'all', label: 'All Campaigns' },
            { key: 'active', label: 'Active' },
            { key: 'dm', label: 'My Games' },
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

        {/* Campaigns List */}
        <View style={styles.campaignsContainer}>
          {filteredCampaigns.map((campaign) => (
            <TouchableOpacity
              key={campaign.id}
              onPress={() => router.push(`/campaign/${campaign.id}`)}
            >
              <Card style={styles.campaignCard} variant="elevated">
                <View style={styles.campaignHeader}>
                  <Image source={{ uri: campaign.image }} style={styles.campaignImage} />
                  <View style={styles.campaignOverlay}>
                    {campaign.isActive && (
                      <View style={[styles.statusBadge, { backgroundColor: success }]}>
                        <ThemedText style={styles.statusText}>Active</ThemedText>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.campaignContent}>
                  <View style={styles.campaignTitleRow}>
                    <ThemedText type="semiBold" style={styles.campaignTitle}>
                      {campaign.name}
                    </ThemedText>
                    <View style={styles.gameSystemBadge}>
                      <ThemedText style={[styles.gameSystemText, { color: primary }]}>
                        {campaign.gameSystem}
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText style={[styles.campaignDescription, { color: muted }]} numberOfLines={2}>
                    {campaign.description}
                  </ThemedText>

                  <View style={styles.campaignMeta}>
                    <View style={styles.metaItem}>
                      <Crown color={muted} size={16} />
                      <ThemedText style={[styles.metaText, { color: muted }]}>
                        DM: {campaign.dmName}
                      </ThemedText>
                    </View>

                    <View style={styles.metaItem}>
                      <Users color={muted} size={16} />
                      <ThemedText style={[styles.metaText, { color: muted }]}>
                        {campaign.playerCount}/{campaign.maxPlayers} players
                      </ThemedText>
                    </View>

                    {campaign.nextSession && (
                      <View style={styles.metaItem}>
                        <Calendar color={muted} size={16} />
                        <ThemedText style={[styles.metaText, { color: muted }]}>
                          {formatNextSession(campaign.nextSession)}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Actions</ThemedText>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/dice-roller')}
            >
              <Card style={styles.actionCardInner}>
                <View style={[styles.actionIcon, { backgroundColor: `${primary}20` }]}>
                  <Dice6 color={primary} size={24} />
                </View>
                <ThemedText type="semiBold" style={styles.actionTitle}>Dice Roller</ThemedText>
                <ThemedText style={[styles.actionSubtitle, { color: muted }]}>
                  Roll dice for any game
                </ThemedText>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/characters')}
            >
              <Card style={styles.actionCardInner}>
                <View style={[styles.actionIcon, { backgroundColor: `${success}20` }]}>
                  <Users color={success} size={24} />
                </View>
                <ThemedText type="semiBold" style={styles.actionTitle}>Characters</ThemedText>
                <ThemedText style={[styles.actionSubtitle, { color: muted }]}>
                  Manage your heroes
                </ThemedText>
              </Card>
            </TouchableOpacity>
          </View>
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
  campaignsContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  campaignCard: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  campaignHeader: {
    position: 'relative',
    height: 120,
  },
  campaignImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  campaignOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  campaignContent: {
    padding: 16,
  },
  campaignTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  campaignTitle: {
    fontSize: 18,
    flex: 1,
    marginRight: 12,
  },
  gameSystemBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
  },
  gameSystemText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  campaignDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  campaignMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
  },
  actionCardInner: {
    padding: 20,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});
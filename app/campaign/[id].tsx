import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

interface Campaign {
  id: string;
  name: string;
  description: string;
  gameSystem: string;
  dmName: string;
  players: Player[];
  nextSession?: Date;
  image: string;
  isActive: boolean;
  sessions: Session[];
  notes: string;
}

interface Player {
  id: string;
  name: string;
  characterName: string;
  avatar: string;
  isOnline: boolean;
}

interface Session {
  id: string;
  name: string;
  date: Date;
  duration: number;
  notes: string;
}

// Mock campaign data
const mockCampaign: Campaign = {
  id: '1',
  name: 'The Lost Mines of Phandelver',
  description: 'A classic D&D adventure for new players. Explore goblin ambushes, mysterious ruins, and face the Black Spider in this thrilling adventure through the Sword Coast.',
  gameSystem: 'D&D 5e',
  dmName: 'Sarah Chen',
  players: [
    {
      id: '1',
      name: 'Alex Johnson',
      characterName: 'Thorin Ironforge',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Maria Garcia',
      characterName: 'Aria Moonwhisper',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      isOnline: false,
    },
    {
      id: '3',
      name: 'David Kim',
      characterName: 'Zara Nightblade',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      isOnline: true,
    },
  ],
  nextSession: new Date('2025-01-20T19:00:00'),
  image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800',
  isActive: true,
  sessions: [
    {
      id: '1',
      name: 'Session 1: Goblin Ambush',
      date: new Date('2025-01-13T19:00:00'),
      duration: 240,
      notes: 'The party encountered goblins on the road to Phandalin.',
    },
    {
      id: '2',
      name: 'Session 2: Cragmaw Hideout',
      date: new Date('2025-01-06T19:00:00'),
      duration: 180,
      notes: 'Explored the goblin hideout and rescued Sildar.',
    },
  ],
  notes: 'The party is currently level 2 and heading towards Phandalin to investigate the missing caravan.',
};

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');
  const danger = useThemeColor({}, 'danger');

  const [campaign] = useState<Campaign>(mockCampaign);
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'sessions'>('overview');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleJoinSession = () => {
    Alert.alert(
      'Join Session',
      'Would you like to join the upcoming session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Join', onPress: () => console.log('Joining session...') },
      ]
    );
  };

  const handleEdit = () => {
    router.push(`/campaign/edit/${id}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <Card style={styles.infoCard} variant="elevated">
              <ThemedText type="subtitle" style={styles.cardTitle}>Campaign Info</ThemedText>
              <View style={styles.infoRow}>
                <SFSymbol name="gamecontroller" color={primary} size={20} />
                <View style={styles.infoText}>
                  <ThemedText style={styles.infoLabel}>Game System</ThemedText>
                  <ThemedText type="semiBold">{campaign.gameSystem}</ThemedText>
                </View>
              </View>
              <View style={styles.infoRow}>
                <SFSymbol name="crown" color={warning} size={20} />
                <View style={styles.infoText}>
                  <ThemedText style={styles.infoLabel}>Dungeon Master</ThemedText>
                  <ThemedText type="semiBold">{campaign.dmName}</ThemedText>
                </View>
              </View>
              <View style={styles.infoRow}>
                <SFSymbol name="person.3" color={success} size={20} />
                <View style={styles.infoText}>
                  <ThemedText style={styles.infoLabel}>Players</ThemedText>
                  <ThemedText type="semiBold">{campaign.players.length} active</ThemedText>
                </View>
              </View>
            </Card>

            {campaign.nextSession && (
              <Card style={styles.nextSessionCard} variant="elevated">
                <View style={styles.nextSessionHeader}>
                  <View>
                    <ThemedText type="subtitle" style={styles.cardTitle}>Next Session</ThemedText>
                    <ThemedText style={[styles.sessionDate, { color: primary }]}>
                      {formatDate(campaign.nextSession)}
                    </ThemedText>
                  </View>
                  <Button
                    title="Join"
                    onPress={handleJoinSession}
                    size="small"
                  />
                </View>
              </Card>
            )}

            <Card style={styles.notesCard} variant="elevated">
              <ThemedText type="subtitle" style={styles.cardTitle}>Campaign Notes</ThemedText>
              <ThemedText style={[styles.notesText, { color: muted }]}>
                {campaign.notes}
              </ThemedText>
            </Card>
          </View>
        );

      case 'players':
        return (
          <View style={styles.tabContent}>
            {campaign.players.map((player) => (
              <Card key={player.id} style={styles.playerCard} variant="elevated">
                <View style={styles.playerInfo}>
                  <View style={styles.playerAvatarContainer}>
                    <Image source={{ uri: player.avatar }} style={styles.playerAvatar} />
                    <View
                      style={[
                        styles.onlineIndicator,
                        { backgroundColor: player.isOnline ? success : muted },
                      ]}
                    />
                  </View>
                  <View style={styles.playerDetails}>
                    <ThemedText type="semiBold" style={styles.playerName}>
                      {player.name}
                    </ThemedText>
                    <ThemedText style={[styles.characterName, { color: muted }]}>
                      Playing: {player.characterName}
                    </ThemedText>
                    <ThemedText style={[styles.onlineStatus, { color: player.isOnline ? success : muted }]}>
                      {player.isOnline ? 'Online' : 'Offline'}
                    </ThemedText>
                  </View>
                  <TouchableOpacity style={styles.playerAction}>
                    <SFSymbol name="message" color={primary} size={20} />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        );

      case 'sessions':
        return (
          <View style={styles.tabContent}>
            {campaign.sessions.map((session) => (
              <Card key={session.id} style={styles.sessionCard} variant="elevated">
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionInfo}>
                    <ThemedText type="semiBold" style={styles.sessionName}>
                      {session.name}
                    </ThemedText>
                    <ThemedText style={[styles.sessionDate, { color: muted }]}>
                      {formatDate(session.date)}
                    </ThemedText>
                    <ThemedText style={[styles.sessionDuration, { color: primary }]}>
                      Duration: {formatDuration(session.duration)}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={[styles.sessionNotes, { color: muted }]}>
                  {session.notes}
                </ThemedText>
              </Card>
            ))}
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
          title: campaign.name,
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
        {/* Campaign Header */}
        <View style={styles.header}>
          <Image source={{ uri: campaign.image }} style={styles.campaignImage} />
          <View style={styles.headerOverlay}>
            {campaign.isActive && (
              <View style={[styles.statusBadge, { backgroundColor: success }]}>
                <ThemedText style={styles.statusText}>Active</ThemedText>
              </View>
            )}
          </View>
        </View>

        <View style={styles.campaignInfo}>
          <ThemedText type="title" style={styles.campaignName}>
            {campaign.name}
          </ThemedText>
          <ThemedText style={[styles.campaignDescription, { color: muted }]}>
            {campaign.description}
          </ThemedText>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          {[
            { key: 'overview', label: 'Overview', icon: 'info.circle' },
            { key: 'players', label: 'Players', icon: 'person.3' },
            { key: 'sessions', label: 'Sessions', icon: 'calendar' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                activeTab === tab.key && { backgroundColor: primary },
              ]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <SFSymbol
                name={tab.icon as any}
                color={activeTab === tab.key ? '#FFFFFF' : muted}
                size={16}
              />
              <ThemedText
                style={[
                  styles.tabLabel,
                  { color: activeTab === tab.key ? '#FFFFFF' : muted },
                ]}
              >
                {tab.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}
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
    position: 'relative',
    height: 200,
  },
  campaignImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  campaignInfo: {
    padding: 20,
  },
  campaignName: {
    fontSize: 28,
    marginBottom: 8,
  },
  campaignDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 16,
  },
  infoCard: {
    padding: 20,
  },
  cardTitle: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  nextSessionCard: {
    padding: 20,
  },
  nextSessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sessionDate: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  notesCard: {
    padding: 20,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
  },
  playerCard: {
    padding: 16,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAvatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  playerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    marginBottom: 2,
  },
  characterName: {
    fontSize: 14,
    marginBottom: 2,
  },
  onlineStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  playerAction: {
    padding: 8,
  },
  sessionCard: {
    padding: 20,
  },
  sessionHeader: {
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: 16,
    marginBottom: 4,
  },
  sessionDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  sessionNotes: {
    fontSize: 14,
    lineHeight: 20,
  },
});
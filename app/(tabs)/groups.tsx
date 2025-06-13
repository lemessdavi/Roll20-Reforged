import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Plus, Users, MessageCircle, Calendar, Crown, UserPlus, Settings } from 'lucide-react-native';

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  isPrivate: boolean;
  avatar: string;
  owner: string;
  tags: string[];
  lastActivity: Date;
  isJoined: boolean;
}

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'D&D Enthusiasts',
    description: 'A community for D&D players of all experience levels. Share stories, find groups, and discuss rules.',
    memberCount: 1247,
    maxMembers: 2000,
    isPrivate: false,
    avatar: 'https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=400',
    owner: 'Sarah Chen',
    tags: ['D&D 5e', 'Beginner Friendly', 'Rules Discussion'],
    lastActivity: new Date('2025-01-15T14:30:00'),
    isJoined: true,
  },
  {
    id: '2',
    name: 'Horror RPG Society',
    description: 'For fans of horror-themed tabletop RPGs. Call of Cthulhu, Vampire, and other dark adventures.',
    memberCount: 342,
    maxMembers: 500,
    isPrivate: false,
    avatar: 'https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=400',
    owner: 'Marcus Rodriguez',
    tags: ['Call of Cthulhu', 'Vampire', 'Horror'],
    lastActivity: new Date('2025-01-14T20:15:00'),
    isJoined: true,
  },
  {
    id: '3',
    name: 'Cyberpunk Runners',
    description: 'High-tech, low-life adventures in cyberpunk settings. Shadowrun, Cyberpunk Red, and more.',
    memberCount: 156,
    maxMembers: 300,
    isPrivate: true,
    avatar: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=400',
    owner: 'Alex Kim',
    tags: ['Cyberpunk Red', 'Shadowrun', 'Sci-Fi'],
    lastActivity: new Date('2025-01-13T18:45:00'),
    isJoined: false,
  },
  {
    id: '4',
    name: 'Local Gaming Hub',
    description: 'Connect with local players in your area. Organize in-person sessions and events.',
    memberCount: 89,
    maxMembers: 200,
    isPrivate: false,
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
    owner: 'Jordan Taylor',
    tags: ['Local Play', 'In-Person', 'Events'],
    lastActivity: new Date('2025-01-12T16:20:00'),
    isJoined: false,
  },
];

export default function GroupsScreen() {
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'joined' | 'discover'>('all');

  const filteredGroups = mockGroups.filter(group => {
    if (selectedFilter === 'joined') return group.isJoined;
    if (selectedFilter === 'discover') return !group.isJoined;
    return true;
  });

  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffDays === 0) {
      if (diffHours === 0) return 'Active now';
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const joinGroup = (groupId: string) => {
    // Mock join functionality
    console.log('Joining group:', groupId);
  };

  const leaveGroup = (groupId: string) => {
    // Mock leave functionality
    console.log('Leaving group:', groupId);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="title" style={styles.title}>Groups</ThemedText>
            <ThemedText style={[styles.subtitle, { color: muted }]}>
              Connect with fellow adventurers
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={[styles.createButton, { backgroundColor: primary }]}
            onPress={() => router.push('/group/create')}
          >
            <Plus color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${primary}20` }]}>
                <Users color={primary} size={20} />
              </View>
              <View>
                <ThemedText type="semiBold" style={styles.statNumber}>
                  {mockGroups.filter(g => g.isJoined).length}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: muted }]}>
                  Joined Groups
                </ThemedText>
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${success}20` }]}>
                <MessageCircle color={success} size={20} />
              </View>
              <View>
                <ThemedText type="semiBold" style={styles.statNumber}>
                  {mockGroups.filter(g => g.isJoined).reduce((acc, g) => acc + g.memberCount, 0)}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: muted }]}>
                  Total Members
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
                  {mockGroups.filter(g => !g.isJoined).length}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: muted }]}>
                  Discover
                </ThemedText>
              </View>
            </View>
          </Card>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {[
            { key: 'all', label: 'All Groups' },
            { key: 'joined', label: 'My Groups' },
            { key: 'discover', label: 'Discover' },
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

        {/* Groups List */}
        <View style={styles.groupsContainer}>
          {filteredGroups.map((group) => (
            <TouchableOpacity
              key={group.id}
              onPress={() => router.push(`/group/${group.id}`)}
            >
              <Card style={styles.groupCard} variant="elevated">
                <View style={styles.groupHeader}>
                  <View style={styles.groupAvatarContainer}>
                    <Image source={{ uri: group.avatar }} style={styles.groupAvatar} />
                    {group.isPrivate && (
                      <View style={[styles.privateBadge, { backgroundColor: warning }]}>
                        <Settings color="#FFFFFF" size={12} />
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.groupInfo}>
                    <View style={styles.groupTitleRow}>
                      <ThemedText type="semiBold" style={styles.groupName}>
                        {group.name}
                      </ThemedText>
                      {group.isJoined && (
                        <View style={[styles.joinedBadge, { backgroundColor: success }]}>
                          <ThemedText style={styles.joinedText}>Joined</ThemedText>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.groupMetaRow}>
                      <View style={styles.metaItem}>
                        <Crown color={muted} size={14} />
                        <ThemedText style={[styles.metaText, { color: muted }]}>
                          {group.owner}
                        </ThemedText>
                      </View>
                      
                      <View style={styles.metaItem}>
                        <Users color={muted} size={14} />
                        <ThemedText style={[styles.metaText, { color: muted }]}>
                          {group.memberCount.toLocaleString()} members
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </View>

                <ThemedText style={[styles.groupDescription, { color: muted }]} numberOfLines={2}>
                  {group.description}
                </ThemedText>

                {/* Tags */}
                <View style={styles.tagsContainer}>
                  {group.tags.slice(0, 3).map((tag, index) => (
                    <View key={index} style={[styles.tag, { backgroundColor: `${primary}15` }]}>
                      <ThemedText style={[styles.tagText, { color: primary }]}>
                        {tag}
                      </ThemedText>
                    </View>
                  ))}
                  {group.tags.length > 3 && (
                    <ThemedText style={[styles.moreTagsText, { color: muted }]}>
                      +{group.tags.length - 3} more
                    </ThemedText>
                  )}
                </View>

                {/* Footer */}
                <View style={styles.groupFooter}>
                  <View style={styles.activityInfo}>
                    <ThemedText style={[styles.lastActivity, { color: muted }]}>
                      Last active {formatLastActivity(group.lastActivity)}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.groupActions}>
                    {group.isJoined ? (
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => router.push(`/group/${group.id}/chat`)}
                      >
                        <MessageCircle color={primary} size={20} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity 
                        style={[styles.joinButton, { backgroundColor: primary }]}
                        onPress={() => joinGroup(group.id)}
                      >
                        <UserPlus color="#FFFFFF" size={16} />
                        <ThemedText style={styles.joinButtonText}>Join</ThemedText>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: `${muted}20` }]}>
              <Users color={muted} size={48} />
            </View>
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              {selectedFilter === 'joined' ? 'No groups joined yet' : 'No groups found'}
            </ThemedText>
            <ThemedText style={[styles.emptySubtitle, { color: muted }]}>
              {selectedFilter === 'joined' 
                ? 'Join groups to connect with other players'
                : 'Try adjusting your filters or create a new group'
              }
            </ThemedText>
            <Button
              title={selectedFilter === 'joined' ? 'Discover Groups' : 'Create Group'}
              onPress={() => selectedFilter === 'joined' ? setSelectedFilter('discover') : router.push('/group/create')}
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
  groupsContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  groupCard: {
    padding: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  groupAvatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  groupAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  privateBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  groupInfo: {
    flex: 1,
  },
  groupTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 18,
    flex: 1,
    marginRight: 12,
  },
  joinedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  joinedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  groupMetaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  groupDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  moreTagsText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  lastActivity: {
    fontSize: 12,
  },
  groupActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  joinButtonText: {
    color: '#FFFFFF',
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
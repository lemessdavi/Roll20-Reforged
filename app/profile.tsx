import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Alert, Image, TextInput } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

interface UserProfile {
  name: string;
  email: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  avatar: string;
  joinDate: Date;
  stats: {
    campaignsPlayed: number;
    charactersCreated: number;
    groupsJoined: number;
    hoursPlayed: number;
  };
}

export default function ProfileScreen() {
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');

  const [profile, setProfile] = useState<UserProfile>({
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    username: 'sarahthedruid',
    bio: 'Passionate D&D player and occasional DM. Love creating memorable characters and epic adventures!',
    location: 'San Francisco, CA',
    website: 'https://sarahsadventures.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
    joinDate: new Date('2023-03-15'),
    stats: {
      campaignsPlayed: 12,
      charactersCreated: 8,
      groupsJoined: 3,
      hoursPlayed: 156,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values if needed
  };

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Profile',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <SFSymbol name="chevron.left" color={text} size={24} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <SFSymbol 
                name={isEditing ? "xmark" : "pencil"} 
                color={isEditing ? muted : primary} 
                size={20} 
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.headerCard} variant="elevated">
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              {isEditing && (
                <TouchableOpacity style={styles.avatarEditButton}>
                  <SFSymbol name="camera" color="#FFFFFF" size={16} />
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.headerInfo}>
              <ThemedText type="title" style={styles.profileName}>
                {profile.name}
              </ThemedText>
              <ThemedText style={[styles.username, { color: primary }]}>
                @{profile.username}
              </ThemedText>
              <ThemedText style={[styles.joinDate, { color: muted }]}>
                Member since {formatJoinDate(profile.joinDate)}
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Stats */}
        <Card style={styles.statsCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Gaming Stats
          </ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <SFSymbol name="map" color={primary} size={24} />
              <ThemedText type="semiBold" style={styles.statNumber}>
                {profile.stats.campaignsPlayed}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: muted }]}>
                Campaigns
              </ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <SFSymbol name="person" color={success} size={24} />
              <ThemedText type="semiBold" style={styles.statNumber}>
                {profile.stats.charactersCreated}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: muted }]}>
                Characters
              </ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <SFSymbol name="person.3" color={warning} size={24} />
              <ThemedText type="semiBold" style={styles.statNumber}>
                {profile.stats.groupsJoined}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: muted }]}>
                Groups
              </ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <SFSymbol name="clock" color={primary} size={24} />
              <ThemedText type="semiBold" style={styles.statNumber}>
                {profile.stats.hoursPlayed}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: muted }]}>
                Hours
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Profile Information */}
        <Card style={styles.infoCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Profile Information
          </ThemedText>

          {isEditing ? (
            <View style={styles.editForm}>
              <Input
                label="Display Name"
                value={profile.name}
                onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
              />
              
              <Input
                label="Username"
                value={profile.username}
                onChangeText={(text) => setProfile(prev => ({ ...prev, username: text }))}
              />
              
              <Input
                label="Email"
                value={profile.email}
                onChangeText={(text) => setProfile(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
              />
              
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Bio</ThemedText>
                <TextInput
                  style={[styles.textArea, { color: text, borderColor: muted }]}
                  value={profile.bio}
                  onChangeText={(text) => setProfile(prev => ({ ...prev, bio: text }))}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={muted}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              
              <Input
                label="Location"
                value={profile.location}
                onChangeText={(text) => setProfile(prev => ({ ...prev, location: text }))}
              />
              
              <Input
                label="Website"
                value={profile.website}
                onChangeText={(text) => setProfile(prev => ({ ...prev, website: text }))}
                keyboardType="url"
              />
            </View>
          ) : (
            <View style={styles.infoDisplay}>
              <View style={styles.infoRow}>
                <SFSymbol name="envelope" color={muted} size={20} />
                <View style={styles.infoText}>
                  <ThemedText style={styles.infoLabel}>Email</ThemedText>
                  <ThemedText>{profile.email}</ThemedText>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <SFSymbol name="text.quote" color={muted} size={20} />
                <View style={styles.infoText}>
                  <ThemedText style={styles.infoLabel}>Bio</ThemedText>
                  <ThemedText style={styles.bioText}>{profile.bio}</ThemedText>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <SFSymbol name="location" color={muted} size={20} />
                <View style={styles.infoText}>
                  <ThemedText style={styles.infoLabel}>Location</ThemedText>
                  <ThemedText>{profile.location}</ThemedText>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <SFSymbol name="link" color={muted} size={20} />
                <View style={styles.infoText}>
                  <ThemedText style={styles.infoLabel}>Website</ThemedText>
                  <ThemedText style={[styles.websiteLink, { color: primary }]}>
                    {profile.website}
                  </ThemedText>
                </View>
              </View>
            </View>
          )}
        </Card>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={isLoading}
              style={styles.saveButton}
            />
          </View>
        )}

        {/* Additional Actions */}
        <Card style={styles.actionsCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Account Actions
          </ThemedText>
          
          <TouchableOpacity style={styles.actionItem}>
            <SFSymbol name="key" color={primary} size={20} />
            <ThemedText style={styles.actionText}>Change Password</ThemedText>
            <SFSymbol name="chevron.right" color={muted} size={16} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <SFSymbol name="bell" color={primary} size={20} />
            <ThemedText style={styles.actionText}>Notification Settings</ThemedText>
            <SFSymbol name="chevron.right" color={muted} size={16} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <SFSymbol name="shield" color={primary} size={20} />
            <ThemedText style={styles.actionText}>Privacy Settings</ThemedText>
            <SFSymbol name="chevron.right" color={muted} size={16} />
          </TouchableOpacity>
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
  headerCard: {
    margin: 20,
    padding: 24,
  },
  profileHeader: {
    flexDirection: 'row',
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
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
  },
  sectionTitle: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
  },
  editForm: {
    gap: 16,
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
    minHeight: 80,
  },
  infoDisplay: {
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  bioText: {
    lineHeight: 22,
  },
  websiteLink: {
    textDecorationLine: 'underline',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  actionsCard: {
    marginHorizontal: 20,
    marginBottom: 100,
    padding: 24,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
  },
});
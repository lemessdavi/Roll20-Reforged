import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Switch, Alert } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  showGameHistory: boolean;
  allowGroupInvites: boolean;
  dataCollection: boolean;
  analyticsOptOut: boolean;
  marketingEmails: boolean;
}

export default function PrivacyScreen() {
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const surface = useThemeColor({}, 'surface');
  const danger = useThemeColor({}, 'danger');

  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowDirectMessages: true,
    showGameHistory: true,
    allowGroupInvites: true,
    dataCollection: true,
    analyticsOptOut: false,
    marketingEmails: false,
  });

  const updateSetting = <K extends keyof PrivacySettings>(
    key: K,
    value: PrivacySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Account Deletion', 'Account deletion request submitted. You will receive an email with further instructions.');
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data export will be prepared and sent to your email address within 24 hours.',
      [{ text: 'OK' }]
    );
  };

  const renderToggleSetting = (
    title: string,
    description: string,
    value: boolean,
    onToggle: (value: boolean) => void,
    icon: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <SFSymbol name={icon as any} color={primary} size={20} />
      </View>
      <View style={styles.settingContent}>
        <ThemedText type="semiBold" style={styles.settingTitle}>
          {title}
        </ThemedText>
        <ThemedText style={[styles.settingDescription, { color: muted }]}>
          {description}
        </ThemedText>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: surface, true: `${primary}40` }}
        thumbColor={value ? primary : muted}
      />
    </View>
  );

  const renderVisibilityOption = (
    option: 'public' | 'friends' | 'private',
    title: string,
    description: string
  ) => (
    <TouchableOpacity
      style={[
        styles.visibilityOption,
        { backgroundColor: surface },
        settings.profileVisibility === option && { backgroundColor: `${primary}20`, borderColor: primary },
      ]}
      onPress={() => updateSetting('profileVisibility', option)}
    >
      <View style={styles.visibilityContent}>
        <ThemedText type="semiBold" style={styles.visibilityTitle}>
          {title}
        </ThemedText>
        <ThemedText style={[styles.visibilityDescription, { color: muted }]}>
          {description}
        </ThemedText>
      </View>
      {settings.profileVisibility === option && (
        <SFSymbol name="checkmark.circle.fill" color={primary} size={24} />
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Privacy & Security',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <SFSymbol name="chevron.left" color={text} size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Visibility */}
        <Card style={styles.sectionCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Profile Visibility
          </ThemedText>
          <ThemedText style={[styles.sectionDescription, { color: muted }]}>
            Control who can see your profile information
          </ThemedText>

          <View style={styles.visibilityOptions}>
            {renderVisibilityOption(
              'public',
              'Public',
              'Anyone can view your profile and game history'
            )}
            {renderVisibilityOption(
              'friends',
              'Friends Only',
              'Only your friends can view your profile'
            )}
            {renderVisibilityOption(
              'private',
              'Private',
              'Your profile is hidden from everyone'
            )}
          </View>
        </Card>

        {/* Communication Settings */}
        <Card style={styles.sectionCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Communication
          </ThemedText>

          {renderToggleSetting(
            'Show Online Status',
            'Let others see when you\'re online',
            settings.showOnlineStatus,
            (value) => updateSetting('showOnlineStatus', value),
            'circle.fill'
          )}

          {renderToggleSetting(
            'Allow Direct Messages',
            'Receive messages from other players',
            settings.allowDirectMessages,
            (value) => updateSetting('allowDirectMessages', value),
            'message'
          )}

          {renderToggleSetting(
            'Allow Group Invites',
            'Receive invitations to join groups',
            settings.allowGroupInvites,
            (value) => updateSetting('allowGroupInvites', value),
            'person.3'
          )}
        </Card>

        {/* Game Data */}
        <Card style={styles.sectionCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Game Data
          </ThemedText>

          {renderToggleSetting(
            'Show Game History',
            'Display your campaigns and characters publicly',
            settings.showGameHistory,
            (value) => updateSetting('showGameHistory', value),
            'clock'
          )}
        </Card>

        {/* Data & Analytics */}
        <Card style={styles.sectionCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Data & Analytics
          </ThemedText>

          {renderToggleSetting(
            'Data Collection',
            'Help improve the app by sharing usage data',
            settings.dataCollection,
            (value) => updateSetting('dataCollection', value),
            'chart.bar'
          )}

          {renderToggleSetting(
            'Opt Out of Analytics',
            'Disable analytics and tracking',
            settings.analyticsOptOut,
            (value) => updateSetting('analyticsOptOut', value),
            'eye.slash'
          )}

          {renderToggleSetting(
            'Marketing Emails',
            'Receive promotional emails and updates',
            settings.marketingEmails,
            (value) => updateSetting('marketingEmails', value),
            'envelope'
          )}
        </Card>

        {/* Data Management */}
        <Card style={styles.sectionCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Data Management
          </ThemedText>

          <TouchableOpacity style={styles.actionItem} onPress={handleExportData}>
            <View style={styles.actionIcon}>
              <SFSymbol name="square.and.arrow.up" color={primary} size={20} />
            </View>
            <View style={styles.actionContent}>
              <ThemedText type="semiBold" style={styles.actionTitle}>
                Export My Data
              </ThemedText>
              <ThemedText style={[styles.actionDescription, { color: muted }]}>
                Download a copy of all your data
              </ThemedText>
            </View>
            <SFSymbol name="chevron.right" color={muted} size={16} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.actionItem} onPress={handleDeleteAccount}>
            <View style={styles.actionIcon}>
              <SFSymbol name="trash" color={danger} size={20} />
            </View>
            <View style={styles.actionContent}>
              <ThemedText type="semiBold" style={[styles.actionTitle, { color: danger }]}>
                Delete Account
              </ThemedText>
              <ThemedText style={[styles.actionDescription, { color: muted }]}>
                Permanently delete your account and all data
              </ThemedText>
            </View>
            <SFSymbol name="chevron.right" color={muted} size={16} />
          </TouchableOpacity>
        </Card>

        {/* Legal */}
        <Card style={styles.sectionCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Legal
          </ThemedText>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <SFSymbol name="doc.text" color={primary} size={20} />
            </View>
            <View style={styles.actionContent}>
              <ThemedText type="semiBold" style={styles.actionTitle}>
                Privacy Policy
              </ThemedText>
              <ThemedText style={[styles.actionDescription, { color: muted }]}>
                Read our privacy policy
              </ThemedText>
            </View>
            <SFSymbol name="chevron.right" color={muted} size={16} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <SFSymbol name="doc.text" color={primary} size={20} />
            </View>
            <View style={styles.actionContent}>
              <ThemedText type="semiBold" style={styles.actionTitle}>
                Terms of Service
              </ThemedText>
              <ThemedText style={[styles.actionDescription, { color: muted }]}>
                Read our terms of service
              </ThemedText>
            </View>
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
  sectionCard: {
    margin: 20,
    marginBottom: 0,
    marginTop: 20,
    padding: 24,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  visibilityOptions: {
    gap: 12,
  },
  visibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  visibilityContent: {
    flex: 1,
  },
  visibilityTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  visibilityDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
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
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginLeft: 56,
  },
});
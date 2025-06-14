import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  destructive?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const danger = useThemeColor({}, 'danger');
  const surface = useThemeColor({}, 'surface');

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile',
          subtitle: 'Manage your account information',
          icon: <SFSymbol name="person.circle" color={primary} size={20} />,
          type: 'navigation',
          onPress: () => router.push('/profile'),
        },
        {
          id: 'privacy',
          title: 'Privacy & Security',
          subtitle: 'Control your privacy settings',
          icon: <SFSymbol name="shield" color={primary} size={20} />,
          type: 'navigation',
          onPress: () => router.push('/privacy'),
        },
      ] as SettingItem[],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Get notified about campaigns and messages',
          icon: <SFSymbol name="bell" color={primary} size={20} />,
          type: 'toggle',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 'darkMode',
          title: 'Dark Mode',
          subtitle: 'Switch between light and dark themes',
          icon: <SFSymbol name="moon" color={primary} size={20} />,
          type: 'toggle',
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          id: 'haptic',
          title: 'Haptic Feedback',
          subtitle: 'Feel vibrations for dice rolls and interactions',
          icon: <SFSymbol name="hand.tap" color={primary} size={20} />,
          type: 'toggle',
          value: hapticFeedback,
          onToggle: setHapticFeedback,
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'English',
          icon: <SFSymbol name="globe" color={primary} size={20} />,
          type: 'navigation',
          onPress: () => router.push('/language'),
        },
      ] as SettingItem[],
    },
    {
      title: 'Content',
      items: [
        {
          id: 'autoDownload',
          title: 'Auto-download Content',
          subtitle: 'Download maps and assets automatically',
          icon: <SFSymbol name="arrow.down.circle" color={primary} size={20} />,
          type: 'toggle',
          value: autoDownload,
          onToggle: setAutoDownload,
        },
        {
          id: 'storage',
          title: 'Storage & Data',
          subtitle: 'Manage downloaded content',
          icon: <SFSymbol name="wifi" color={primary} size={20} />,
          type: 'navigation',
          onPress: () => router.push('/storage'),
        },
      ] as SettingItem[],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          subtitle: 'Get help and find answers',
          icon: <SFSymbol name="questionmark.circle" color={primary} size={20} />,
          type: 'navigation',
          onPress: () => router.push('/help'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          icon: <SFSymbol name="message" color={primary} size={20} />,
          type: 'navigation',
          onPress: () => router.push('/feedback'),
        },
        {
          id: 'rate',
          title: 'Rate the App',
          subtitle: 'Share your experience',
          icon: <SFSymbol name="star" color={primary} size={20} />,
          type: 'action',
          onPress: () => console.log('Rate app'),
        },
      ] as SettingItem[],
    },
    {
      title: 'Account Actions',
      items: [
        {
          id: 'logout',
          title: 'Sign Out',
          icon: <SFSymbol name="rectangle.portrait.and.arrow.right" color={danger} size={20} />,
          type: 'action',
          destructive: true,
          onPress: handleLogout,
        },
      ] as SettingItem[],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        disabled={item.type === 'toggle'}
      >
        <View style={styles.settingContent}>
          <View style={styles.settingIcon}>
            {item.icon}
          </View>
          <View style={styles.settingText}>
            <ThemedText 
              type="semiBold" 
              style={[
                styles.settingTitle,
                item.destructive && { color: danger }
              ]}
            >
              {item.title}
            </ThemedText>
            {item.subtitle && (
              <ThemedText style={[styles.settingSubtitle, { color: muted }]}>
                {item.subtitle}
              </ThemedText>
            )}
          </View>
          <View style={styles.settingAction}>
            {item.type === 'toggle' && (
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{ false: surface, true: `${primary}40` }}
                thumbColor={item.value ? primary : muted}
              />
            )}
            {item.type === 'navigation' && (
              <SFSymbol name="chevron.right" color={muted} size={20} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>Settings</ThemedText>
          <ThemedText style={[styles.subtitle, { color: muted }]}>
            Customize your experience
          </ThemedText>
        </View>

        {/* User Profile Card */}
        <View style={styles.profileSection}>
          <Card style={styles.profileCard} variant="elevated">
            <View style={styles.profileContent}>
              <View style={styles.profileAvatar}>
                <SFSymbol name="person.circle" color={primary} size={32} />
              </View>
              <View style={styles.profileInfo}>
                <ThemedText type="semiBold" style={styles.profileName}>
                  Sarah Chen
                </ThemedText>
                <ThemedText style={[styles.profileEmail, { color: muted }]}>
                  sarah.chen@example.com
                </ThemedText>
                <ThemedText style={[styles.profileStatus, { color: primary }]}>
                  Premium Member
                </ThemedText>
              </View>
              <TouchableOpacity 
                style={styles.editProfileButton}
                onPress={() => router.push('/profile')}
              >
                <SFSymbol name="chevron.right" color={muted} size={20} />
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Settings Sections */}
        <View style={styles.settingsContainer}>
          {settingSections.map((section, sectionIndex) => (
            <View key={section.title} style={styles.settingSection}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                {section.title}
              </ThemedText>
              <Card style={styles.sectionCard}>
                {section.items.map((item, itemIndex) => (
                  <View key={item.id}>
                    {renderSettingItem(item)}
                    {itemIndex < section.items.length - 1 && (
                      <View style={[styles.separator, { backgroundColor: surface }]} />
                    )}
                  </View>
                ))}
              </Card>
            </View>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <ThemedText style={[styles.appVersion, { color: muted }]}>
            Roll20 Reforged v1.0.0
          </ThemedText>
          <ThemedText style={[styles.appBuild, { color: muted }]}>
            Build 2025.01.15
          </ThemedText>
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
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  profileCard: {
    padding: 20,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsContainer: {
    paddingHorizontal: 20,
    gap: 24,
    marginBottom: 32,
  },
  settingSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  sectionCard: {
    overflow: 'hidden',
  },
  settingItem: {
    padding: 16,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  settingAction: {
    marginLeft: 16,
  },
  separator: {
    height: 1,
    marginLeft: 72,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 4,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  appBuild: {
    fontSize: 12,
  },
});
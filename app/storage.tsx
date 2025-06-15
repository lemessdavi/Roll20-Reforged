import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

interface StorageData {
  total: number;
  used: number;
  categories: {
    characters: number;
    campaigns: number;
    images: number;
    cache: number;
    other: number;
  };
}

export default function StorageScreen() {
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');
  const danger = useThemeColor({}, 'danger');

  const [storageData] = useState<StorageData>({
    total: 1024, // 1GB in MB
    used: 342,   // 342MB used
    categories: {
      characters: 45,
      campaigns: 128,
      images: 89,
      cache: 67,
      other: 13,
    },
  });

  const [isClearing, setIsClearing] = useState(false);

  const formatSize = (sizeInMB: number): string => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} GB`;
    }
    return `${sizeInMB} MB`;
  };

  const getUsagePercentage = (): number => {
    return (storageData.used / storageData.total) * 100;
  };

  const getUsageColor = (): string => {
    const percentage = getUsagePercentage();
    if (percentage > 80) return danger;
    if (percentage > 60) return warning;
    return success;
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will clear temporary files and cached data. Your characters and campaigns will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          onPress: async () => {
            setIsClearing(true);
            try {
              // Simulate cache clearing
              await new Promise(resolve => setTimeout(resolve, 2000));
              Alert.alert('Success', 'Cache cleared successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache. Please try again.');
            } finally {
              setIsClearing(false);
            }
          
          }
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your characters, campaigns, and other data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Data Cleared', 'All local data has been cleared.');
          }
        },
      ]
    );
  };

  const storageCategories = [
    {
      key: 'characters',
      name: 'Characters',
      icon: 'person',
      color: primary,
      size: storageData.categories.characters,
    },
    {
      key: 'campaigns',
      name: 'Campaigns',
      icon: 'map',
      color: success,
      size: storageData.categories.campaigns,
    },
    {
      key: 'images',
      name: 'Images & Assets',
      icon: 'photo',
      color: warning,
      size: storageData.categories.images,
    },
    {
      key: 'cache',
      name: 'Cache',
      icon: 'externaldrive',
      color: muted,
      size: storageData.categories.cache,
    },
    {
      key: 'other',
      name: 'Other',
      icon: 'doc',
      color: '#8B5CF6',
      size: storageData.categories.other,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Storage & Data',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <SFSymbol name="chevron.left" color={text} size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Storage Overview */}
        <Card style={styles.overviewCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Storage Usage
          </ThemedText>
          
          <View style={styles.usageContainer}>
            <View style={styles.usageInfo}>
              <ThemedText type="semiBold" style={styles.usageText}>
                {formatSize(storageData.used)} of {formatSize(storageData.total)} used
              </ThemedText>
              <ThemedText style={[styles.usagePercentage, { color: muted }]}>
                {getUsagePercentage().toFixed(1)}% full
              </ThemedText>
            </View>
            
            <View style={styles.usageBarContainer}>
              <View style={[styles.usageBar, { backgroundColor: `${getUsageColor()}20` }]}>
                <View
                  style={[
                    styles.usageBarFill,
                    {
                      backgroundColor: getUsageColor(),
                      width: `${getUsagePercentage()}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </Card>

        {/* Storage Breakdown */}
        <Card style={styles.breakdownCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Storage Breakdown
          </ThemedText>
          
          <View style={styles.categoriesList}>
            {storageCategories.map((category) => (
              <View key={category.key} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                    <SFSymbol name={category.icon as any} color={category.color} size={20} />
                  </View>
                  <View style={styles.categoryText}>
                    <ThemedText type="semiBold" style={styles.categoryName}>
                      {category.name}
                    </ThemedText>
                    <ThemedText style={[styles.categorySize, { color: muted }]}>
                      {formatSize(category.size)}
                    </ThemedText>
                  </View>
                </View>
                
                <View style={styles.categoryBar}>
                  <View
                    style={[
                      styles.categoryBarFill,
                      {
                        backgroundColor: category.color,
                        width: `${(category.size / storageData.used) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Data Management */}
        <Card style={styles.managementCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Data Management
          </ThemedText>
          
          <View style={styles.managementActions}>
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <SFSymbol name="icloud.and.arrow.down" color={primary} size={20} />
              </View>
              <View style={styles.actionContent}>
                <ThemedText type="semiBold" style={styles.actionTitle}>
                  Backup Data
                </ThemedText>
                <ThemedText style={[styles.actionDescription, { color: muted }]}>
                  Create a backup of all your data
                </ThemedText>
              </View>
              <SFSymbol name="chevron.right" color={muted} size={16} />
            </TouchableOpacity>
            
            <View style={styles.separator} />
            
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <SFSymbol name="icloud.and.arrow.up" color={primary} size={20} />
              </View>
              <View style={styles.actionContent}>
                <ThemedText type="semiBold" style={styles.actionTitle}>
                  Restore Data
                </ThemedText>
                <ThemedText style={[styles.actionDescription, { color: muted }]}>
                  Restore data from a backup
                </ThemedText>
              </View>
              <SFSymbol name="chevron.right" color={muted} size={16} />
            </TouchableOpacity>
            
            <View style={styles.separator} />
            
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <SFSymbol name="square.and.arrow.up" color={primary} size={20} />
              </View>
              <View style={styles.actionContent}>
                <ThemedText type="semiBold" style={styles.actionTitle}>
                  Export Data
                </ThemedText>
                <ThemedText style={[styles.actionDescription, { color: muted }]}>
                  Export your data in various formats
                </ThemedText>
              </View>
              <SFSymbol name="chevron.right" color={muted} size={16} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Clear Data */}
        <Card style={styles.clearCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Clear Data
          </ThemedText>
          
          <View style={styles.clearActions}>
            <Button
              title="Clear Cache"
              onPress={handleClearCache}
              loading={isClearing}
              variant="outline"
              style={styles.clearButton}
            />
            
            <Button
              title="Clear All Data"
              onPress={handleClearAllData}
              variant="danger"
              style={styles.clearButton}
            />
          </View>
          
          <ThemedText style={[styles.clearWarning, { color: muted }]}>
            Clearing cache will free up space without affecting your saved data. 
            Clearing all data will permanently delete everything and cannot be undone.
          </ThemedText>
        </Card>

        {/* Sync Settings */}
        <Card style={styles.syncCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Sync Settings
          </ThemedText>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <SFSymbol name="arrow.triangle.2.circlepath" color={primary} size={20} />
            </View>
            <View style={styles.actionContent}>
              <ThemedText type="semiBold" style={styles.actionTitle}>
                Auto Sync
              </ThemedText>
              <ThemedText style={[styles.actionDescription, { color: muted }]}>
                Automatically sync data across devices
              </ThemedText>
            </View>
            <SFSymbol name="chevron.right" color={muted} size={16} />
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <SFSymbol name="wifi" color={primary} size={20} />
            </View>
            <View style={styles.actionContent}>
              <ThemedText type="semiBold" style={styles.actionTitle}>
                Sync on WiFi Only
              </ThemedText>
              <ThemedText style={[styles.actionDescription, { color: muted }]}>
                Only sync when connected to WiFi
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
  overviewCard: {
    margin: 20,
    padding: 20,
  },
  breakdownCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  managementCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  clearCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  syncCard: {
    marginHorizontal: 20,
    marginBottom: 100,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  usageContainer: {
    gap: 16,
  },
  usageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageText: {
    fontSize: 18,
  },
  usagePercentage: {
    fontSize: 14,
  },
  usageBarContainer: {
    width: '100%',
  },
  usageBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  usageBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoriesList: {
    gap: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    marginBottom: 2,
  },
  categorySize: {
    fontSize: 14,
  },
  categoryBar: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  managementActions: {
    gap: 4,
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
  clearActions: {
    gap: 12,
    marginBottom: 16,
  },
  clearButton: {
    width: '100%',
  },
  clearWarning: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
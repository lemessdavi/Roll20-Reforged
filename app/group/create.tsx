import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Alert, TextInput } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

interface GroupForm {
  name: string;
  description: string;
  maxMembers: number;
  isPrivate: boolean;
  tags: string[];
  rules: string;
}

const GROUP_TAGS = [
  'D&D 5e',
  'Pathfinder',
  'Call of Cthulhu',
  'Vampire',
  'Cyberpunk',
  'Horror',
  'Fantasy',
  'Sci-Fi',
  'Beginner Friendly',
  'Experienced Players',
  'Roleplay Heavy',
  'Combat Heavy',
  'Weekly Games',
  'Bi-weekly Games',
  'Monthly Games',
  'Local Group',
  'Online Only',
  'Text-based',
  'Voice Chat',
  'Video Chat',
];

export default function CreateGroupScreen() {
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const surface = useThemeColor({}, 'surface');

  const [form, setForm] = useState<GroupForm>({
    name: '',
    description: '',
    maxMembers: 50,
    isPrivate: false,
    tags: [],
    rules: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Group Created!',
        `${form.name} has been created successfully.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Create Group',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <SFSymbol name="chevron.left" color={text} size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Basic Information
          </ThemedText>

          <Input
            label="Group Name *"
            value={form.name}
            onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
            placeholder="Enter group name"
          />

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Description *</ThemedText>
            <TextInput
              style={[styles.textArea, { color: text, borderColor: muted }]}
              value={form.description}
              onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
              placeholder="Describe your group's purpose and what kind of players you're looking for..."
              placeholderTextColor={muted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <ThemedText type="semiBold" style={styles.settingTitle}>
                Maximum Members
              </ThemedText>
              <ThemedText style={[styles.settingDescription, { color: muted }]}>
                How many members can join this group?
              </ThemedText>
            </View>
            <View style={styles.memberCountControl}>
              <TouchableOpacity
                style={[styles.countButton, { backgroundColor: surface }]}
                onPress={() => setForm(prev => ({ ...prev, maxMembers: Math.max(5, prev.maxMembers - 5) }))}
              >
                <SFSymbol name="minus" color={text} size={16} />
              </TouchableOpacity>
              <ThemedText type="semiBold" style={styles.countValue}>
                {form.maxMembers}
              </ThemedText>
              <TouchableOpacity
                style={[styles.countButton, { backgroundColor: surface }]}
                onPress={() => setForm(prev => ({ ...prev, maxMembers: Math.min(500, prev.maxMembers + 5) }))}
              >
                <SFSymbol name="plus" color={text} size={16} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setForm(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
          >
            <View style={styles.settingInfo}>
              <ThemedText type="semiBold" style={styles.settingTitle}>
                Private Group
              </ThemedText>
              <ThemedText style={[styles.settingDescription, { color: muted }]}>
                Require approval to join
              </ThemedText>
            </View>
            <View
              style={[
                styles.toggle,
                { backgroundColor: form.isPrivate ? primary : surface },
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  {
                    backgroundColor: '#FFFFFF',
                    transform: [{ translateX: form.isPrivate ? 20 : 2 }],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </Card>

        <Card style={styles.tagsCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Tags
          </ThemedText>
          <ThemedText style={[styles.tagDescription, { color: muted }]}>
            Help people find your group by adding relevant tags
          </ThemedText>
          
          <View style={styles.tagsGrid}>
            {GROUP_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagItem,
                  { backgroundColor: surface },
                  form.tags.includes(tag) && { backgroundColor: primary },
                ]}
                onPress={() => toggleTag(tag)}
              >
                <ThemedText
                  style={[
                    styles.tagText,
                    form.tags.includes(tag) && { color: '#FFFFFF' },
                  ]}
                >
                  {tag}
                </ThemedText>
                {form.tags.includes(tag) && (
                  <SFSymbol name="checkmark" color="#FFFFFF" size={14} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.rulesCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Group Rules (Optional)
          </ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Community Guidelines</ThemedText>
            <TextInput
              style={[styles.textArea, { color: text, borderColor: muted }]}
              value={form.rules}
              onChangeText={(text) => setForm(prev => ({ ...prev, rules: text }))}
              placeholder="Set expectations for behavior, posting guidelines, and any specific rules for your group..."
              placeholderTextColor={muted}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </Card>

        <View style={styles.actionButtons}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title="Create Group"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.createButton}
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
  formCard: {
    margin: 20,
    padding: 24,
  },
  tagsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
  },
  rulesCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
  },
  sectionTitle: {
    marginBottom: 20,
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
    minHeight: 100,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  memberCountControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countValue: {
    fontSize: 18,
    minWidth: 40,
    textAlign: 'center',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'relative',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
  },
  tagDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 1,
  },
});
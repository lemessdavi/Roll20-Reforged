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

interface FeedbackForm {
  type: 'bug' | 'feature' | 'improvement' | 'other';
  subject: string;
  description: string;
  email: string;
  includeSystemInfo: boolean;
}

const FEEDBACK_TYPES = [
  {
    key: 'bug',
    title: 'Bug Report',
    description: 'Report a problem or issue',
    icon: 'exclamationmark.triangle',
    color: '#EF4444',
  },
  {
    key: 'feature',
    title: 'Feature Request',
    description: 'Suggest a new feature',
    icon: 'lightbulb',
    color: '#F59E0B',
  },
  {
    key: 'improvement',
    title: 'Improvement',
    description: 'Suggest an enhancement',
    icon: 'arrow.up.circle',
    color: '#10B981',
  },
  {
    key: 'other',
    title: 'Other',
    description: 'General feedback',
    icon: 'message',
    color: '#7C3AED',
  },
];

export default function FeedbackScreen() {
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const surface = useThemeColor({}, 'surface');

  const [form, setForm] = useState<FeedbackForm>({
    type: 'bug',
    subject: '',
    description: '',
    email: '',
    includeSystemInfo: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.subject.trim() || !form.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Feedback Sent!',
        'Thank you for your feedback. We\'ll review it and get back to you if needed.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = FEEDBACK_TYPES.find(type => type.key === form.type);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Send Feedback',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <SFSymbol name="chevron.left" color={text} size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Feedback Type */}
        <Card style={styles.typeCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            What type of feedback do you have?
          </ThemedText>
          
          <View style={styles.typeGrid}>
            {FEEDBACK_TYPES.map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.typeItem,
                  { backgroundColor: surface },
                  form.type === type.key && { 
                    backgroundColor: `${type.color}20`,
                    borderColor: type.color,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setForm(prev => ({ ...prev, type: type.key as any }))}
              >
                <View style={[styles.typeIcon, { backgroundColor: `${type.color}20` }]}>
                  <SFSymbol name={type.icon as any} color={type.color} size={24} />
                </View>
                <ThemedText type="semiBold" style={styles.typeTitle}>
                  {type.title}
                </ThemedText>
                <ThemedText style={[styles.typeDescription, { color: muted }]}>
                  {type.description}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Feedback Form */}
        <Card style={styles.formCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Tell us more
          </ThemedText>

          <Input
            label="Subject *"
            value={form.subject}
            onChangeText={(text) => setForm(prev => ({ ...prev, subject: text }))}
            placeholder={`Brief description of your ${selectedType?.title.toLowerCase()}`}
          />

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Description *</ThemedText>
            <TextInput
              style={[styles.textArea, { color: text, borderColor: muted }]}
              value={form.description}
              onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
              placeholder={`Please provide detailed information about your ${selectedType?.title.toLowerCase()}...`}
              placeholderTextColor={muted}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <Input
            label="Email (Optional)"
            value={form.email}
            onChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
            placeholder="your.email@example.com"
            keyboardType="email-address"
          />

          <TouchableOpacity
            style={styles.checkboxItem}
            onPress={() => setForm(prev => ({ ...prev, includeSystemInfo: !prev.includeSystemInfo }))}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: muted },
                form.includeSystemInfo && { backgroundColor: primary, borderColor: primary },
              ]}
            >
              {form.includeSystemInfo && (
                <SFSymbol name="checkmark" color="#FFFFFF" size={16} />
              )}
            </View>
            <View style={styles.checkboxText}>
              <ThemedText type="semiBold" style={styles.checkboxTitle}>
                Include system information
              </ThemedText>
              <ThemedText style={[styles.checkboxDescription, { color: muted }]}>
                Help us debug issues by including device and app version info
              </ThemedText>
            </View>
          </TouchableOpacity>
        </Card>

        {/* Guidelines */}
        <Card style={styles.guidelinesCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Feedback Guidelines
          </ThemedText>
          
          <View style={styles.guidelinesList}>
            <View style={styles.guidelineItem}>
              <SFSymbol name="checkmark.circle" color={primary} size={20} />
              <ThemedText style={styles.guidelineText}>
                Be specific and provide clear steps to reproduce issues
              </ThemedText>
            </View>
            
            <View style={styles.guidelineItem}>
              <SFSymbol name="checkmark.circle" color={primary} size={20} />
              <ThemedText style={styles.guidelineText}>
                Include screenshots or examples when possible
              </ThemedText>
            </View>
            
            <View style={styles.guidelineItem}>
              <SFSymbol name="checkmark.circle" color={primary} size={20} />
              <ThemedText style={styles.guidelineText}>
                Keep feedback constructive and respectful
              </ThemedText>
            </View>
            
            <View style={styles.guidelineItem}>
              <SFSymbol name="checkmark.circle" color={primary} size={20} />
              <ThemedText style={styles.guidelineText}>
                Check existing feedback to avoid duplicates
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Button
            title="Send Feedback"
            onPress={handleSubmit}
            loading={isSubmitting}
            style={styles.submitButton}
          />
          
          <ThemedText style={[styles.submitNote, { color: muted }]}>
            We read every piece of feedback and use it to improve the app. 
            Thank you for helping us make Roll20 Reforged better!
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
  typeCard: {
    margin: 20,
    padding: 20,
  },
  formCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  guidelinesCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
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
    minHeight: 120,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxText: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  checkboxDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  guidelinesList: {
    gap: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  guidelineText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  submitContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  submitButton: {
    marginBottom: 16,
  },
  submitNote: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
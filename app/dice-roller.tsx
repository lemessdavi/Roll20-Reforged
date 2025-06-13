import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Vibration, Platform, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useThemeColor } from '@/hooks/useThemeColor';
import { 
  ArrowLeft, 
  Dice1, 
  Dice2, 
  Dice3, 
  Dice4, 
  Dice5, 
  Dice6, 
  Plus, 
  Minus, 
  RotateCcw, 
  History, 
  Zap,
  TrendingUp,
  TrendingDown,
  Calculator
} from 'lucide-react-native';
import { rollFromExpression, rollAdvantage, rollDisadvantage, DiceResult } from '@/utils/dice';

interface QuickRoll {
  id: string;
  name: string;
  expression: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function DiceRollerScreen() {
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');
  const danger = useThemeColor({}, 'danger');
  const surface = useThemeColor({}, 'surface');

  const [customExpression, setCustomExpression] = useState('');
  const [rollHistory, setRollHistory] = useState<(DiceResult & { timestamp: Date })[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<DiceResult | null>(null);

  const rollAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const quickRolls: QuickRoll[] = [
    {
      id: 'd20',
      name: 'D20',
      expression: '1d20',
      description: 'Standard ability check',
      icon: <Dice6 color="#FFFFFF" size={24} />,
      color: primary,
    },
    {
      id: 'advantage',
      name: 'Advantage',
      expression: 'advantage',
      description: 'Roll 2d20, take highest',
      icon: <TrendingUp color="#FFFFFF" size={24} />,
      color: success,
    },
    {
      id: 'disadvantage',
      name: 'Disadvantage',
      expression: 'disadvantage',
      description: 'Roll 2d20, take lowest',
      icon: <TrendingDown color="#FFFFFF" size={24} />,
      color: danger,
    },
    {
      id: 'd6',
      name: 'D6',
      expression: '1d6',
      description: 'Basic damage die',
      icon: <Dice6 color="#FFFFFF" size={24} />,
      color: warning,
    },
    {
      id: 'd8',
      name: 'D8',
      expression: '1d8',
      description: 'Longsword damage',
      icon: <Dice2 color="#FFFFFF" size={24} />,
      color: '#8B5CF6',
    },
    {
      id: 'd10',
      name: 'D10',
      expression: '1d10',
      description: 'Heavy crossbow damage',
      icon: <Dice3 color="#FFFFFF" size={24} />,
      color: '#06B6D4',
    },
    {
      id: 'd12',
      name: 'D12',
      expression: '1d12',
      description: 'Greataxe damage',
      icon: <Dice4 color="#FFFFFF" size={24} />,
      color: '#F59E0B',
    },
    {
      id: 'fireball',
      name: 'Fireball',
      expression: '8d6',
      description: 'Classic spell damage',
      icon: <Zap color="#FFFFFF" size={24} />,
      color: '#EF4444',
    },
  ];

  const performRoll = (expression: string, customName?: string) => {
    let result: DiceResult | null = null;

    if (expression === 'advantage') {
      result = rollAdvantage();
    } else if (expression === 'disadvantage') {
      result = rollDisadvantage();
    } else {
      result = rollFromExpression(expression);
    }

    if (!result) {
      console.log('Invalid roll expression:', expression);
      return;
    }

    setLastRoll(result);
    setRollHistory(prev => [
      { ...result, timestamp: new Date() },
      ...prev.slice(0, 19)
    ]);

    // Trigger haptic feedback
    if (Platform.OS !== 'web') {
      Vibration.vibrate(50);
    }

    // Animate the roll
    setIsRolling(true);
    
    Animated.sequence([
      Animated.parallel([
        Animated.timing(rollAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsRolling(false);
      rollAnimation.setValue(0);
    });
  };

  const rollCustomExpression = () => {
    if (!customExpression.trim()) return;
    performRoll(customExpression.trim());
  };

  const clearHistory = () => {
    setRollHistory([]);
    setLastRoll(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getResultColor = (result: DiceResult) => {
    if (result.expression.includes('d20')) {
      const naturalRoll = result.rolls[0];
      if (naturalRoll === 20) return success;
      if (naturalRoll === 1) return danger;
    }
    return primary;
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Advanced Dice Roller',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft color={text} size={24} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={clearHistory}>
              <RotateCcw color={muted} size={20} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Last Roll Result */}
        {lastRoll && (
          <Animated.View 
            style={[
              styles.lastRollContainer,
              {
                transform: [
                  { scale: scaleAnimation },
                  {
                    rotateZ: rollAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <Card style={[styles.lastRollCard, { backgroundColor: getResultColor(lastRoll) }]} variant="elevated">
              <View style={styles.lastRollContent}>
                <View style={styles.lastRollHeader}>
                  <ThemedText style={styles.lastRollExpression}>
                    {lastRoll.expression}
                  </ThemedText>
                  <View style={styles.lastRollBadge}>
                    <Zap color="#FFFFFF" size={16} />
                  </View>
                </View>
                <ThemedText style={styles.lastRollTotal}>
                  {lastRoll.finalTotal}
                </ThemedText>
                <View style={styles.lastRollDetails}>
                  <ThemedText style={styles.lastRollResults}>
                    Individual rolls: {lastRoll.rolls.join(', ')}
                  </ThemedText>
                  {lastRoll.modifier !== 0 && (
                    <ThemedText style={styles.lastRollModifier}>
                      Base total: {lastRoll.total} | Modifier: {lastRoll.modifier > 0 ? '+' : ''}{lastRoll.modifier}
                    </ThemedText>
                  )}
                </View>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Custom Expression Input */}
        <View style={styles.customRollSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Custom Roll</ThemedText>
          <Card style={styles.customRollCard}>
            <View style={styles.customRollContent}>
              <Input
                placeholder="Enter dice expression (e.g., 2d20+5, 3d6-1)"
                value={customExpression}
                onChangeText={setCustomExpression}
                style={styles.customInput}
                containerStyle={styles.customInputContainer}
              />
              <Button
                title="Roll"
                onPress={rollCustomExpression}
                disabled={!customExpression.trim()}
                style={styles.customRollButton}
              />
            </View>
            <View style={styles.exampleContainer}>
              <ThemedText style={[styles.exampleText, { color: muted }]}>
                Examples: 1d20+3, 2d6, 4d8+2, 1d100
              </ThemedText>
            </View>
          </Card>
        </View>

        {/* Quick Rolls */}
        <View style={styles.quickRollsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Rolls</ThemedText>
          <View style={styles.quickRollsGrid}>
            {quickRolls.map((roll) => (
              <TouchableOpacity
                key={roll.id}
                style={[styles.quickRollCard, { backgroundColor: roll.color }]}
                onPress={() => performRoll(roll.expression)}
              >
                <View style={styles.quickRollIcon}>
                  {roll.icon}
                </View>
                <ThemedText style={styles.quickRollName}>
                  {roll.name}
                </ThemedText>
                <ThemedText style={styles.quickRollExpression}>
                  {roll.expression}
                </ThemedText>
                <ThemedText style={styles.quickRollDescription}>
                  {roll.description}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Roll History */}
        {rollHistory.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <History color={muted} size={20} />
              <ThemedText type="subtitle" style={styles.sectionTitle}>Roll History</ThemedText>
            </View>
            
            <View style={styles.historyList}>
              {rollHistory.slice(0, 15).map((roll, index) => (
                <Card key={`${roll.timestamp.getTime()}-${index}`} style={styles.historyCard}>
                  <View style={styles.historyRow}>
                    <View style={styles.historyInfo}>
                      <ThemedText type="semiBold" style={styles.historyExpression}>
                        {roll.expression}
                      </ThemedText>
                      <ThemedText style={[styles.historyTime, { color: muted }]}>
                        {formatTime(roll.timestamp)}
                      </ThemedText>
                      <ThemedText style={[styles.historyRolls, { color: muted }]}>
                        Rolls: [{roll.rolls.join(', ')}]
                      </ThemedText>
                    </View>
                    <View style={styles.historyResult}>
                      <ThemedText type="semiBold" style={[styles.historyTotal, { color: getResultColor(roll) }]}>
                        {roll.finalTotal}
                      </ThemedText>
                      {roll.modifier !== 0 && (
                        <ThemedText style={[styles.historyModifier, { color: muted }]}>
                          ({roll.total}{roll.modifier > 0 ? '+' : ''}{roll.modifier})
                        </ThemedText>
                      )}
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        )}

        {/* Dice Reference */}
        <View style={styles.referenceSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Dice Reference</ThemedText>
          <Card style={styles.referenceCard}>
            <View style={styles.referenceContent}>
              <ThemedText style={[styles.referenceTitle, { color: primary }]}>
                Common Expressions
              </ThemedText>
              <View style={styles.referenceList}>
                <View style={styles.referenceItem}>
                  <ThemedText style={styles.referenceExpression}>1d20+5</ThemedText>
                  <ThemedText style={[styles.referenceDescription, { color: muted }]}>
                    Ability check with +5 modifier
                  </ThemedText>
                </View>
                <View style={styles.referenceItem}>
                  <ThemedText style={styles.referenceExpression}>2d6+3</ThemedText>
                  <ThemedText style={[styles.referenceDescription, { color: muted }]}>
                    Shortsword damage with +3 STR
                  </ThemedText>
                </View>
                <View style={styles.referenceItem}>
                  <ThemedText style={styles.referenceExpression}>8d6</ThemedText>
                  <ThemedText style={[styles.referenceDescription, { color: muted }]}>
                    Fireball spell damage
                  </ThemedText>
                </View>
                <View style={styles.referenceItem}>
                  <ThemedText style={styles.referenceExpression}>4d6</ThemedText>
                  <ThemedText style={[styles.referenceDescription, { color: muted }]}>
                    Character ability score generation
                  </ThemedText>
                </View>
              </View>
            </View>
          </Card>
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
  lastRollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
  },
  lastRollCard: {
    padding: 24,
  },
  lastRollContent: {
    alignItems: 'center',
  },
  lastRollHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  lastRollExpression: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginRight: 8,
  },
  lastRollBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastRollTotal: {
    color: '#FFFFFF',
    fontSize: 56,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  lastRollDetails: {
    alignItems: 'center',
    gap: 4,
  },
  lastRollResults: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  lastRollModifier: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  customRollSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  customRollCard: {
    padding: 20,
  },
  customRollContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  customInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  customInput: {
    fontSize: 16,
  },
  customRollButton: {
    minWidth: 80,
  },
  exampleContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  exampleText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  quickRollsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  quickRollsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickRollCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  quickRollIcon: {
    marginBottom: 8,
  },
  quickRollName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  quickRollExpression: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  quickRollDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  historySection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  historyList: {
    gap: 8,
  },
  historyCard: {
    padding: 16,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  historyInfo: {
    flex: 1,
    marginRight: 16,
  },
  historyExpression: {
    fontSize: 16,
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 12,
    marginBottom: 2,
  },
  historyRolls: {
    fontSize: 12,
  },
  historyResult: {
    alignItems: 'flex-end',
  },
  historyTotal: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  historyModifier: {
    fontSize: 12,
  },
  referenceSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  referenceCard: {
    padding: 20,
  },
  referenceContent: {
    gap: 16,
  },
  referenceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  referenceList: {
    gap: 12,
  },
  referenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referenceExpression: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontFamily: 'monospace',
  },
  referenceDescription: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
});
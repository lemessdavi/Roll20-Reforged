import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Vibration, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Plus, Minus, RotateCcw, History, Zap } from 'lucide-react-native';

interface DiceRoll {
  id: string;
  expression: string;
  result: number[];
  total: number;
  modifier: number;
  timestamp: Date;
}

interface DiceConfig {
  sides: number;
  count: number;
  modifier: number;
}

const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100];

export default function DiceScreen() {
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');
  const surface = useThemeColor({}, 'surface');

  const [diceConfigs, setDiceConfigs] = useState<Record<number, DiceConfig>>({
    4: { sides: 4, count: 1, modifier: 0 },
    6: { sides: 6, count: 1, modifier: 0 },
    8: { sides: 8, count: 1, modifier: 0 },
    10: { sides: 10, count: 1, modifier: 0 },
    12: { sides: 12, count: 1, modifier: 0 },
    20: { sides: 20, count: 1, modifier: 0 },
    100: { sides: 100, count: 1, modifier: 0 },
  });

  const [rollHistory, setRollHistory] = useState<DiceRoll[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<DiceRoll | null>(null);

  const rollAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const rollDice = (sides: number, count: number): number[] => {
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(Math.floor(Math.random() * sides) + 1);
    }
    return results;
  };

  const updateDiceConfig = (sides: number, field: keyof DiceConfig, value: number) => {
    setDiceConfigs(prev => ({
      ...prev,
      [sides]: {
        ...prev[sides],
        [field]: Math.max(field === 'count' ? 1 : (field === 'modifier' ? -99 : 1), 
                         Math.min(field === 'count' ? 20 : (field === 'modifier' ? 99 : sides), value))
      }
    }));
  };

  const performRoll = (sides: number) => {
    const config = diceConfigs[sides];
    const results = rollDice(config.sides, config.count);
    const total = results.reduce((sum, roll) => sum + roll, 0) + config.modifier;
    
    const roll: DiceRoll = {
      id: Date.now().toString(),
      expression: `${config.count}d${config.sides}${config.modifier !== 0 ? (config.modifier > 0 ? `+${config.modifier}` : config.modifier) : ''}`,
      result: results,
      total,
      modifier: config.modifier,
      timestamp: new Date(),
    };

    setLastRoll(roll);
    setRollHistory(prev => [roll, ...prev.slice(0, 19)]); // Keep last 20 rolls
    
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

  const rollAll = () => {
    const activeDice = DICE_TYPES.filter(sides => diceConfigs[sides].count > 0);
    if (activeDice.length === 0) return;

    let totalResult = 0;
    let totalModifier = 0;
    let allResults: number[] = [];
    let expression = '';

    activeDice.forEach((sides, index) => {
      const config = diceConfigs[sides];
      const results = rollDice(config.sides, config.count);
      const subtotal = results.reduce((sum, roll) => sum + roll, 0);
      
      totalResult += subtotal;
      totalModifier += config.modifier;
      allResults = [...allResults, ...results];
      
      if (index > 0) expression += ' + ';
      expression += `${config.count}d${config.sides}`;
      if (config.modifier !== 0) {
        expression += config.modifier > 0 ? `+${config.modifier}` : config.modifier;
      }
    });

    const roll: DiceRoll = {
      id: Date.now().toString(),
      expression,
      result: allResults,
      total: totalResult + totalModifier,
      modifier: totalModifier,
      timestamp: new Date(),
    };

    setLastRoll(roll);
    setRollHistory(prev => [roll, ...prev.slice(0, 19)]);
    
    if (Platform.OS !== 'web') {
      Vibration.vibrate([50, 50, 50]);
    }
  };

  const clearAll = () => {
    setDiceConfigs(prev => {
      const newConfigs = { ...prev };
      DICE_TYPES.forEach(sides => {
        newConfigs[sides] = { ...newConfigs[sides], count: 1, modifier: 0 };
      });
      return newConfigs;
    });
    setLastRoll(null);
  };

  const getDiceIcon = (sides: number, size: number = 24) => {
    const iconProps = { size, color: primary };
    switch (sides) {
      case 4: return <Dice1 {...iconProps} />;
      case 6: return <Dice6 {...iconProps} />;
      case 8: return <Dice2 {...iconProps} />;
      case 10: return <Dice3 {...iconProps} />;
      case 12: return <Dice4 {...iconProps} />;
      case 20: return <Dice5 {...iconProps} />;
      case 100: return <Dice6 {...iconProps} />;
      default: return <Dice6 {...iconProps} />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="title" style={styles.title}>Dice Roller</ThemedText>
            <ThemedText style={[styles.subtitle, { color: muted }]}>
              Roll the dice for your adventures
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={[styles.clearButton, { backgroundColor: `${warning}20` }]}
            onPress={clearAll}
          >
            <RotateCcw color={warning} size={20} />
          </TouchableOpacity>
        </View>

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
            <Card style={[styles.lastRollCard, { backgroundColor: primary }]} variant="elevated">
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
                  {lastRoll.total}
                </ThemedText>
                <View style={styles.lastRollDetails}>
                  <ThemedText style={styles.lastRollResults}>
                    Rolls: {lastRoll.result.join(', ')}
                    {lastRoll.modifier !== 0 && ` (${lastRoll.modifier > 0 ? '+' : ''}${lastRoll.modifier})`}
                  </ThemedText>
                </View>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Dice Configuration */}
        <View style={styles.diceContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Configure Dice</ThemedText>
          
          <View style={styles.diceGrid}>
            {DICE_TYPES.map((sides) => {
              const config = diceConfigs[sides];
              return (
                <Card key={sides} style={styles.diceCard}>
                  <View style={styles.diceHeader}>
                    {getDiceIcon(sides, 28)}
                    <ThemedText type="semiBold" style={styles.diceLabel}>
                      d{sides}
                    </ThemedText>
                  </View>

                  {/* Count Controls */}
                  <View style={styles.controlRow}>
                    <ThemedText style={[styles.controlLabel, { color: muted }]}>Count</ThemedText>
                    <View style={styles.controlButtons}>
                      <TouchableOpacity
                        style={[styles.controlButton, { backgroundColor: surface }]}
                        onPress={() => updateDiceConfig(sides, 'count', config.count - 1)}
                      >
                        <Minus color={muted} size={16} />
                      </TouchableOpacity>
                      <ThemedText style={styles.controlValue}>{config.count}</ThemedText>
                      <TouchableOpacity
                        style={[styles.controlButton, { backgroundColor: surface }]}
                        onPress={() => updateDiceConfig(sides, 'count', config.count + 1)}
                      >
                        <Plus color={muted} size={16} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Modifier Controls */}
                  <View style={styles.controlRow}>
                    <ThemedText style={[styles.controlLabel, { color: muted }]}>Modifier</ThemedText>
                    <View style={styles.controlButtons}>
                      <TouchableOpacity
                        style={[styles.controlButton, { backgroundColor: surface }]}
                        onPress={() => updateDiceConfig(sides, 'modifier', config.modifier - 1)}
                      >
                        <Minus color={muted} size={16} />
                      </TouchableOpacity>
                      <ThemedText style={styles.controlValue}>
                        {config.modifier > 0 ? `+${config.modifier}` : config.modifier}
                      </ThemedText>
                      <TouchableOpacity
                        style={[styles.controlButton, { backgroundColor: surface }]}
                        onPress={() => updateDiceConfig(sides, 'modifier', config.modifier + 1)}
                      >
                        <Plus color={muted} size={16} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Roll Button */}
                  <Button
                    title="Roll"
                    onPress={() => performRoll(sides)}
                    size="small"
                    style={styles.rollButton}
                    disabled={config.count === 0}
                  />
                </Card>
              );
            })}
          </View>

          {/* Roll All Button */}
          <Button
            title="Roll All Dice"
            onPress={rollAll}
            size="large"
            style={styles.rollAllButton}
          />
        </View>

        {/* Roll History */}
        {rollHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <History color={muted} size={20} />
              <ThemedText type="subtitle" style={styles.sectionTitle}>Roll History</ThemedText>
            </View>
            
            <View style={styles.historyList}>
              {rollHistory.slice(0, 10).map((roll) => (
                <Card key={roll.id} style={styles.historyCard}>
                  <View style={styles.historyRow}>
                    <View style={styles.historyInfo}>
                      <ThemedText type="semiBold" style={styles.historyExpression}>
                        {roll.expression}
                      </ThemedText>
                      <ThemedText style={[styles.historyTime, { color: muted }]}>
                        {formatTime(roll.timestamp)}
                      </ThemedText>
                    </View>
                    <View style={styles.historyResult}>
                      <ThemedText type="semiBold" style={[styles.historyTotal, { color: primary }]}>
                        {roll.total}
                      </ThemedText>
                      <ThemedText style={[styles.historyRolls, { color: muted }]}>
                        [{roll.result.join(', ')}]
                      </ThemedText>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
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
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastRollContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  lastRollCard: {
    padding: 20,
  },
  lastRollContent: {
    alignItems: 'center',
  },
  lastRollHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  lastRollExpression: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginRight: 8,
  },
  lastRollBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastRollTotal: {
    color: '#FFFFFF',
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  lastRollDetails: {
    alignItems: 'center',
  },
  lastRollResults: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  diceContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  diceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  diceCard: {
    width: '48%',
    padding: 16,
  },
  diceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  diceLabel: {
    fontSize: 18,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  controlLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    minWidth: 32,
    textAlign: 'center',
  },
  rollButton: {
    marginTop: 8,
  },
  rollAllButton: {
    marginTop: 8,
  },
  historyContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
    padding: 12,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyInfo: {
    flex: 1,
  },
  historyExpression: {
    fontSize: 14,
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
  },
  historyResult: {
    alignItems: 'flex-end',
  },
  historyTotal: {
    fontSize: 18,
    marginBottom: 2,
  },
  historyRolls: {
    fontSize: 12,
  },
});
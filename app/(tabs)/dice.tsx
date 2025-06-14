import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useRef, useState } from 'react';
import { Animated, Platform, ScrollView, StyleSheet, TouchableOpacity, Vibration, View } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

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
  const danger = useThemeColor({}, 'danger');
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
    return <SFSymbol name="dice.fill" {...iconProps} />;
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
            <SFSymbol name="arrow.counterclockwise" color={warning} size={20} />
          </TouchableOpacity>
        </View>

        {/* Last Roll Result */}
        {lastRoll && (
          <Animated.View 
            style={{
              ...styles.lastRollContainer,
              transform: [
                { scale: scaleAnimation },
                {
                  rotateZ: rollAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }}
          >
            <Card style={{ ...styles.lastRollCard, backgroundColor: primary }} variant="elevated">
              <View style={styles.lastRollContent}>
                <View style={styles.lastRollHeader}>
                  <ThemedText style={styles.lastRollExpression}>
                    {lastRoll.expression}
                  </ThemedText>
                  <View style={styles.lastRollBadge}>
                    <SFSymbol name="bolt.fill" color="#FFFFFF" size={16} />
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

        {/* Dice Controls */}
        <View style={styles.diceControls}>
          {DICE_TYPES.map((sides) => (
            <Card key={sides} style={styles.diceCard} variant="elevated">
              <View style={styles.diceHeader}>
                {getDiceIcon(sides)}
                <ThemedText type="semiBold" style={styles.diceTitle}>
                  d{sides}
                </ThemedText>
              </View>
              <View style={styles.diceControls}>
                <TouchableOpacity
                  style={[styles.controlButton, { backgroundColor: `${primary}20` }]}
                  onPress={() => updateDiceConfig(sides, 'count', diceConfigs[sides].count - 1)}
                >
                  <SFSymbol name="minus" color={primary} size={20} />
                </TouchableOpacity>
                <ThemedText style={styles.controlValue}>
                  {diceConfigs[sides].count}
                </ThemedText>
                <TouchableOpacity
                  style={[styles.controlButton, { backgroundColor: `${primary}20` }]}
                  onPress={() => updateDiceConfig(sides, 'count', diceConfigs[sides].count + 1)}
                >
                  <SFSymbol name="plus" color={primary} size={20} />
                </TouchableOpacity>
              </View>
              <View style={styles.modifierControls}>
                <TouchableOpacity
                  style={[styles.controlButton, { backgroundColor: `${primary}20` }]}
                  onPress={() => updateDiceConfig(sides, 'modifier', diceConfigs[sides].modifier - 1)}
                >
                  <SFSymbol name="minus" color={primary} size={20} />
                </TouchableOpacity>
                <ThemedText style={styles.modifierValue}>
                  {diceConfigs[sides].modifier > 0 ? `+${diceConfigs[sides].modifier}` : diceConfigs[sides].modifier}
                </ThemedText>
                <TouchableOpacity
                  style={[styles.controlButton, { backgroundColor: `${primary}20` }]}
                  onPress={() => updateDiceConfig(sides, 'modifier', diceConfigs[sides].modifier + 1)}
                >
                  <SFSymbol name="plus" color={primary} size={20} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.rollButton, { backgroundColor: primary }]}
                onPress={() => performRoll(sides)}
              >
                <SFSymbol name="dice.fill" color="#FFFFFF" size={20} />
                <ThemedText style={styles.rollButtonText}>Roll</ThemedText>
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        {/* Roll All Button */}
        <TouchableOpacity
          style={[styles.rollAllButton, { backgroundColor: success }]}
          onPress={rollAll}
        >
          <SFSymbol name="dice.fill" color="#FFFFFF" size={24} />
          <ThemedText style={styles.rollAllButtonText}>Roll All</ThemedText>
        </TouchableOpacity>

        {/* Roll History */}
        <Card style={styles.historyCard} variant="elevated">
          <View style={styles.historyHeader}>
            <View style={styles.historyTitleContainer}>
              <ThemedText type="semiBold" style={styles.historyTitle}>
                Roll History
              </ThemedText>
              <SFSymbol name="clock" color={muted} size={20} />
            </View>
            {rollHistory.length > 0 && (
              <TouchableOpacity onPress={() => setRollHistory([])}>
                <SFSymbol name="trash" color={danger} size={20} />
              </TouchableOpacity>
            )}
          </View>
          {rollHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <SFSymbol name="dice" color={muted} size={32} />
              <ThemedText style={[styles.emptyHistoryText, { color: muted }]}>
                No rolls yet
              </ThemedText>
            </View>
          ) : (
            <ScrollView style={styles.historyList}>
              {rollHistory.map((roll) => (
                <View key={roll.id} style={styles.historyItem}>
                  <View style={styles.historyItemContent}>
                    <ThemedText style={styles.historyExpression}>
                      {roll.expression}
                    </ThemedText>
                    <ThemedText style={styles.historyTime}>
                      {formatTime(roll.timestamp)}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.historyTotal}>
                    {roll.total}
                  </ThemedText>
                </View>
              ))}
            </ScrollView>
          )}
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
  diceControls: {
    paddingHorizontal: 20,
    marginBottom: 32,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  diceCard: {
    width: '48%',
    padding: 16,
    marginBottom: 16,
  },
  diceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  diceTitle: {
    fontSize: 18,
  },
  diceControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  modifierControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modifierValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    minWidth: 32,
    textAlign: 'center',
  },
  rollButton: {
    marginTop: 8,
  },
  rollButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  rollAllButton: {
    marginTop: 8,
  },
  rollAllButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  historyCard: {
    padding: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  historyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyTitle: {
    fontSize: 18,
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyItemContent: {
    flex: 1,
  },
  historyExpression: {
    fontSize: 14,
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
  },
  historyTotal: {
    fontSize: 18,
    marginBottom: 2,
  },
  emptyHistory: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 16,
  },
});
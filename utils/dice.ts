export interface DiceResult {
  rolls: number[];
  total: number;
  modifier: number;
  finalTotal: number;
  expression: string;
}

export interface DiceConfig {
  sides: number;
  count: number;
  modifier: number;
}

export function rollDice(sides: number, count: number = 1): number[] {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(Math.floor(Math.random() * sides) + 1);
  }
  return results;
}

export function rollDiceWithModifier(config: DiceConfig): DiceResult {
  const rolls = rollDice(config.sides, config.count);
  const total = rolls.reduce((sum, roll) => sum + roll, 0);
  const finalTotal = total + config.modifier;
  
  const expression = `${config.count}d${config.sides}${
    config.modifier !== 0 
      ? (config.modifier > 0 ? `+${config.modifier}` : config.modifier)
      : ''
  }`;

  return {
    rolls,
    total,
    modifier: config.modifier,
    finalTotal,
    expression,
  };
}

export function parseRollExpression(expression: string): DiceConfig | null {
  // Parse expressions like "2d20+5", "1d6", "3d8-2"
  const regex = /^(\d+)d(\d+)([+-]\d+)?$/i;
  const match = expression.trim().match(regex);
  
  if (!match) return null;
  
  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;
  
  return { count, sides, modifier };
}

export function rollFromExpression(expression: string): DiceResult | null {
  const config = parseRollExpression(expression);
  if (!config) return null;
  
  return rollDiceWithModifier(config);
}

// Common D&D dice rolls
export const COMMON_ROLLS = {
  d4: { sides: 4, count: 1, modifier: 0 },
  d6: { sides: 6, count: 1, modifier: 0 },
  d8: { sides: 8, count: 1, modifier: 0 },
  d10: { sides: 10, count: 1, modifier: 0 },
  d12: { sides: 12, count: 1, modifier: 0 },
  d20: { sides: 20, count: 1, modifier: 0 },
  d100: { sides: 100, count: 1, modifier: 0 },
  
  // Common ability checks
  advantage: { sides: 20, count: 2, modifier: 0 }, // Roll 2d20, take highest
  disadvantage: { sides: 20, count: 2, modifier: 0 }, // Roll 2d20, take lowest
  
  // Common damage rolls
  shortSword: { sides: 6, count: 1, modifier: 0 },
  longSword: { sides: 8, count: 1, modifier: 0 },
  greatSword: { sides: 6, count: 2, modifier: 0 },
  fireball: { sides: 6, count: 8, modifier: 0 },
};

export function rollAdvantage(): DiceResult {
  const rolls = rollDice(20, 2);
  const highest = Math.max(...rolls);
  
  return {
    rolls,
    total: highest,
    modifier: 0,
    finalTotal: highest,
    expression: '2d20 (Advantage)',
  };
}

export function rollDisadvantage(): DiceResult {
  const rolls = rollDice(20, 2);
  const lowest = Math.min(...rolls);
  
  return {
    rolls,
    total: lowest,
    modifier: 0,
    finalTotal: lowest,
    expression: '2d20 (Disadvantage)',
  };
}

export function getAbilityModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function rollAbilityCheck(abilityScore: number, proficiencyBonus: number = 0, isProficient: boolean = false): DiceResult {
  const modifier = getAbilityModifier(abilityScore) + (isProficient ? proficiencyBonus : 0);
  const config: DiceConfig = { sides: 20, count: 1, modifier };
  
  return rollDiceWithModifier(config);
}

export function rollSavingThrow(abilityScore: number, proficiencyBonus: number = 0, isProficient: boolean = false): DiceResult {
  return rollAbilityCheck(abilityScore, proficiencyBonus, isProficient);
}

export function rollAttack(attackBonus: number): DiceResult {
  const config: DiceConfig = { sides: 20, count: 1, modifier: attackBonus };
  return rollDiceWithModifier(config);
}

export function rollDamage(damageDice: string, damageModifier: number = 0): DiceResult | null {
  const config = parseRollExpression(`${damageDice}${damageModifier !== 0 ? (damageModifier > 0 ? `+${damageModifier}` : damageModifier) : ''}`);
  if (!config) return null;
  
  return rollDiceWithModifier(config);
}

export function rollInitiative(dexterityModifier: number): DiceResult {
  const config: DiceConfig = { sides: 20, count: 1, modifier: dexterityModifier };
  return rollDiceWithModifier(config);
}

// Utility function to validate dice configuration
export function isValidDiceConfig(config: DiceConfig): boolean {
  return (
    config.count > 0 && 
    config.count <= 100 && 
    config.sides > 0 && 
    config.sides <= 1000 &&
    config.modifier >= -999 &&
    config.modifier <= 999
  );
}

// Generate random character stats using 4d6 drop lowest
export function rollCharacterStats(): number[] {
  const stats = [];
  for (let i = 0; i < 6; i++) {
    const rolls = rollDice(6, 4);
    rolls.sort((a, b) => b - a); // Sort descending
    const total = rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0); // Take top 3
    stats.push(total);
  }
  return stats;
}
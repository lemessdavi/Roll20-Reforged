export interface Character {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  background: string;
  alignment: string;
  experiencePoints: number;
  hitPoints: {
    current: number;
    maximum: number;
    temporary: number;
  };
  armorClass: number;
  speed: number;
  proficiencyBonus: number;
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  savingThrows: {
    strength: boolean;
    dexterity: boolean;
    constitution: boolean;
    intelligence: boolean;
    wisdom: boolean;
    charisma: boolean;
  };
  skills: {
    [key: string]: boolean;
  };
  equipment: Equipment[];
  spells: Spell[];
  notes: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'tool' | 'item';
  quantity: number;
  weight: number;
  description: string;
  equipped: boolean;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  prepared: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  gameSystem: string;
  dmId: string;
  players: string[];
  characters: string[];
  sessions: Session[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  campaignId: string;
  name: string;
  date: Date;
  duration: number;
  notes: string;
  participants: string[];
}

export interface DiceRoll {
  id: string;
  type: string;
  result: number;
  modifier: number;
  total: number;
  timestamp: Date;
  characterId?: string;
  description?: string;
}
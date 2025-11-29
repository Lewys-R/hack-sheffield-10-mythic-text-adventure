export type EntityKey = 
  | 'goblin' 
  | 'wizard' 
  | 'mercenary' 
  | 'mage' 
  | 'witch' 
  | 'troll'
  | 'meatball'
  | null;

export interface AgentConfig {
  name: string;
  instructions: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  entity?: EntityKey; // Who is speaking (if assistant)
  timestamp: number;
}

export interface GameState {
  currentEntity: EntityKey;
  history: Message[];
  isLoading: boolean;
}

export interface TurnResponse {
  text: string;
  newEntity: EntityKey;
}
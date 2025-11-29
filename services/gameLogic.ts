import { 
  SCENE_AGENT, 
  ENTITY_AGENTS, 
  CLASSIFIER_INSTRUCTIONS, 
  ENTITY_SELECTOR_INSTRUCTIONS, 
  LEAVE_CONVERSATION_KEYWORDS, 
  parseEntityKey 
} from '../constants';
import { EntityKey, TurnResponse, Message } from '../types';
import { runAgent, runClassifier, runEntitySelector } from './geminiService';

/**
 * Formats the chat history into a string for context.
 * We only take the last few turns to keep the prompt focused and save tokens.
 */
const formatHistory = (history: Message[]): string => {
  // Take last 6 messages
  const recent = history.slice(-6);
  return recent.map(msg => `${msg.role === 'user' ? 'Player' : 'Game'}: ${msg.text}`).join('\n');
};

/**
 * Main game loop logic, mirroring the Python `handle_turn` function.
 */
export async function handleTurn(
  userInput: string,
  currentEntity: EntityKey,
  history: Message[]
): Promise<TurnResponse> {

  const text = userInput.trim();
  const lower = text.toLowerCase();
  const historyContext = formatHistory(history);

  // === 1. Already in a conversation ===
  if (currentEntity !== null) {

    // Check for exit keywords
    if (LEAVE_CONVERSATION_KEYWORDS.has(lower)) {
      const sceneInput = "The player ends the conversation and returns to the world. " + userInput;
      const responseText = await runAgent(SCENE_AGENT, sceneInput, historyContext);

      return {
        text: responseText,
        newEntity: null
      };
    }

    // Continue conversation with current entity
    const agent = ENTITY_AGENTS[currentEntity];
    // Fallback to scene agent if entity config missing (safety)
    const targetAgent = agent || SCENE_AGENT;

    const responseText = await runAgent(targetAgent, userInput, historyContext);

    return {
      text: responseText,
      newEntity: currentEntity
    };
  }

  // === 2. No active conversation: Classify Scene vs Conversation ===
  const decision = await runClassifier(userInput, CLASSIFIER_INSTRUCTIONS);

  if (decision === 'scene') {
    const responseText = await runAgent(SCENE_AGENT, userInput, historyContext);
    return {
      text: responseText,
      newEntity: null
    };
  }

  // === 3. Conversation Request: Pick who to talk to ===
  const entityKeyRaw = await runEntitySelector(userInput, ENTITY_SELECTOR_INSTRUCTIONS);
  const entityKey = parseEntityKey(entityKeyRaw);

  // Removed redundant check for 'none' as it's not in EntityKey type
  if (entityKey && ENTITY_AGENTS[entityKey]) {
    // Found a valid entity to start talking to
    const agent = ENTITY_AGENTS[entityKey];
    const responseText = await runAgent(agent, userInput, historyContext);
    return {
      text: responseText,
      newEntity: entityKey
    };
  } else {
    // Couldn't tell who -> treat as scene
    const responseText = await runAgent(SCENE_AGENT, userInput, historyContext);
    return {
      text: responseText,
      newEntity: null
    };
  }
}
import { GoogleGenAI } from "@google/genai";
import { AgentConfig } from "../types";

// Initialize Gemini
// NOTE: Relying on process.env.API_KEY as per strict requirements.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Runs a generic prompt against a specific agent instruction.
 */
export async function runAgent(
  agent: AgentConfig, 
  userInput: string, 
  historyContext: string
): Promise<string> {
  
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `
        Context of previous events:
        ${historyContext}

        Current User Input: ${userInput}
      `,
      config: {
        systemInstruction: agent.instructions,
        temperature: 0.7, // Creativity for flavor
      }
    });

    return response.text || "...";
  } catch (error) {
    console.error("Gemini Agent Error:", error);
    return "The spirits are silent. (API Error)";
  }
}

/**
 * Runs the classifier agent (Scene vs Conversation).
 */
export async function runClassifier(userInput: string, instructions: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userInput,
      config: {
        systemInstruction: instructions,
        temperature: 0.1, // Low temp for deterministic classification
        maxOutputTokens: 10,
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for short responses
      }
    });
    return response.text?.trim().toLowerCase() || "scene";
  } catch (error) {
    console.error("Gemini Classifier Error:", error);
    return "scene"; // Default safe fallback
  }
}

/**
 * Runs the entity selector agent.
 */
export async function runEntitySelector(userInput: string, instructions: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userInput,
      config: {
        systemInstruction: instructions,
        temperature: 0.1,
        maxOutputTokens: 20,
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for short responses
      }
    });
    return response.text?.trim().toLowerCase() || "none";
  } catch (error) {
    console.error("Gemini Entity Selector Error:", error);
    return "none";
  }
}
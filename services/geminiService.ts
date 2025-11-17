import { GoogleGenAI, Type } from "@google/genai";
import { StorySegment } from '../types';
import { ART_STYLE } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storyResponseSchema = {
  type: Type.OBJECT,
  properties: {
    story: {
      type: Type.STRING,
      description: "The next paragraph of the story. Should be engaging and descriptive, about 100-150 words.",
    },
    imagePrompt: {
      type: Type.STRING,
      description: "A detailed, dynamic, and visually rich prompt for an image generator that captures the current scene. Describe characters and environments with consistent details.",
    },
    choices: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 3 distinct, compelling choices for the player to make next. Each choice should lead to a different outcome.",
    },
    inventory: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of strings representing the player's current inventory. Update this based on the story's events.",
    },
    quest: {
      type: Type.STRING,
      description: "A brief description of the player's current main quest or objective. Update this as the story progresses.",
    },
  },
  required: ["story", "imagePrompt", "choices", "inventory", "quest"],
};

export const generateStorySegment = async (
  storyHistory: string[],
  playerChoice: string
): Promise<StorySegment> => {
  try {
    const prompt = `
      Continue the story based on the player's last choice.
      Here is the story so far:
      ---
      ${storyHistory.join("\n\n")}
      ---
      The player chose to: "${playerChoice}"

      Generate the next part of the story with new choices, and update the inventory and quest based on the events. Ensure the story is continuous and the new state is a logical progression.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: storyResponseSchema,
      },
    });

    const jsonText = response.text.trim();
    // Sometimes the response might be wrapped in markdown, clean it.
    const cleanedJson = jsonText.replace(/^```json\n?/, '').replace(/```$/, '');
    return JSON.parse(cleanedJson) as StorySegment;
  } catch (error) {
    console.error("Error generating story segment:", error);
    // Provide a fallback story segment in case of an API error to prevent the game from crashing
    return {
      story: "An unexpected magical vortex swirls before you, momentarily disrupting reality. When it clears, you find yourself back on a familiar path, a sense of deja vu washing over you. What will you do?",
      imagePrompt: "A swirling vortex of purple and blue magical energy in a fantasy forest, with a confused adventurer looking on.",
      choices: ["Look for clues about the vortex.", "Ignore it and continue on my path.", "Try to cast a simple spell at the spot."],
      inventory: ["Worn Map"],
      quest: "Investigate the mysterious magical disturbance.",
    };
  }
};


export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const fullPrompt = `${ART_STYLE} ${prompt}`;
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });
    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating image:", error);
    // Return a placeholder image URL
    return `https://picsum.photos/1280/720?random=${Math.random()}`;
  }
};

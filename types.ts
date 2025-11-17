export interface StorySegment {
  story: string;
  imagePrompt: string;
  choices: string[];
  inventory: string[];
  quest: string;
}

export interface GameState extends StorySegment {
  imageUrl: string;
  storyHistory: string[];
}

export interface LoadingState {
  story: boolean;
  image: boolean;
}

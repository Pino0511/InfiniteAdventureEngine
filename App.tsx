import React, { useState, useEffect, useCallback } from 'react';
import { GameState, LoadingState } from './types';
import { generateStorySegment, generateImage } from './services/geminiService';
import { INITIAL_PROMPT } from './constants';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    story: '',
    imageUrl: '',
    imagePrompt: '',
    choices: [],
    inventory: [],
    quest: '',
    storyHistory: [],
  });

  const [loading, setLoading] = useState<LoadingState>({
    story: true,
    image: true,
  });

  const getNextStep = useCallback(async (playerChoice: string, currentHistory: string[]) => {
    setLoading({ story: true, image: true });

    const storyData = await generateStorySegment(currentHistory, playerChoice);

    setGameState(prev => ({
      ...prev,
      ...storyData,
      storyHistory: [...currentHistory, prev.story], // Add previous story paragraph to history
    }));
    setLoading(prev => ({ ...prev, story: false }));

    const newImageUrl = await generateImage(storyData.imagePrompt);
    setGameState(prev => ({ ...prev, imageUrl: newImageUrl }));
    setLoading(prev => ({ ...prev, image: false }));
  }, []);

  useEffect(() => {
    // Initial load
    getNextStep(INITIAL_PROMPT, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleChoice = (choice: string) => {
    if (loading.story || loading.image) return;
    // We pass gameState.story to be added to history, so the history is always one step behind the current text
    const historyToPass = gameState.story ? [...gameState.storyHistory, gameState.story] : gameState.storyHistory;
    getNextStep(choice, historyToPass);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen" style={{
      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
      backgroundSize: '20px 20px',
    }}>
      <div className="container mx-auto p-4 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-medieval text-indigo-400 drop-shadow-lg">
            Infinite Adventure Engine
          </h1>
          <p className="text-indigo-200/80 mt-2 text-lg">Your story is waiting to be written...</p>
        </header>
        <div className="flex flex-col lg:flex-row gap-8">
          <MainContent
            imageUrl={gameState.imageUrl}
            story={gameState.story}
            choices={gameState.choices}
            loading={loading}
            onChoiceSelected={handleChoice}
          />
          <Sidebar quest={gameState.quest} inventory={gameState.inventory} />
        </div>
      </div>
    </div>
  );
};

export default App;

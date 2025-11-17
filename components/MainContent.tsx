import React from 'react';
import { LoadingState } from '../types';
import LoadingIndicator from './LoadingIndicator';

interface MainContentProps {
  imageUrl: string;
  story: string;
  choices: string[];
  loading: LoadingState;
  onChoiceSelected: (choice: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  imageUrl,
  story,
  choices,
  loading,
  onChoiceSelected,
}) => {
  return (
    <main className="w-full lg:w-3/4 flex flex-col">
      <div className="aspect-video w-full bg-gray-900/80 rounded-lg border border-indigo-900/50 shadow-lg flex items-center justify-center overflow-hidden mb-6">
        {loading.image ? (
          <LoadingIndicator text="Conjuring a vision..." />
        ) : (
          <img src={imageUrl} alt="Current Scene" className="w-full h-full object-cover transition-opacity duration-700 ease-in-out" />
        )}
      </div>

      <div className="flex-grow bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/50 shadow-lg text-gray-200">
        {loading.story ? (
          <div className="h-full flex items-center justify-center">
            <LoadingIndicator text="Weaving the threads of fate..." />
          </div>
        ) : (
          <>
            <p className="text-xl leading-loose mb-8">{story}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => onChoiceSelected(choice)}
                  disabled={loading.story || loading.image}
                  className="w-full font-medieval text-xl text-center text-indigo-200 bg-indigo-900/50 hover:bg-indigo-800/70 border-2 border-indigo-700 rounded-lg px-4 py-3 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {choice}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default MainContent;

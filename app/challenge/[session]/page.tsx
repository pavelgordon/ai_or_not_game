'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { decodeGameSession, getTextsForSession, type GameSession } from '../../utils/gameSession';

interface GameState {
  currentIndex: number;
  score: number;
  feedback: string | null;
  isAnimating: boolean;
  gameEnded: boolean;
  playerName: string;
}

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<GameSession | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentIndex: 0,
    score: 0,
    feedback: null,
    isAnimating: false,
    gameEnded: false,
    playerName: '',
  });
  const [showNameInput, setShowNameInput] = useState(true);

  useEffect(() => {
    if (params.session) {
      const decodedSession = decodeGameSession(params.session as string);
      if (decodedSession) {
        setSession(decodedSession);
      } else {
        router.push('/');
      }
    }
  }, [params.session, router]);

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">Loading challenge...</div>
      </main>
    );
  }

  const texts = getTextsForSession(session);
  const currentText = texts[gameState.currentIndex];

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState.playerName.trim()) {
      setShowNameInput(false);
    }
  };

  const handleGuess = (guessIsAI: boolean) => {
    const isCorrect = guessIsAI === currentText.isAI;
    setGameState(prev => ({
      ...prev,
      feedback: isCorrect ? "Correct! 🎉" : "Oops, wrong answer! 😅",
      score: isCorrect ? prev.score + 1 : prev.score,
      isAnimating: true,
    }));

    setTimeout(() => {
      if (gameState.currentIndex < texts.length - 1) {
        setGameState(prev => ({
          ...prev,
          currentIndex: prev.currentIndex + 1,
          feedback: null,
          isAnimating: false,
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          gameEnded: true,
          isAnimating: false,
        }));
      }
    }, 1500);
  };

  if (showNameInput) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">
            {session.originalPlayer} challenged you!
          </h1>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Enter your name:
              </label>
              <input
                type="text"
                id="name"
                value={gameState.playerName}
                onChange={(e) => setGameState(prev => ({ ...prev, playerName: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
            >
              Start Challenge
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (gameState.gameEnded) {
    const yourScore = gameState.score;
    const theirScore = session.originalScore || 0;
    const youWon = yourScore > theirScore;
    const tie = yourScore === theirScore;

    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-center mb-8">Challenge Complete!</h1>
          
          <div className="space-y-8">
            <div className="flex justify-center items-center gap-8 text-2xl font-bold">
              <div className="text-center">
                <div className="text-lg text-gray-600 dark:text-gray-400">You</div>
                <div>{yourScore}/{texts.length}</div>
              </div>
              <div className="text-4xl">vs</div>
              <div className="text-center">
                <div className="text-lg text-gray-600 dark:text-gray-400">{session.originalPlayer}</div>
                <div>{theirScore}/{texts.length}</div>
              </div>
            </div>

            <div className="text-center text-xl">
              {tie ? (
                <div className="text-yellow-500">It's a tie! 🤝</div>
              ) : youWon ? (
                <div className="text-green-500">You won! 🏆</div>
              ) : (
                <div className="text-blue-500">Better luck next time! 🎯</div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                Back to Home
              </button>
              <button
                onClick={() => {
                  // Reset game state
                  setGameState({
                    currentIndex: 0,
                    score: 0,
                    feedback: null,
                    isAnimating: false,
                    gameEnded: false,
                    playerName: gameState.playerName,
                  });
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="text-xl font-bold">
          Challenge from {session.originalPlayer}
        </div>
        <div className="text-xl font-bold">
          Score: {gameState.score}/{texts.length}
        </div>
      </div>

      <div className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-16 mb-4">
        Question {gameState.currentIndex + 1} of {texts.length}
      </div>
      
      <div className={`transform transition-all duration-500 ${gameState.isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-8 max-w-2xl w-full mx-auto">
          <div className="min-h-[200px] flex items-center justify-center mb-8">
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentText.content}
            </p>
          </div>
          
          {gameState.feedback ? (
            <div className="text-center text-lg sm:text-xl font-bold mb-6 animate-bounce">
              {gameState.feedback}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleGuess(true)}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                AI Generated
              </button>
              <button
                onClick={() => handleGuess(false)}
                className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
              >
                Human Written
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { texts } from '../data/texts';
import { createGameSession, encodeGameSession } from '../utils/gameSession';

type Difficulty = 'easy' | 'medium' | 'hard';

interface GameStats {
  totalAttempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export default function Game() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalAttempts: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    accuracyByDifficulty: {
      easy: 0,
      medium: 0,
      hard: 0
    }
  });

  // Filter texts by current difficulty
  const currentLevelTexts = texts.filter(text => text.difficulty === currentDifficulty);
  const currentText = currentLevelTexts[currentIndex];

  // Calculate progress
  const progress = {
    easy: (currentDifficulty === 'easy' ? currentIndex + 1 : 3),
    medium: (currentDifficulty === 'medium' ? currentIndex + 1 : currentDifficulty === 'hard' ? 3 : 0),
    hard: (currentDifficulty === 'hard' ? currentIndex + 1 : 0),
  };

  const updateStats = (isCorrect: boolean) => {
    setGameStats(prev => {
      const attemptsForDifficulty = texts
        .filter(t => t.difficulty === currentDifficulty)
        .length;
      
      const correctForDifficulty = isCorrect ? 
        (prev.accuracyByDifficulty[currentDifficulty] * attemptsForDifficulty + 1) :
        (prev.accuracyByDifficulty[currentDifficulty] * attemptsForDifficulty);

      return {
        totalAttempts: prev.totalAttempts + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1),
        accuracyByDifficulty: {
          ...prev.accuracyByDifficulty,
          [currentDifficulty]: correctForDifficulty / attemptsForDifficulty
        }
      };
    });
  };

  const handleGuess = (guessIsAI: boolean) => {
    const isCorrect = guessIsAI === currentText.isAI;
    setFeedback(isCorrect ? "Correct! 🎉" : "Oops, wrong answer! 😅");
    if (isCorrect) setScore(score + 1);
    
    updateStats(isCorrect);
    
    setIsAnimating(true);
    setTimeout(() => {
      if (currentIndex < currentLevelTexts.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (currentDifficulty === 'easy') {
        setCurrentDifficulty('medium');
        setCurrentIndex(0);
      } else if (currentDifficulty === 'medium') {
        setCurrentDifficulty('hard');
        setCurrentIndex(0);
      } else {
        // Game completed
        setGameEnded(true);
      }
      setFeedback(null);
      setIsAnimating(false);
    }, 1500);
  };

  const startGame = (difficulty: Difficulty) => {
    setCurrentDifficulty(difficulty);
    setCurrentIndex(0);
    setScore(0);
    setGameStarted(true);
    setGameEnded(false);
    setGameStats({
      totalAttempts: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      accuracyByDifficulty: {
        easy: 0,
        medium: 0,
        hard: 0
      }
    });
  };

  if (gameEnded) {
    const overallAccuracy = (gameStats.correctAnswers / gameStats.totalAttempts) * 100;

    const handleShare = () => {
      setShowNameInput(true);
    };

    const handleNameSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (playerName.trim()) {
        const session = createGameSession(
          currentLevelTexts.map(t => t.id),
          playerName,
          score
        );
        const encoded = encodeGameSession(session);
        const url = `${window.location.origin}/challenge/${encoded}`;
        setShareUrl(url);
        setShowNameInput(false);
      }
    };

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    const shareToTwitter = () => {
      const text = `I scored ${score}/${gameStats.totalAttempts} in AI or Human? Can you beat my score?`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(url, '_blank');
    };
    
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Game Summary</h1>
          
          <div className="space-y-6">
            <div className="text-center text-2xl font-bold mb-4">
              Final Score: {score}/{gameStats.totalAttempts}
            </div>
            
            <div className="space-y-4">
              <div className="text-lg">
                Overall Accuracy: {overallAccuracy.toFixed(1)}%
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Accuracy by Difficulty:</h3>
                <div className="pl-4">
                  <div>Easy: {(gameStats.accuracyByDifficulty.easy * 100).toFixed(1)}%</div>
                  <div>Medium: {(gameStats.accuracyByDifficulty.medium * 100).toFixed(1)}%</div>
                  <div>Hard: {(gameStats.accuracyByDifficulty.hard * 100).toFixed(1)}%</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>Total Correct: {gameStats.correctAnswers}</div>
                <div>Total Incorrect: {gameStats.incorrectAnswers}</div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {!shareUrl && !showNameInput && (
                <button
                  onClick={handleShare}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
                >
                  Challenge Friends
                </button>
              )}

              {showNameInput && (
                <form onSubmit={handleNameSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Enter your name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
                  >
                    Generate Challenge Link
                  </button>
                </form>
              )}

              {shareUrl && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <button
                    onClick={shareToTwitter}
                    className="w-full px-6 py-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transform hover:scale-105 transition-all duration-200"
                  >
                    Share on Twitter
                  </button>
                </div>
              )}

              <div className="flex gap-4 justify-center mt-4">
                <button
                  onClick={() => startGame('easy')}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
                >
                  Play Again
                </button>
                <button
                  onClick={() => {
                    setGameStarted(false);
                    setGameEnded(false);
                    setScore(0);
                    setCurrentIndex(0);
                    setGameStats({
                      totalAttempts: 0,
                      correctAnswers: 0,
                      incorrectAnswers: 0,
                      accuracyByDifficulty: {
                        easy: 0,
                        medium: 0,
                        hard: 0
                      }
                    });
                  }}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transform hover:scale-105 transition-all duration-200"
                >
                  Change Difficulty
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!gameStarted) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Choose Difficulty</h1>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => startGame('easy')}
              className="px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
            >
              Easy
            </button>
            <button
              onClick={() => startGame('medium')}
              className="px-6 py-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transform hover:scale-105 transition-all duration-200"
            >
              Medium
            </button>
            <button
              onClick={() => startGame('hard')}
              className="px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200"
            >
              Hard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div>
          <div className="text-xl font-bold">
            Level: {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Progress: {progress.easy}/3 → {progress.medium}/3 → {progress.hard}/3
          </div>
        </div>
        <div className="text-xl font-bold">
          Score: {score}/{gameStats.totalAttempts}
        </div>
      </div>
      
      <div className={`transform transition-all duration-500 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'} mt-20`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-8 max-w-2xl w-full mx-auto">
          <div className="min-h-[200px] flex items-center justify-center mb-8">
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentText.content}
            </p>
          </div>
          
          {feedback ? (
            <div className="text-center text-xl font-bold mb-6 animate-bounce">
              {feedback}
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
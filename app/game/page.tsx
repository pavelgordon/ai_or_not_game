'use client';

import { useState, useEffect } from 'react';
import { texts } from '../data/texts';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function Game() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('easy');
  const [gameStarted, setGameStarted] = useState(false);

  // Filter texts by current difficulty
  const currentLevelTexts = texts.filter(text => text.difficulty === currentDifficulty);
  const currentText = currentLevelTexts[currentIndex];

  // Calculate progress
  const progress = {
    easy: (currentDifficulty === 'easy' ? currentIndex + 1 : 3),
    medium: (currentDifficulty === 'medium' ? currentIndex + 1 : currentDifficulty === 'hard' ? 3 : 0),
    hard: (currentDifficulty === 'hard' ? currentIndex + 1 : 0),
  };

  const handleGuess = (guessIsAI: boolean) => {
    const isCorrect = guessIsAI === currentText.isAI;
    setFeedback(isCorrect ? "Correct! 🎉" : "Oops, wrong answer! 😅");
    if (isCorrect) setScore(score + 1);
    
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
        setGameStarted(false);
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
  };

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
      <div className="fixed top-4 right-4 text-xl font-bold">
        Score: {score}
      </div>
      
      <div className="fixed top-4 left-4 text-xl font-bold">
        Level: {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}
      </div>

      <div className="fixed top-14 left-4 text-md text-gray-600 dark:text-gray-400">
        Progress: {progress.easy}/3 → {progress.medium}/3 → {progress.hard}/3
      </div>
      
      <div className={`transform transition-all duration-500 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-auto">
          <div className="min-h-[200px] flex items-center justify-center mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentText.content}
            </p>
          </div>
          
          {feedback ? (
            <div className="text-center text-xl font-bold mb-6 animate-bounce">
              {feedback}
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleGuess(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                AI Generated
              </button>
              <button
                onClick={() => handleGuess(false)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
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
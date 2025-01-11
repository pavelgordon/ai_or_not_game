'use client';

import { useState, useEffect } from 'react';
import { texts } from '../data/texts';
import { createGameSession, encodeGameSession } from '../utils/gameSession';
import confetti from 'canvas-confetti';

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

interface QuestionResult {
  text: string;
  isCorrect: boolean;
  userGuess: boolean;
  actualAnswer: boolean;
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
  const [selectedQuestions, setSelectedQuestions] = useState<typeof texts>([]);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(new Set());

  // Get 3 random questions for the current difficulty
  const getRandomQuestions = (difficulty: Difficulty) => {
    const questionsForDifficulty = texts.filter(t => t.difficulty === difficulty);
    
    // If we don't have enough questions for this difficulty level at all
    if (questionsForDifficulty.length < 3) {
      console.warn(`Not enough questions for ${difficulty} difficulty. Only ${questionsForDifficulty.length} available.`);
      return questionsForDifficulty; // Return all available questions
    }

    const availableQuestions = questionsForDifficulty.filter(t => !usedQuestionIds.has(t.id));
    
    // If we don't have enough unused questions, reset the used questions
    if (availableQuestions.length < 3) {
      setUsedQuestionIds(new Set());
      // Use questions from the full pool after reset
      const shuffled = [...questionsForDifficulty].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 3);
      
      // Mark these questions as used
      const newUsedIds = new Set<number>();
      selected.forEach(q => newUsedIds.add(q.id));
      setUsedQuestionIds(newUsedIds);
      
      return selected;
    }

    // We have enough unused questions, proceed normally
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    
    // Mark these questions as used
    const newUsedIds = new Set(usedQuestionIds);
    selected.forEach(q => newUsedIds.add(q.id));
    setUsedQuestionIds(newUsedIds);
    
    return selected;
  };

  const startGame = (difficulty: Difficulty) => {
    const questions = getRandomQuestions(difficulty);
    setSelectedQuestions(questions);
    setCurrentDifficulty(difficulty);
    setCurrentIndex(0);
    setScore(0);
    setGameStarted(true);
    setGameEnded(false);
    setQuestionResults([]);
    setShareUrl('');
    setShowNameInput(false);
  };

  const handleGuess = (guessIsAI: boolean) => {
    const currentQuestion = selectedQuestions[currentIndex];
    const isCorrect = guessIsAI === currentQuestion.isAI;
    
    setFeedback(isCorrect ? "Correct! 🎉" : "Oops, wrong answer! 😅");
    if (isCorrect) setScore(score + 1);
    
    // Record the result
    setQuestionResults(prev => [...prev, {
      text: currentQuestion.content,
      isCorrect,
      userGuess: guessIsAI,
      actualAnswer: currentQuestion.isAI
    }]);
    
    setIsAnimating(true);
    setTimeout(() => {
      if (currentIndex < selectedQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Game completed
        setGameEnded(true);
        if (score + (isCorrect ? 1 : 0) === selectedQuestions.length) {
          // Perfect score! Trigger confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
      setFeedback(null);
      setIsAnimating(false);
    }, 1500);
  };

  const getPerformanceMessage = (finalScore: number) => {
    if (finalScore === 3) return "Perfect score! You're a natural at this! 🏆";
    if (finalScore === 2) return "Great job! You're getting the hang of it! 🌟";
    if (finalScore === 1) return "Nice try! Keep practicing to improve! 💪";
    return "Don't give up! Practice makes perfect! 🎯";
  };

  const getDifficultyOptions = () => {
    const options = [];
    if (currentDifficulty !== 'easy') {
      options.push({
        label: 'Try Easier',
        difficulty: ['medium', 'hard'].includes(currentDifficulty) ? 'easy' : 'medium',
        className: 'bg-green-600 hover:bg-green-700'
      });
    }
    options.push({
      label: 'Play Again',
      difficulty: currentDifficulty,
      className: 'bg-blue-600 hover:bg-blue-700'
    });
    if (currentDifficulty !== 'hard') {
      options.push({
        label: 'Try Harder',
        difficulty: ['easy', 'medium'].includes(currentDifficulty) ? 'hard' : 'medium',
        className: 'bg-red-600 hover:bg-red-700'
      });
    }
    return options;
  };

  if (gameEnded) {
    const finalScore = score;
    const performanceMessage = getPerformanceMessage(finalScore);
    const difficultyOptions = getDifficultyOptions();
    
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Game Results</h1>
          
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {finalScore}/3 Correct!
              </div>
              <div className="text-xl text-gray-600 dark:text-gray-400">
                {performanceMessage}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Question Breakdown:</h3>
              {questionResults.map((result, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg ${
                    result.isCorrect 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}
                >
                  <p className="text-sm mb-2">{result.text}</p>
                  <div className="flex justify-between text-sm">
                    <span>Your answer: {result.userGuess ? 'AI' : 'Human'}</span>
                    <span>Correct answer: {result.actualAnswer ? 'AI' : 'Human'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              {difficultyOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => startGame(option.difficulty as Difficulty)}
                  className={`px-6 py-3 text-white rounded-lg transform hover:scale-105 transition-all duration-200 ${option.className}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {!shareUrl && !showNameInput && (
                <button
                  onClick={() => setShowNameInput(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-200"
                >
                  Challenge Friends
                </button>
              )}

              {showNameInput && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (playerName.trim()) {
                    const session = createGameSession(
                      selectedQuestions.map(t => t.id),
                      playerName,
                      score
                    );
                    const encoded = encodeGameSession(session);
                    const url = `${window.location.origin}/challenge/${encoded}`;
                    setShareUrl(url);
                    setShowNameInput(false);
                  }
                }} className="space-y-4">
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
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-200"
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
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(shareUrl);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        } catch (err) {
                          console.error('Failed to copy:', err);
                        }
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      const text = `I scored ${score}/3 in AI or Human? Can you beat my score?`;
                      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
                      window.open(url, '_blank');
                    }}
                    className="w-full px-6 py-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transform hover:scale-105 transition-all duration-200"
                  >
                    Share on Twitter
                  </button>
                </div>
              )}
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

  const currentQuestion = selectedQuestions[currentIndex];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div>
          <div className="text-xl font-bold">
            Level: {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentIndex + 1} of 3
          </div>
        </div>
        <div className="text-xl font-bold">
          Score: {score}/{currentIndex}
        </div>
      </div>
      
      <div className={`transform transition-all duration-500 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'} mt-20`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-8 max-w-2xl w-full mx-auto">
          <div className="min-h-[200px] flex items-center justify-center mb-8">
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentQuestion.content}
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
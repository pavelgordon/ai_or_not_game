'use client';

import { useState, useEffect } from 'react';
import { texts } from '../data/texts';

interface DailyStats {
  lastPlayedDate: string;
  currentStreak: number;
  maxStreak: number;
  todayCompleted: boolean;
}

export default function DailyChallenge() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [stats, setStats] = useState<DailyStats>({
    lastPlayedDate: '',
    currentStreak: 0,
    maxStreak: 0,
    todayCompleted: false,
  });

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // Generate daily texts using the date as seed
  const getDailyTexts = () => {
    const today = getTodayDate();
    const dateNum = parseInt(today.replace(/-/g, ''));
    
    // Use the date to consistently shuffle and select 5 texts
    const shuffled = [...texts].sort((a, b) => {
      const aNum = (a.id * dateNum) % texts.length;
      const bNum = (b.id * dateNum) % texts.length;
      return aNum - bNum;
    });
    
    return shuffled.slice(0, 5);
  };

  const dailyTexts = getDailyTexts();
  const currentText = dailyTexts[currentIndex];

  useEffect(() => {
    // Load stats from localStorage
    const loadStats = () => {
      const savedStats = localStorage.getItem('dailyStats');
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        const today = getTodayDate();
        
        if (parsed.lastPlayedDate === today) {
          setStats(parsed);
        } else if (parsed.lastPlayedDate === getPreviousDate(today)) {
          // Continuing streak from yesterday
          setStats({
            ...parsed,
            lastPlayedDate: today,
            todayCompleted: false,
          });
        } else {
          // Streak broken
          setStats({
            lastPlayedDate: today,
            currentStreak: 0,
            maxStreak: parsed.maxStreak,
            todayCompleted: false,
          });
        }
      }
    };

    loadStats();
  }, []);

  const getPreviousDate = (date: string) => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  };

  const updateStats = (finalScore: number) => {
    const today = getTodayDate();
    const newStats: DailyStats = {
      lastPlayedDate: today,
      currentStreak: stats.todayCompleted ? stats.currentStreak : stats.currentStreak + 1,
      maxStreak: Math.max(stats.maxStreak, stats.currentStreak + 1),
      todayCompleted: true,
    };
    
    setStats(newStats);
    localStorage.setItem('dailyStats', JSON.stringify(newStats));
  };

  const handleGuess = (guessIsAI: boolean) => {
    const isCorrect = guessIsAI === currentText.isAI;
    setFeedback(isCorrect ? "Correct! 🎉" : "Oops, wrong answer! 😅");
    if (isCorrect) setScore(score + 1);
    
    setIsAnimating(true);
    setTimeout(() => {
      if (currentIndex < dailyTexts.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Game completed
        setGameEnded(true);
        updateStats(score + (isCorrect ? 1 : 0));
      }
      setFeedback(null);
      setIsAnimating(false);
    }, 1500);
  };

  if (stats.todayCompleted && !gameEnded) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Come Back Tomorrow!</h1>
          <p className="text-lg mb-6">You've already completed today's challenge.</p>
          <div className="space-y-4">
            <div>Current Streak: {stats.currentStreak} days</div>
            <div>Best Streak: {stats.maxStreak} days</div>
          </div>
        </div>
      </main>
    );
  }

  if (gameEnded) {
    const accuracy = (score / dailyTexts.length) * 100;
    
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Daily Challenge Complete!</h1>
          
          <div className="space-y-6">
            <div className="text-center text-2xl font-bold mb-4">
              Score: {score}/{dailyTexts.length}
            </div>
            
            <div className="space-y-4">
              <div className="text-lg">
                Accuracy: {accuracy.toFixed(1)}%
              </div>
              
              <div className="space-y-2">
                <div>Current Streak: {stats.currentStreak} days</div>
                <div>Best Streak: {stats.maxStreak} days</div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="fixed top-4 right-4 text-xl font-bold">
        Score: {score}/{dailyTexts.length}
      </div>
      
      <div className="fixed top-4 left-4 text-xl font-bold">
        Daily Challenge
      </div>

      <div className="fixed top-14 left-4 text-md text-gray-600 dark:text-gray-400">
        Question {currentIndex + 1} of {dailyTexts.length}
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
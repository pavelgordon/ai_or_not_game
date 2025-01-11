'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DailyStats {
  currentStreak: number;
  maxStreak: number;
  todayCompleted: boolean;
}

export default function Home() {
  const [stats, setStats] = useState<DailyStats | null>(null);

  useEffect(() => {
    const savedStats = localStorage.getItem('dailyStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          AI or Human?
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Can you tell the difference between AI-generated and human-written text?
        </p>

        {stats && (
          <div className="flex justify-center gap-8 text-gray-600 dark:text-gray-300">
            <div>
              Current Streak: {stats.currentStreak}
            </div>
            <div>
              Best Streak: {stats.maxStreak}
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-4">
          <Link 
            href="/daily" 
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors duration-200 hover:scale-105 transform"
          >
            Daily Challenge {stats?.todayCompleted && '(Completed)'}
          </Link>
          <Link 
            href="/game" 
            className="inline-block px-8 py-4 bg-green-600 text-white rounded-full font-semibold text-lg hover:bg-green-700 transition-colors duration-200 hover:scale-105 transform"
          >
            Practice Mode
          </Link>
        </div>
      </div>
    </main>
  );
} 
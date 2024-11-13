import React from 'react';
import { Link } from 'react-router-dom';
import { Sword, BookOpen, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-12">
        <Sword className="h-24 w-24 text-amber-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-amber-500 mb-4">
          Welcome to Italian Game - Chess
        </h1>
        <p className="text-xl text-gray-400">
          Master the art of chess through interactive training and historical insights
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <Link
          to="/trainer"
          className="group p-8 bg-gray-800 rounded-lg border border-gray-700 
                     hover:border-amber-500 transition-colors"
        >
          <Brain className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4 text-amber-500">Chess Trainer</h2>
          <p className="text-gray-400">
            Practice with our advanced AI trainer, analyze your moves, and improve your game
            with real-time feedback and suggestions.
          </p>
        </Link>

        <Link
          to="/story"
          className="group p-8 bg-gray-800 rounded-lg border border-gray-700 
                     hover:border-amber-500 transition-colors"
        >
          <BookOpen className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4 text-amber-500">Story Mode</h2>
          <p className="text-gray-400">
            Journey through the rich history of Italian chess, learn classic openings,
            and master legendary games from the greatest Italian players.
          </p>
        </Link>
      </div>
    </div>
  );
}
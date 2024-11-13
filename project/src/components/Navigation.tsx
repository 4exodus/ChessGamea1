import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sword, Brain, BookOpen } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <Sword className="h-8 w-8 text-amber-500 transform transition-transform group-hover:rotate-12" />
            <span className="text-xl font-bold text-amber-500">Italian Game - Chess</span>
          </Link>
          
          <div className="flex gap-6">
            <Link
              to="/trainer"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                flex items-center gap-2
                ${location.pathname === '/trainer' 
                  ? 'bg-amber-500 text-gray-900' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-amber-500'}`}
            >
              <Brain className="w-4 h-4" />
              Trainer
            </Link>
            <Link
              to="/story"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                flex items-center gap-2
                ${location.pathname === '/story' 
                  ? 'bg-amber-500 text-gray-900' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-amber-500'}`}
            >
              <BookOpen className="w-4 h-4" />
              Story Mode
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
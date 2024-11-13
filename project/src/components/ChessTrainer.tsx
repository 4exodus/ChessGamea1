import React, { useState, useEffect } from 'react';
import { Brain, RotateCw, Trophy, Clock, BookOpen } from 'lucide-react';
import ChessGame from './ChessGame';
import GameAnalysis from './GameAnalysis';
import CheckmatePopup from './CheckmatePopup';
import { useChessEngine } from '../hooks/useChessEngine';
import { difficultyLevels } from '../config/difficultyLevels';
import { Move } from 'chess.js';

export default function ChessTrainer() {
  const {
    game,
    difficulty,
    setDifficulty,
    thinking,
    engineReady,
    error,
    onPlayerMove,
    resetGame,
    playerColor,
    setPlayerColor,
    thinkingTime,
    setThinkingTime,
  } = useChessEngine();

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [gameHistory, setGameHistory] = useState<Move[]>([]);
  const [showColorSelect, setShowColorSelect] = useState(!playerColor);
  const [showCheckmate, setShowCheckmate] = useState(false);

  // Update game history when moves are made
  useEffect(() => {
    setGameHistory(game.history({ verbose: true }));
    
    // Check for checkmate
    if (game.isCheckmate()) {
      setShowCheckmate(true);
    }
  }, [game]);

  const handleColorSelect = (color: 'w' | 'b') => {
    setPlayerColor(color);
    setShowColorSelect(false);
  };

  const handleFlipColor = () => {
    setPlayerColor(playerColor === 'w' ? 'b' : 'w');
    resetGame();
  };

  if (showColorSelect) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="bg-gray-800/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl text-center max-w-2xl w-full mx-4">
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-amber-500 mb-8">Choose Your Side</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => handleColorSelect('w')}
              className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-600/20 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 bg-gray-700/90 rounded-xl border-2 border-gray-600 group-hover:border-amber-500 transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1528819622765-d6bcf132f793?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                  alt="White pieces"
                  className="w-full h-32 object-cover rounded-lg mb-4 shadow-lg"
                />
                <span className="text-xl font-medium text-white group-hover:text-amber-500 transition-colors">Play as White</span>
              </div>
            </button>
            <button
              onClick={() => handleColorSelect('b')}
              className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-600/20 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 bg-gray-700/90 rounded-xl border-2 border-gray-600 group-hover:border-amber-500 transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1586165368502-1bad197a6461?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                  alt="Black pieces"
                  className="w-full h-32 object-cover rounded-lg mb-4 shadow-lg"
                />
                <span className="text-xl font-medium text-white group-hover:text-amber-500 transition-colors">Play as Black</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-800/95 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-amber-500">Engine Settings</h2>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleFlipColor}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg
                         hover:bg-gray-600 hover:text-amber-500 transition-all duration-300
                         flex items-center gap-2 border border-gray-600 hover:border-amber-500"
              >
                <RotateCw className="w-4 h-4" />
                Switch Sides
              </button>
              <button
                onClick={() => setShowAnalysis(true)}
                disabled={gameHistory.length === 0}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg
                         hover:bg-gray-600 hover:text-amber-500 transition-all duration-300
                         flex items-center gap-2 border border-gray-600 hover:border-amber-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BookOpen className="w-4 h-4" />
                Analyze Game
              </button>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-amber-500 text-gray-900 rounded-lg
                         hover:bg-amber-600 transition-all duration-300
                         font-medium shadow-lg hover:shadow-amber-500/25"
              >
                New Game
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <label className="block text-sm font-medium text-amber-500 mb-3">
                Difficulty: {difficultyLevels[difficulty]?.name}
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer
                         accent-amber-500 hover:accent-amber-600 transition-all"
                disabled={!engineReady || thinking}
              />
              <div className="text-sm text-gray-400 mt-3 space-y-1">
                <p className="text-amber-500">ELO Rating: {difficultyLevels[difficulty]?.elo}</p>
                <p>{difficultyLevels[difficulty]?.description}</p>
              </div>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-amber-500" />
                <label className="text-sm font-medium text-amber-500">
                  Engine Thinking Time
                </label>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={thinkingTime}
                onChange={(e) => setThinkingTime(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer
                         accent-amber-500 hover:accent-amber-600 transition-all"
                disabled={!engineReady || thinking}
              />
              <span className="block text-sm text-gray-400 mt-2">{thinkingTime} seconds</span>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}
          {thinking && (
            <div className="mt-4 p-3 bg-amber-500/20 border border-amber-500/50 rounded-lg text-amber-500">
              Engine is thinking...
            </div>
          )}
          {!engineReady && (
            <div className="mt-4 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400">
              Initializing chess engine...
            </div>
          )}
        </div>

        <div className="bg-gray-800/95 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-700">
          <ChessGame 
            onMove={onPlayerMove}
            disabled={!engineReady || thinking || game.turn() !== playerColor}
            orientation={playerColor}
          />
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-gray-800/95 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-700">
          <h2 className="text-xl font-bold text-amber-500 mb-4">Game Information</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              <strong>Playing as:</strong> {playerColor === 'w' ? 'White' : 'Black'}
            </p>
            <p>
              <strong>Moves played:</strong> {gameHistory.length}
            </p>
            <p>
              <strong>Game status:</strong> {
                game.isCheckmate() ? 'Checkmate!' :
                game.isDraw() ? 'Draw' :
                game.isCheck() ? 'Check!' :
                'In progress'
              }
            </p>
          </div>
        </div>
      </div>

      {showAnalysis && (
        <GameAnalysis
          moves={gameHistory}
          onClose={() => setShowAnalysis(false)}
        />
      )}

      {showCheckmate && (
        <CheckmatePopup
          winner={game.turn() === 'w' ? 'black' : 'white'}
          isOpen={true}
          onClose={() => setShowCheckmate(false)}
        />
      )}
    </div>
  );
}
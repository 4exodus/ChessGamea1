import React, { useState } from 'react';
import { MessageCircle, ChevronLeft, ChevronRight, Brain, Send, Loader2 } from 'lucide-react';
import { Chess, Move } from 'chess.js';
import { useGPT } from '../utils/gpt4all';
import { getPositionAnalysis } from '../utils/stockfish';

interface GameAnalysisProps {
  moves: Move[];
  onClose: () => void;
}

export default function GameAnalysis({ moves, onClose }: GameAnalysisProps) {
  const [currentMove, setCurrentMove] = useState(0);
  const [game] = useState(new Chess());
  const [messages, setMessages] = useState<Array<{ text: string, sender: 'user' | 'ai' }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const gpt = useGPT();

  // Replay moves up to current position
  const currentPosition = () => {
    const replayGame = new Chess();
    for (let i = 0; i <= currentMove; i++) {
      replayGame.move(moves[i]);
    }
    return replayGame;
  };

  const handlePrevMove = () => {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1);
    }
  };

  const handleNextMove = () => {
    if (currentMove < moves.length - 1) {
      setCurrentMove(currentMove + 1);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isAnalyzing) return;

    try {
      setIsAnalyzing(true);
      setMessages(prev => [...prev, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');

      const pos = currentPosition();
      const analysis = await getPositionAnalysis(pos.fen(), 20);
      
      const response = await gpt.generateResponse(`
        Chess Position Analysis:
        Current Position (FEN): ${pos.fen()}
        Engine Evaluation: ${analysis}
        Current Move: ${currentMove + 1}/${moves.length}
        Last Move: ${moves[currentMove].san}
        
        User Question: ${inputMessage}
        
        Please analyze this position and answer the question.
      `);

      setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
    } catch (error) {
      console.error('Analysis error:', error);
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error analyzing this position.',
        sender: 'ai'
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-amber-500">Game Analysis</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-amber-500 transition-colors"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 flex-1 overflow-hidden">
          <div className="space-y-4">
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMove}
                  disabled={currentMove === 0}
                  className="p-2 text-gray-400 hover:text-amber-500 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-amber-500 font-medium">
                  Move {currentMove + 1} of {moves.length}
                </span>
                <button
                  onClick={handleNextMove}
                  disabled={currentMove === moves.length - 1}
                  className="p-2 text-gray-400 hover:text-amber-500 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-300">
                <p><strong>Move:</strong> {moves[currentMove].san}</p>
                <p><strong>From:</strong> {moves[currentMove].from}</p>
                <p><strong>To:</strong> {moves[currentMove].to}</p>
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 h-[400px]">
              {/* Add Chessboard component here to show position */}
            </div>
          </div>

          <div className="flex flex-col bg-gray-700/50 rounded-lg border border-gray-600">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-amber-500 text-gray-900'
                      : 'bg-gray-600 text-gray-100'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-amber-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing position...</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-600">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about this position..."
                  className="flex-1 bg-gray-600 text-gray-100 rounded-lg px-4 py-2
                           border border-gray-500 focus:border-amber-500
                           focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isAnalyzing || !inputMessage.trim()}
                  className="bg-amber-500 text-gray-900 rounded-lg px-4 py-2
                           hover:bg-amber-600 transition-colors disabled:opacity-50
                           disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
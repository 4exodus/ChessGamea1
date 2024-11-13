import React, { createContext, useContext, useState } from 'react';
import { Chess } from 'chess.js';

interface ChessContextType {
  game: Chess;
  setGame: (game: Chess) => void;
  analysis: string;
  setAnalysis: (analysis: string) => void;
}

const ChessContext = createContext<ChessContextType | undefined>(undefined);

export function ChessProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState(new Chess());
  const [analysis, setAnalysis] = useState('');

  return (
    <ChessContext.Provider value={{ game, setGame, analysis, setAnalysis }}>
      {children}
    </ChessContext.Provider>
  );
}

export function useChessContext() {
  const context = useContext(ChessContext);
  if (context === undefined) {
    throw new Error('useChessContext must be used within a ChessProvider');
  }
  return context;
}
import React, { useCallback, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Move, Square } from 'chess.js';
import { useChessContext } from '../context/ChessContext';

interface ChessBoardProps {
  initialPosition?: string;
  disabled?: boolean;
  onMove?: (move: Move) => Promise<boolean>;
  orientation?: 'w' | 'b';
}

export default function ChessGame({ 
  initialPosition,
  disabled = false,
  onMove,
  orientation = 'w'
}: ChessBoardProps) {
  const { game } = useChessContext();
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [rightClickedSquares, setRightClickedSquares] = useState<any>({});
  const [optionSquares, setOptionSquares] = useState<any>({});

  // Get valid moves for a piece
  const getMoveOptions = useCallback((square: Square) => {
    const moves = game.moves({
      square,
      verbose: true
    });
    
    const newSquares: any = {};
    moves.forEach((move) => {
      newSquares[move.to] = {
        background: 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
    });
    return newSquares;
  }, [game]);

  // Handle square right click (for arrows)
  const onSquareRightClick = useCallback((square: Square) => {
    setRightClickedSquares(prev => {
      const newSquares = { ...prev };
      if (newSquares[square]) {
        delete newSquares[square];
      } else {
        newSquares[square] = {
          backgroundColor: 'rgba(255, 255, 0, 0.4)'
        };
      }
      return newSquares;
    });
  }, []);

  // Handle square click
  const onSquareClick = useCallback((square: Square) => {
    if (disabled) return;

    setRightClickedSquares({});

    // Show valid moves when clicking a piece
    if (!moveFrom) {
      const piece = game.get(square);
      // Only allow moving pieces of the player's color
      if (piece && piece.color === game.turn() && piece.color === orientation[0]) {
        setMoveFrom(square);
        setOptionSquares(getMoveOptions(square));
      }
      return;
    }

    // Make the move if valid
    if (moveFrom) {
      const moveDetails = {
        from: moveFrom,
        to: square,
        promotion: 'q' // Always promote to queen for simplicity
      };

      onMove?.(moveDetails).then(success => {
        if (!success) {
          // If invalid move, highlight in red
          setOptionSquares({
            [square]: {
              background: 'rgba(255, 0, 0, 0.4)',
              transition: 'background-color 0.3s ease'
            }
          });
          setTimeout(() => {
            setOptionSquares(getMoveOptions(moveFrom));
          }, 300);
        } else {
          setOptionSquares({});
        }
      });

      setMoveFrom(null);
      return;
    }
  }, [game, moveFrom, onMove, disabled, getMoveOptions, orientation]);

  // Handle piece drag
  const onPieceDrop = useCallback(async (
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ) => {
    if (disabled) return false;
    
    // Only allow moving pieces of the player's color
    if (piece[0] !== game.turn() || piece[0] !== orientation[0]) return false;

    const moveDetails = {
      from: sourceSquare,
      to: targetSquare,
      promotion: piece.toLowerCase().includes('p') && 
                (targetSquare[1] === '8' || targetSquare[1] === '1') 
                ? 'q' : undefined
    };

    try {
      const success = await onMove?.(moveDetails);
      if (!success) {
        setOptionSquares({
          [targetSquare]: {
            background: 'rgba(255, 0, 0, 0.4)',
            transition: 'background-color 0.3s ease'
          }
        });
        setTimeout(() => setOptionSquares({}), 300);
      }
      return Boolean(success);
    } catch (error) {
      console.error('Move error:', error);
      return false;
    }
  }, [disabled, game, onMove, orientation]);

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <Chessboard
        id="BasicBoard"
        position={initialPosition || game.fen()}
        onPieceDrop={onPieceDrop}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        boardOrientation={orientation}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }}
        customDarkSquareStyle={{ backgroundColor: '#779952' }}
        customLightSquareStyle={{ backgroundColor: '#edeed1' }}
        customSquareStyles={{
          ...optionSquares,
          ...rightClickedSquares
        }}
        animationDuration={200}
        boardWidth={600}
        areArrowsAllowed={true}
        showBoardNotation={true}
      />
    </div>
  );
}
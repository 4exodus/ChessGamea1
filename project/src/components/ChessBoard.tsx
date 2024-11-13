import React, { useCallback, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Move, Square } from 'chess.js';

interface ChessBoardProps {
  game: Chess;
  onMove: (move: Move) => Promise<boolean>;
  disabled?: boolean;
}

export function ChessBoard({ game, onMove, disabled = false }: ChessBoardProps) {
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showValidMoves, setShowValidMoves] = useState<boolean>(false);
  const [rightClickedSquares, setRightClickedSquares] = useState<any>({});
  const [optionSquares, setOptionSquares] = useState<any>({});

  // Get valid moves for a piece
  const getMoveOptions = (square: Square) => {
    const moves = game.moves({
      square,
      verbose: true
    });
    
    const newSquares: any = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background: 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
    });
    return newSquares;
  };

  // Handle square right click (for arrows)
  const onSquareRightClick = useCallback((square: Square) => {
    const colour = 'rgba(255, 255, 0, 0.4)';
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]: {
        backgroundColor: colour
      }
    });
  }, [rightClickedSquares]);

  // Handle square click
  const onSquareClick = useCallback((square: Square) => {
    setRightClickedSquares({});

    // Show valid moves when clicking a piece
    if (!moveFrom) {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setMoveFrom(square);
        setOptionSquares(getMoveOptions(square));
      }
      return;
    }

    // Make the move if valid
    if (moveFrom) {
      const moveResult = onMove({
        from: moveFrom,
        to: square,
        promotion: 'q'
      });

      if (!moveResult) {
        // If invalid move, highlight in red
        setOptionSquares({
          [square]: {
            background: 'rgba(255, 0, 0, 0.4)'
          }
        });
        setTimeout(() => {
          setOptionSquares(getMoveOptions(moveFrom));
        }, 300);
      } else {
        setOptionSquares({});
      }
      setMoveFrom(null);
      return;
    }
  }, [game, moveFrom, onMove]);

  // Handle piece drag
  const handlePieceDrop = useCallback(async (
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ) => {
    if (disabled) return false;
    if (piece[0] !== game.turn()) return false;

    try {
      const moveResult = await onMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece.toLowerCase().includes('p') && (targetSquare[1] === '8' || targetSquare[1] === '1') ? 'q' : undefined,
      });

      if (!moveResult) {
        // Highlight invalid move
        setOptionSquares({
          [targetSquare]: {
            background: 'rgba(255, 0, 0, 0.4)'
          }
        });
        setTimeout(() => setOptionSquares({}), 300);
      }

      return moveResult;
    } catch (error) {
      console.error('Move error:', error);
      return false;
    }
  }, [disabled, game, onMove]);

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <Chessboard
        id="BasicBoard"
        position={game.fen()}
        onPieceDrop={handlePieceDrop}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        boardOrientation="white"
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
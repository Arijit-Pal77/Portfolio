import React, { useState, useEffect, useCallback } from 'react';
import { X, Circle, RefreshCw, Cpu, User, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Player = 'X' | 'O' | null;
type BoardState = Player[];

export default function TicTacToeGame() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true); // User is 'X', AI is 'O'
  const [difficulty, setDifficulty] = useState<'easy' | 'impossible'>('impossible');
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const [score, setScore] = useState({ player: 0, ai: 0, draws: 0 });
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Check winner
  const checkWinner = (cells: BoardState): Player | 'Draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }

    if (cells.every(cell => cell !== null)) {
      return 'Draw';
    }

    return null;
  };

  // Minimax algorithm for impossible AI
  const minimax = useCallback((tempBoard: BoardState, depth: number, isMaximizing: boolean): number => {
    const gameResult = checkWinner(tempBoard);
    if (gameResult === 'O') return 10 - depth;
    if (gameResult === 'X') return depth - 10;
    if (gameResult === 'Draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (tempBoard[i] === null) {
          tempBoard[i] = 'O';
          const currentScore = minimax(tempBoard, depth + 1, false);
          tempBoard[i] = null;
          bestScore = Math.max(bestScore, currentScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (tempBoard[i] === null) {
          tempBoard[i] = 'X';
          const currentScore = minimax(tempBoard, depth + 1, true);
          tempBoard[i] = null;
          bestScore = Math.min(bestScore, currentScore);
        }
      }
      return bestScore;
    }
  }, []);

  // Find best move for AI
  const findBestMove = useCallback((currentBoard: BoardState): number => {
    // Easy mode: random empty spot
    if (difficulty === 'easy') {
      const emptySpots = currentBoard
        .map((val, idx) => (val === null ? idx : null))
        .filter((val): val is number => val !== null);
      if (emptySpots.length > 0) {
        return emptySpots[Math.floor(Math.random() * emptySpots.length)];
      }
      return -1;
    }

    // Impossible mode: Minimax
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        currentBoard[i] = 'O';
        const currentScore = minimax(currentBoard, 0, false);
        currentBoard[i] = null;

        if (currentScore > bestScore) {
          bestScore = currentScore;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }, [difficulty, minimax]);

  // AI Move hook
  useEffect(() => {
    if (!isXNext && winner === null) {
      setIsThinking(true);
      const timer = setTimeout(() => {
        const aiMove = findBestMove(board);
        if (aiMove !== -1) {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);
          setIsXNext(true);

          const result = checkWinner(newBoard);
          if (result) {
            setWinner(result);
            updateScore(result);
          }
        }
        setIsThinking(false);
      }, 600); // realistic thinking latency

      return () => clearTimeout(timer);
    }
  }, [isXNext, board, winner, findBestMove]);

  const updateScore = (result: Player | 'Draw') => {
    if (result === 'X') {
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
    } else if (result === 'O') {
      setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
    } else if (result === 'Draw') {
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  };

  const handleClick = (index: number) => {
    if (board[index] !== null || !isXNext || winner !== null) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      updateScore(result);
    }
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const handleResetScore = () => {
    setScore({ player: 0, ai: 0, draws: 0 });
    handleReset();
  };

  return (
    <div className="w-full max-w-md mx-auto glass-cyber p-6 rounded-2xl border-secondary/20 relative">
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={() => setDifficulty(d => d === 'easy' ? 'impossible' : 'easy')}
          className={`px-3 py-1 text-xs font-mono border rounded transition-all flex items-center gap-1 uppercase ${
            difficulty === 'impossible'
              ? 'border-primary-orange/50 text-primary-orange bg-primary-orange/10 neon-text-orange'
              : 'border-electric-cyan/50 text-electric-cyan bg-electric-cyan/10 neon-text-cyan'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          {difficulty}
        </button>
      </div>

      <div className="mb-6">
        <h4 className="font-headline text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-electric-cyan animate-pulse" />
          Neural Minimax Playpen
        </h4>
        <p className="text-xs text-slate-300 mt-1 font-medium">
          Beat the recursive state-evaluation matrix. Defeat is statistically inevitable.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-3 gap-2 mb-6 text-center font-mono text-xs">
        <div className="bg-white/10 border border-white/15 p-2 rounded text-white font-medium">
          <div className="text-slate-400 uppercase text-[9px] font-semibold">User (X)</div>
          <div className="text-sm font-bold text-white mt-0.5">{score.player}</div>
        </div>
        <div className="bg-white/10 border border-white/15 p-2 rounded text-white font-medium">
          <div className="text-slate-400 uppercase text-[9px] font-semibold">Draws</div>
          <div className="text-sm font-bold text-white mt-0.5">{score.draws}</div>
        </div>
        <div className="bg-white/10 border border-white/15 p-2 rounded text-white font-medium">
          <div className="text-slate-400 uppercase text-[9px] font-semibold">Minimax (O)</div>
          <div className="text-sm font-bold text-white mt-0.5">{score.ai}</div>
        </div>
      </div>

      {/* Play Board */}
      <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-black/40 border border-secondary/10 rounded-xl p-3 grid grid-cols-3 grid-rows-3 gap-2">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            disabled={cell !== null || !isXNext || winner !== null}
            className={`relative flex items-center justify-center rounded-lg bg-[#141414] border border-white/5 transition-all duration-200 cursor-pointer ${
              cell === null && isXNext && winner === null
                ? 'hover:bg-white/5 hover:border-electric-cyan/30'
                : 'disabled:cursor-default'
            }`}
          >
            <AnimatePresence mode="wait">
              {cell === 'X' && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  className="text-electric-cyan neon-text-cyan"
                >
                  <X className="w-8 h-8 stroke-[2.5]" />
                </motion.div>
              )}
              {cell === 'O' && (
                <motion.div
                  initial={{ scale: 0, rotate: 45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  className="text-primary-orange neon-text-orange"
                >
                  <Circle className="w-7 h-7 stroke-[2.5]" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        ))}

        {/* Scan / Thinking Overlay */}
        {isThinking && (
          <div className="absolute inset-0 bg-black/45 rounded-xl flex flex-col items-center justify-center gap-2 backdrop-blur-[1px]">
            <div className="relative w-8 h-8 border-2 border-primary-orange border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-mono text-primary-orange uppercase tracking-wider animate-pulse">
              Computing Node...
            </span>
          </div>
        )}
      </div>

      {/* Match Conclusion Dialog */}
      <div className="mt-6 flex flex-col items-center gap-3">
        {winner ? (
          <div className="text-center">
            {winner === 'Draw' ? (
              <span className="font-mono text-sm uppercase text-slate-300 font-bold tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
                Draw Match
              </span>
            ) : winner === 'X' ? (
              <span className="font-mono text-sm uppercase text-electric-cyan neon-text-cyan font-bold tracking-widest bg-electric-cyan/10 border border-electric-cyan/30 px-4 py-1.5 rounded-full">
                User Matrix Defeated AI!
              </span>
            ) : (
              <span className="font-mono text-sm uppercase text-primary-orange neon-text-orange font-bold tracking-widest bg-primary-orange/10 border border-primary-orange/30 px-4 py-1.5 rounded-full">
                AI Dominated Node
              </span>
            )}
          </div>
        ) : (
          <div className="text-center text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5 h-8">
            {isXNext ? (
              <>
                <User className="w-3.5 h-3.5 text-electric-cyan" />
                <span>Your Action Sequence</span>
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5 text-primary-orange animate-pulse" />
                <span>AI Node Scanning</span>
              </>
            )}
          </div>
        )}

        <div className="flex gap-2 w-full mt-2">
          <button
            onClick={handleReset}
            className="flex-1 py-2.5 bg-secondary/10 hover:bg-secondary/20 text-electric-cyan border border-secondary/30 rounded-lg text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Board
          </button>
          <button
            onClick={handleResetScore}
            className="px-3 py-2.5 hover:bg-white/5 text-slate-400 border border-white/10 rounded-lg text-xs font-mono uppercase tracking-widest transition-all"
            title="Reset Scoreboard"
          >
            Flush Logs
          </button>
        </div>
      </div>
    </div>
  );
}

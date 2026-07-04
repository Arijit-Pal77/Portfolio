import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Gamepad2, RefreshCw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const CANVAS_SIZE = { x: 300, y: 300 };
const CELL_SIZE = 15;
const SPEED_INITIAL = 120;
const SPEED_MIN = 40;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<number[][]>([[10, 10], [10, 11], [10, 12]]);
  const [food, setFood] = useState<number[]>([5, 5]);
  const [dir, setDir] = useState<number[]>([0, -1]); // Up initially
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('snake_highscore') || 12);
  });
  const [gameOver, setGameOver] = useState<boolean>(true);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(SPEED_INITIAL);

  // Random food generation
  const generateFood = useCallback((currentSnake: number[][]): number[] => {
    while (true) {
      const x = Math.floor(Math.random() * (CANVAS_SIZE.x / CELL_SIZE));
      const y = Math.floor(Math.random() * (CANVAS_SIZE.y / CELL_SIZE));
      // Make sure food is not on the snake
      const onSnake = currentSnake.some(cell => cell[0] === x && cell[1] === y);
      if (!onSnake) return [x, y];
    }
  }, []);

  const startGame = () => {
    setSnake([[10, 10], [10, 11], [10, 12]]);
    setDir([0, -1]);
    setScore(0);
    setSpeed(SPEED_INITIAL);
    setGameOver(false);
    setGameStarted(true);
    setFood(generateFood([[10, 10], [10, 11], [10, 12]]));
  };

  // Input direction handling
  const handleDirection = useCallback((newDir: number[]) => {
    // Prevent 180 degree turns
    setDir(prevDir => {
      if (prevDir[0] + newDir[0] === 0 && prevDir[1] + newDir[1] === 0) {
        return prevDir;
      }
      return newDir;
    });
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleDirection([0, -1]);
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          handleDirection([0, 1]);
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleDirection([-1, 0]);
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleDirection([1, 0]);
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirection]);

  // Main game loop
  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const moveSnake = () => {
      const head = snake[0];
      const newHead = [head[0] + dir[0], head[1] + dir[1]];

      // Wall collision
      const widthCells = CANVAS_SIZE.x / CELL_SIZE;
      const heightCells = CANVAS_SIZE.y / CELL_SIZE;
      if (
        newHead[0] < 0 ||
        newHead[0] >= widthCells ||
        newHead[1] < 0 ||
        newHead[1] >= heightCells
      ) {
        handleGameOver();
        return;
      }

      // Self collision
      const selfCollide = snake.some(cell => cell[0] === newHead[0] && cell[1] === newHead[1]);
      if (selfCollide) {
        handleGameOver();
        return;
      }

      const newSnake = [newHead, ...snake];

      // Check food consumption
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setScore(prev => {
          const nextScore = prev + 1;
          if (nextScore > highScore) {
            setHighScore(nextScore);
            localStorage.setItem('snake_highscore', String(nextScore));
          }
          return nextScore;
        });
        setFood(generateFood(newSnake));
        // Increase speed slightly
        setSpeed(prevSpeed => Math.max(SPEED_MIN, prevSpeed - 3));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const handleGameOver = () => {
      setGameOver(true);
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, dir, food, gameOver, gameStarted, speed, generateFood, highScore]);

  // Draw onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, CANVAS_SIZE.x, CANVAS_SIZE.y);

    // Draw grid lines subtly
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_SIZE.x; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE.y);
      ctx.stroke();
    }
    for (let j = 0; j < CANVAS_SIZE.y; j += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(CANVAS_SIZE.x, j);
      ctx.stroke();
    }

    // Draw Food with bloom
    ctx.fillStyle = '#ffb700';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffb700';
    ctx.beginPath();
    ctx.arc(
      food[0] * CELL_SIZE + CELL_SIZE / 2,
      food[1] * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw Snake with electric-cyan bloom
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00f3ff';
    snake.forEach((cell, idx) => {
      ctx.fillStyle = idx === 0 ? '#00f3ff' : 'rgba(0, 243, 255, 0.7)';
      ctx.fillRect(
        cell[0] * CELL_SIZE + 1,
        cell[1] * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="w-full max-w-md mx-auto glass-cyber p-6 rounded-2xl border-secondary/20 relative">
      <div className="mb-4">
        <h4 className="font-headline text-lg font-bold text-white flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-electric-cyan animate-pulse" />
          Arcade Pipeline: Python Snake
        </h4>
        <p className="text-xs text-slate-300 mt-1 font-medium">
          Nostalgic grid traversal protocol. Steer node and consume floating bits.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-center font-mono text-xs">
        <div className="bg-white/10 border border-white/15 p-2 rounded flex items-center justify-between px-3 text-white font-medium">
          <span className="text-slate-400 uppercase text-[9px] flex items-center gap-1 font-semibold">Score:</span>
          <span className="text-sm font-bold text-electric-cyan neon-text-cyan">{score}</span>
        </div>
        <div className="bg-white/10 border border-white/15 p-2 rounded flex items-center justify-between px-3 text-white font-medium">
          <span className="text-slate-400 uppercase text-[9px] flex items-center gap-1 font-semibold">
            <Trophy className="w-3 h-3 text-primary-amber" /> Record:
          </span>
          <span className="text-sm font-bold text-primary-amber neon-text-amber">{highScore}</span>
        </div>
      </div>

      <div className="relative border border-secondary/20 rounded-xl overflow-hidden bg-black flex justify-center items-center">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE.x}
          height={CANVAS_SIZE.y}
          className="block max-w-full aspect-square"
        />

        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
            <Gamepad2 className="w-12 h-12 text-primary-amber neon-text-amber animate-bounce mb-3" />
            <h5 className="font-headline text-xl font-bold text-white uppercase tracking-wider">
              {gameOver && gameStarted ? 'Pipeline Compromised' : 'SNAKE_GRID_ONLINE'}
            </h5>
            <p className="text-xs text-slate-400 mt-2 mb-6 max-w-[200px]">
              {gameOver && gameStarted
                ? `Terminal speed was ${Math.round(1000 / speed)} bit/s. score: ${score}`
                : 'Keyboard Arrows / WASD active. Mobile controls located below.'}
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-primary-amber text-background font-bold text-xs uppercase tracking-widest hover:neon-border-amber hover:bg-background hover:text-primary-amber transition-all rounded"
            >
              Initialize Node
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mt-6 flex flex-col items-center select-none lg:hidden">
        <div className="grid grid-cols-3 gap-2 w-36 aspect-square">
          <div />
          <button
            onClick={() => handleDirection([0, -1])}
            disabled={gameOver}
            className="w-10 h-10 rounded bg-[#181818] border border-secondary/20 flex items-center justify-center text-secondary active:bg-secondary/20"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div />

          <button
            onClick={() => handleDirection([-1, 0])}
            disabled={gameOver}
            className="w-10 h-10 rounded bg-[#181818] border border-secondary/20 flex items-center justify-center text-secondary active:bg-secondary/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 flex items-center justify-center text-slate-600 text-xs font-mono">
            PAD
          </div>
          <button
            onClick={() => handleDirection([1, 0])}
            disabled={gameOver}
            className="w-10 h-10 rounded bg-[#181818] border border-secondary/20 flex items-center justify-center text-secondary active:bg-secondary/20"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div />
          <button
            onClick={() => handleDirection([0, 1])}
            disabled={gameOver}
            className="w-10 h-10 rounded bg-[#181818] border border-secondary/20 flex items-center justify-center text-secondary active:bg-secondary/20"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <div />
        </div>
      </div>
    </div>
  );
}

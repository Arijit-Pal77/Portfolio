import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Sliders, Eye, Grid, Sparkles, Compass, Cpu, Info } from 'lucide-react';

interface FrameScrubberProps {
}

export default function FrameScrubber({}: FrameScrubberProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Constants
  const TOTAL_FRAMES = 240;
  const IMAGE_DIR = 'Photos';
  const IMAGE_PREFIX = 'ezgif-frame-';
  const IMAGE_EXT = 'png';

  // Component State
  const [currentFrame, setCurrentFrame] = useState(0);
  const [targetFrame, setTargetFrame] = useState(0);
  const [playbackMode, setPlaybackMode] = useState<'scroll' | 'auto'>('scroll');
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayFps, setAutoplayFps] = useState(30);
  const [scrubInertia, setScrubInertia] = useState(0.08); // Lerp smoothing
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  // Live adjustments / Filters
  const [filters, setFilters] = useState({
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    hue: 0,
  });

  // Assets and loading state
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingError, setLoadingError] = useState(false);

  // Procedural 3D constellation nodes
  const nodesRef = useRef<Array<{ x: number; y: number; z: number; color: string }>>([]);

  // Setup stable procedural nodes
  if (nodesRef.current.length === 0) {
    const tempNodes = [];
    // Core sphere
    for (let i = 0; i < 80; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 40 + Math.random() * 80; // sphere radius
      tempNodes.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        color: Math.random() > 0.4 ? '#00f3ff' : '#ffb700', // Cyan or Amber
      });
    }
    // Outer satellite ring
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const r = 160 + Math.random() * 20;
      tempNodes.push({
        x: r * Math.cos(angle),
        y: (Math.random() - 0.5) * 15,
        z: r * Math.sin(angle),
        color: '#00f3ff',
      });
    }
    nodesRef.current = tempNodes;
  }

  // Handle preloading of user images with fallback
  useEffect(() => {
    let active = true;
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    // First, verify if the first frame exists
    const firstImg = new Image();
    const firstFrameNum = String(1).padStart(3, '0');
    firstImg.src = `${IMAGE_DIR}/${IMAGE_PREFIX}${firstFrameNum}.${IMAGE_EXT}`;

    const timeoutId = setTimeout(() => {
      if (active && !imagesLoaded) {
        // Fallback to procedural if it takes too long to load first image
        setLoadingError(true);
      }
    }, 400); // Fail fast to procedural if files aren't present

    firstImg.onload = () => {
      clearTimeout(timeoutId);
      if (!active) return;

      // First image successfully loaded, proceed to preload all 240 frames
      preloadAllFrames();
    };

    firstImg.onerror = () => {
      clearTimeout(timeoutId);
      if (active) {
        setLoadingError(true);
      }
    };

    function preloadAllFrames() {
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const frameNum = String(i).padStart(3, '0');
        const img = new Image();
        img.src = `${IMAGE_DIR}/${IMAGE_PREFIX}${frameNum}.${IMAGE_EXT}`;

        img.onload = () => {
          if (!active) return;
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
          if (loadedCount === TOTAL_FRAMES) {
            setImages(loadedImages);
            setImagesLoaded(true);
          }
        };

        img.onerror = () => {
          if (!active) return;
          // Count errors as loaded to proceed anyway
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
          if (loadedCount === TOTAL_FRAMES) {
            setImages(loadedImages);
            setImagesLoaded(true);
          }
        };

        loadedImages.push(img);
      }
    }

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Window resize handler for canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen to mouse scroll to scrub frame index
  useEffect(() => {
    if (playbackMode !== 'scroll') return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      // Scroll boundaries mapping: page vertical scroll
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight <= 0) return;

      const progress = Math.max(0, Math.min(1, scrollTop / scrollHeight));
      setTargetFrame(progress * (TOTAL_FRAMES - 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [playbackMode]);

  // Main animation / render loop using requestAnimationFrame
  useEffect(() => {
    let animFrameId: number;
    let currentVal = currentFrame;
    let lastAutoplayTime = performance.now();

    const loop = (timestamp: number) => {
      if (playbackMode === 'scroll') {
        const diff = targetFrame - currentVal;
        if (Math.abs(diff) < 0.01) {
          currentVal = targetFrame;
        } else {
          currentVal += diff * scrubInertia;
        }
      } else if (playbackMode === 'auto' && isPlaying) {
        const interval = 1000 / autoplayFps;
        const elapsed = timestamp - lastAutoplayTime;

        if (elapsed > interval) {
          currentVal = (currentVal + 1) % TOTAL_FRAMES;
          lastAutoplayTime = timestamp - (elapsed % interval);
        }
      }

      setCurrentFrame(currentVal);
      renderCanvasFrame(Math.round(currentVal));

      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameId);
  }, [playbackMode, targetFrame, isPlaying, autoplayFps, scrubInertia, images, imagesLoaded, loadingError, filters]);

  // Canvas drawing function (supports real images & high-fidelity procedural fallback)
  const renderCanvasFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const dpr = window.devicePixelRatio || 1;

    // Clear and scale
    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // Apply WebGL-style filters in 2D context
    ctx.filter = `blur(${filters.blur}px) ` +
                 `brightness(${filters.brightness}%) ` +
                 `contrast(${filters.contrast}%) ` +
                 `grayscale(${filters.grayscale}%) ` +
                 `hue-rotate(${filters.hue}deg)`;

    if (imagesLoaded && images[frameIdx]) {
      // 1. Draw preloaded image (cover style)
      const img = images[frameIdx];
      const imgRatio = img.width / img.height;
      const canvasRatio = w / h;

      let drawW, drawH, offsetX, offsetY;

      if (canvasRatio > imgRatio) {
        drawW = w;
        drawH = w / imgRatio;
        offsetX = 0;
        offsetY = (h - drawH) / 2;
      } else {
        drawW = h * imgRatio;
        drawH = h;
        offsetX = (w - drawW) / 2;
        offsetY = 0;
      }

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    } else {
      // 2. Procedural cybernetic 3D constellation animation fallback
      // Draw background grid
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(0, 243, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40 * dpr;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 3D Matrix transform based on current frame index
      // Smooth continuous 3D rotation
      const angleY = (frameIdx / TOTAL_FRAMES) * Math.PI * 2;
      const angleX = Math.sin((frameIdx / TOTAL_FRAMES) * Math.PI * 2) * 0.4;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Project vertices to 2D
      const projectedNodes = nodesRef.current.map(node => {
        // Rotate around Y
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.x * sinY + node.z * cosY;

        // Rotate around X
        let y2 = node.y * cosX - z1 * sinX;
        let z2 = node.y * sinX + z1 * cosX;

        // 3D projection parameters
        const perspective = 300 * dpr;
        const scale = perspective / (perspective + z2);
        const screenX = w / 2 + x1 * scale * dpr;
        const screenY = h / 2 + y2 * scale * dpr;

        return { x: screenX, y: screenY, z: z2, color: node.color, scale };
      });

      // Draw connection lines
      ctx.lineWidth = 0.8 * dpr;
      for (let i = 0; i < projectedNodes.length; i++) {
        const n1 = projectedNodes[i];
        let maxConnections = 4;
        let connections = 0;

        for (let j = i + 1; j < projectedNodes.length; j++) {
          if (connections >= maxConnections) break;

          const n2 = projectedNodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          const limit = 80 * dpr * ((n1.scale + n2.scale) / 2);

          if (dist < limit) {
            const alpha = (1 - dist / limit) * 0.25 * (1 + (n1.z + n2.z) / 400);
            ctx.strokeStyle = n1.color === '#ffb700' ? `rgba(255, 183, 0, ${alpha})` : `rgba(0, 243, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
            connections++;
          }
        }
      }

      // Draw particle nodes
      projectedNodes.forEach(node => {
        const size = (node.color === '#ffb700' ? 2 : 3) * node.scale * dpr;
        if (size <= 0.2) return;

        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 10 * dpr;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for next draw
      });

      // Overlay cyber HUD graphics
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
      ctx.lineWidth = 1 * dpr;
      
      // Target brackets
      const sizeHUD = 45 * dpr;
      const centerX = w / 2;
      const centerY = h / 2;
      ctx.beginPath();
      // TL corner
      ctx.moveTo(centerX - sizeHUD, centerY - sizeHUD + 15 * dpr);
      ctx.lineTo(centerX - sizeHUD, centerY - sizeHUD);
      ctx.lineTo(centerX - sizeHUD + 15 * dpr, centerY - sizeHUD);
      // TR corner
      ctx.moveTo(centerX + sizeHUD, centerY - sizeHUD + 15 * dpr);
      ctx.lineTo(centerX + sizeHUD, centerY - sizeHUD);
      ctx.lineTo(centerX + sizeHUD - 15 * dpr, centerY - sizeHUD);
      // BL corner
      ctx.moveTo(centerX - sizeHUD, centerY + sizeHUD - 15 * dpr);
      ctx.lineTo(centerX - sizeHUD, centerY + sizeHUD);
      ctx.lineTo(centerX - sizeHUD + 15 * dpr, centerY + sizeHUD);
      // BR corner
      ctx.moveTo(centerX + sizeHUD, centerY + sizeHUD - 15 * dpr);
      ctx.lineTo(centerX + sizeHUD, centerY + sizeHUD);
      ctx.lineTo(centerX + sizeHUD - 15 * dpr, centerY + sizeHUD);
      ctx.stroke();

      // Scanner circle
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, sizeHUD * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // Dynamic digital reading overlay
      ctx.fillStyle = 'rgba(0, 243, 255, 0.4)';
      ctx.font = `${Math.max(9, 8 * dpr)}px monospace`;
      ctx.fillText(`SEQ_MATRIX_STREAM_v1.0.8`, 20 * dpr, 30 * dpr);
      ctx.fillText(`FRAME_INDEX: ${String(frameIdx + 1).padStart(3, '0')}/240`, 20 * dpr, 45 * dpr);
      ctx.fillText(`FPS_INTERPOLATION: ${autoplayFps}hz`, 20 * dpr, 60 * dpr);
      ctx.fillText(`VECTOR_DIVERGENCE: 0.024`, 20 * dpr, 75 * dpr);

      // Procedural dynamic bottom waveform
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      for (let i = 0; i < w; i += 5 * dpr) {
        const amp = 12 * dpr * Math.sin(i * 0.02 + frameIdx * 0.1);
        if (i === 0) {
          ctx.moveTo(i, h - 30 * dpr + amp);
        } else {
          ctx.lineTo(i, h - 30 * dpr + amp);
        }
      }
      ctx.stroke();
    }

    ctx.restore();
  };

  // Switch play modes
  const handleModeChange = (mode: 'scroll' | 'auto') => {
    setPlaybackMode(mode);
    if (mode === 'scroll') {
      setIsPlaying(false);
    }
  };

  // Reset Adjustments
  const handleResetFilters = () => {
    setFilters({ blur: 0, brightness: 100, contrast: 100, grayscale: 0, hue: 0 });
  };

  return (
    <div className="w-full bg-[#080808] border border-white/5 rounded-2xl overflow-hidden flex flex-col relative h-[450px] sm:h-[500px] shadow-[0_0_30px_rgba(0,243,255,0.05)] group">
      {/* 1. Canvas Viewport */}
      <div ref={containerRef} className="flex-1 w-full h-full relative overflow-hidden bg-black">
        <canvas ref={canvasRef} className="block w-full h-full cursor-grab active:cursor-grabbing" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Loading overlay */}
        {!imagesLoaded && !loadingError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 backdrop-blur-sm">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-electric-cyan/20"></div>
              <div className="absolute inset-0 rounded-full border-2 border-t-electric-cyan animate-spin"></div>
            </div>
            <p className="text-xs font-mono text-electric-cyan uppercase tracking-widest animate-pulse">
              Preloading Cinematic Frames... {loadingProgress}%
            </p>
          </div>
        )}

        {/* Playback status badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-2.5 py-1 bg-black/80 border border-white/10 rounded-full font-mono text-[9px]">
          <span className={`w-1.5 h-1.5 rounded-full ${playbackMode === 'auto' && isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-electric-cyan'}`} />
          <span className="text-slate-300 uppercase tracking-wider">
            {playbackMode === 'scroll' ? 'Scroll Scrubbing' : isPlaying ? 'Autoplay Live' : 'Autoplay Paused'}
          </span>
        </div>

        {/* Frame indicator */}
        <div className="absolute bottom-4 left-4 z-10 font-mono text-sm tracking-widest text-white drop-shadow">
          <span className="font-bold text-electric-cyan">{String(Math.round(currentFrame) + 1).padStart(3, '0')}</span>
          <span className="text-slate-500 text-xs"> / 240</span>
        </div>

        {/* Dynamic Frame scrubber progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 z-10">
          <div
            className="h-full bg-electric-cyan shadow-[0_0_8px_#00f3ff] transition-all duration-100 ease-out"
            style={{ width: `${(currentFrame / (TOTAL_FRAMES - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* 2. Controls & Dashboard */}
      <div className="p-4 border-t border-white/5 bg-[#0a0a0a] flex flex-col gap-4 relative z-10">
        {/* Playback Controls & Mode Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-[#101010] p-1 border border-white/5 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => handleModeChange('scroll')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                playbackMode === 'scroll' ? 'bg-electric-cyan text-background font-bold shadow-[0_0_8px_rgba(0,243,255,0.3)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Scroll Scrub
            </button>
            <button
              onClick={() => handleModeChange('auto')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                playbackMode === 'auto' ? 'bg-electric-cyan text-background font-bold shadow-[0_0_8px_rgba(0,243,255,0.3)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Autoplay
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  let prev = Math.round(currentFrame) - 1;
                  if (prev < 0) prev = TOTAL_FRAMES - 1;
                  setCurrentFrame(prev);
                  setTargetFrame(prev);
                }}
                disabled={playbackMode === 'scroll'}
                className="p-1.5 border border-white/5 hover:border-white/20 rounded text-slate-400 hover:text-white transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Prev Frame"
              >
                <RotateCcw className="w-3.5 h-3.5 transform -rotate-90" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={playbackMode === 'scroll'}
                className={`p-2 rounded-full cursor-pointer transition flex items-center justify-center ${
                  isPlaying ? 'bg-primary-amber text-background' : 'bg-white/10 hover:bg-white/15 text-white'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  let next = Math.round(currentFrame) + 1;
                  if (next >= TOTAL_FRAMES) next = 0;
                  setCurrentFrame(next);
                  setTargetFrame(next);
                }}
                disabled={playbackMode === 'scroll'}
                className="p-1.5 border border-white/5 hover:border-white/20 rounded text-slate-400 hover:text-white transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Next Frame"
              >
                <RotateCcw className="w-3.5 h-3.5 transform scale-x-[-1] -rotate-90" />
              </button>
            </div>

            <button
              onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
              className="px-2.5 py-1.5 border border-white/5 hover:border-white/20 rounded flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white transition cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-electric-cyan" />
              <span>{isPanelCollapsed ? 'Show Filters' : 'Hide Filters'}</span>
            </button>
          </div>
        </div>

        {/* Settings Sliders & Live Adjustments Panel */}
        {!isPanelCollapsed && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 pt-4 border-t border-white/5 animate-fade-in">
            {/* Speed / Sensitivity Controls */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-primary-amber flex items-center gap-1.5">
                <Compass className="w-3 h-3" />
                DYNAMICS
              </h4>
              
              {playbackMode === 'scroll' ? (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Scrub Inertia</span>
                    <span className="text-electric-cyan">{scrubInertia.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.30"
                    step="0.01"
                    value={scrubInertia}
                    onChange={(e) => setScrubInertia(parseFloat(e.target.value))}
                    className="w-full accent-electric-cyan cursor-pointer"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Playback FPS</span>
                    <span className="text-electric-cyan">{autoplayFps} FPS</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={autoplayFps}
                    onChange={(e) => setAutoplayFps(parseInt(e.target.value))}
                    className="w-full accent-electric-cyan cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Filter Adjustments 1 */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-primary-amber flex items-center gap-1.5">
                <Sliders className="w-3 h-3" />
                LIVE FILTERS
              </h4>
              
              <div className="grid grid-cols-1 gap-2.5">
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Blur Radius</span>
                    <span>{filters.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={filters.blur}
                    onChange={(e) => setFilters(f => ({ ...f, blur: parseFloat(e.target.value) }))}
                    className="w-full accent-electric-cyan h-1 cursor-pointer"
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Brightness</span>
                    <span>{filters.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    step="5"
                    value={filters.brightness}
                    onChange={(e) => setFilters(f => ({ ...f, brightness: parseInt(e.target.value) }))}
                    className="w-full accent-electric-cyan h-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Filter Adjustments 2 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-primary-amber flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  SPECTRAL FX
                </h4>
                <button
                  onClick={handleResetFilters}
                  className="text-[9px] font-mono text-slate-500 hover:text-white transition uppercase cursor-pointer"
                >
                  Reset
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Grayscale</span>
                    <span>{filters.grayscale}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={filters.grayscale}
                    onChange={(e) => setFilters(f => ({ ...f, grayscale: parseInt(e.target.value) }))}
                    className="w-full accent-electric-cyan h-1 cursor-pointer"
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Hue Rotate</span>
                    <span>{filters.hue}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="10"
                    value={filters.hue}
                    onChange={(e) => setFilters(f => ({ ...f, hue: parseInt(e.target.value) }))}
                    className="w-full accent-electric-cyan h-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Floating Scroll Mouse Indicator on Hover/Idle */}
      {playbackMode === 'scroll' && currentFrame === 0 && (
        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center gap-3 z-10 animate-pulse text-white/40 group-hover:text-white/70 transition-colors">
          <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-1.5">
            <div className="w-1.5 h-3 bg-current rounded-full animate-bounce" style={{ animationDuration: '1.5s' }} />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] whitespace-nowrap">
            Scroll page to scrub sequence
          </span>
        </div>
      )}
    </div>
  );
}

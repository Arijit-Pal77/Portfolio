import React, { useEffect, useRef, useState } from 'react';

export default function BackgroundScrubber() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const TOTAL_FRAMES = 240;
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preloader and helper states
  const [preloaderActive, setPreloaderActive] = useState(true);
  const [preloaderFadeOut, setPreloaderFadeOut] = useState(false);
  const [showScrollHelper, setShowScrollHelper] = useState(true);

  // Interpolation targets and current values
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);

  // Preload images from public folder
  useEffect(() => {
    let active = true;
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    const handleProgress = () => {
      if (!active) return;
      count++;
      setLoadedCount(count);
      if (count === TOTAL_FRAMES) {
        setImages(loadedImages);
        setIsLoaded(true);
        // Hiding preloader overlay smoothly with visual transitions
        setTimeout(() => {
          setPreloaderFadeOut(true);
          setTimeout(() => {
            setPreloaderActive(false);
          }, 800);
        }, 500);
      }
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/Photos/ezgif-frame-${frameNum}.png`;
      img.onload = handleProgress;
      img.onerror = handleProgress;
      loadedImages.push(img);
    }

    return () => {
      active = false;
    };
  }, []);

  // Handle resize of canvas viewport
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

      renderFrame(Math.round(currentFrameRef.current));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, images]);

  // Track scroll behavior to map scroll position to active frame index
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Fade out scroll indicator helper after initial scrolling
      if (scrollTop > 80) {
        setShowScrollHelper(false);
      } else {
        setShowScrollHelper(true);
      }

      // Calculate progress mapped to sequence index
      const progress = scrollHeight > 0 ? Math.max(0, Math.min(1, scrollTop / scrollHeight)) : 0;

      // Update targets
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial run to set values based on current position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Interpolation loop to smooth frame changes
  useEffect(() => {
    let animFrameId: number;
    const scrubInertia = 0.12;

    const loop = () => {
      // Interpolate Frame
      const frameDiff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(frameDiff) < 0.01) {
        currentFrameRef.current = targetFrameRef.current;
      } else {
        currentFrameRef.current += frameDiff * scrubInertia;
      }

      renderFrame(Math.round(currentFrameRef.current));
      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameId);
  }, [isLoaded, images]);

  const renderFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !images[frameIdx]) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

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
  };

  const percentage = Math.round((loadedCount / TOTAL_FRAMES) * 100) || 0;

  return (
    <>
      {/* Full-screen Preloader Screen */}
      {preloaderActive && (
        <div
          className={`fixed inset-0 w-full h-full bg-[#030303] flex items-center justify-center z-[9999] transition-opacity duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${preloaderFadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
            }`}
        >
          {/* Cyber grid background */}
          <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

          {/* Scanline animation overlay */}
          <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />

          {/* Glowing background blooms */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-electric-cyan/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary-amber/5 blur-[120px] pointer-events-none" />

          {/* Central Frame */}
          <div className="relative w-[340px] sm:w-[420px] glass-cyber p-8 rounded-2xl border border-electric-cyan/20 flex flex-col items-center justify-center space-y-6 shadow-[0_0_40px_rgba(0,243,255,0.06)] select-none">
            {/* Glowing Corner Accents */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-electric-cyan"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-electric-cyan"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-electric-cyan"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-electric-cyan"></div>

            {/* Title / Diagnostic Info */}
            <div className="w-full text-center space-y-1">
              <div className="font-mono text-[10px] text-electric-cyan uppercase tracking-widest flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-electric-cyan rounded-full animate-ping" />
                SYSTEM DIAGNOSTICS
              </div>
              <h1 className="font-headline text-2xl font-bold text-white tracking-tight uppercase">
                Loading Mainframe
              </h1>
            </div>

            {/* Percentage Display */}
            <div className="relative flex items-center justify-center">
              <div className="font-mono text-5xl font-extrabold text-white tracking-tighter neon-text-cyan">
                {percentage}%
              </div>
            </div>

            {/* Custom Glowing Progress Bar */}
            <div className="w-full space-y-2">
              <div className="h-2 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden p-[2px]">
                <div
                  className="h-full bg-gradient-to-r from-electric-cyan via-blue-500 to-primary-amber rounded-full shadow-[0_0_10px_rgba(0,243,255,0.4)] transition-all duration-300 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Scroll Indicator */}
      <div
        className="scroll-helper"
        style={{
          opacity: showScrollHelper && isLoaded ? 1 : 0,
          pointerEvents: 'none',
        }}
      >
        <span className="scroll-mouse">
          <span className="scroll-wheel"></span>
        </span>
        <span className="scroll-text">Scroll to Experience</span>
      </div>

      <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-20 bg-[#020202]" style={{ willChange: 'transform' }}>
        {/* Photo sequence canvas */}
        <canvas ref={canvasRef} className="block w-full h-full" style={{ opacity: 1 }} />

        {/* Clean radial gradient vignette overlay matching standalone Background/styles.css */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 30%, #020202 95%)',
            opacity: 0.65
          }}
        />
      </div>
    </>
  );
}

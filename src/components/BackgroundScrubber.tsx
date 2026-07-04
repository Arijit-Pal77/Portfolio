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
    const scrubInertia = 0.08;
    
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
  const strokeOffset = 314 - (loadedCount / TOTAL_FRAMES) * 314;

  return (
    <>
      {/* Full-screen Preloader Screen */}
      {preloaderActive && (
        <div 
          className={`preloader-overlay ${preloaderFadeOut ? 'opacity-0 pointer-events-none' : 'pointer-events-auto'}`}
        >
          <div className="preloader-content">
            <div className="spinner-container">
              <svg className="progress-ring" width="120" height="120">
                <circle className="progress-ring__circle-bg" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" r="50" cx="60" cy="60"/>
                <circle 
                  className="progress-ring__circle" 
                  stroke="url(#spinner-gradient)" 
                  strokeWidth="6" 
                  fill="transparent" 
                  r="50" 
                  cx="60" 
                  cy="60"
                  style={{
                    strokeDasharray: 314,
                    strokeDashoffset: strokeOffset
                  }}
                />
                <defs>
                  <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="loading-percent">{percentage}%</div>
            </div>
            <h1 className="loading-title">Loading Sequence</h1>
            <p className="loading-subtitle">Caching cinematic frame sequence...</p>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="loading-status">{loadedCount} / {TOTAL_FRAMES} frames loaded</div>
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

      <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-20 bg-[#020202]">
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

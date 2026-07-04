/**
 * Pure Scroll Sequence Background Player
 * Minimal standalone scroll-driven canvas scrubbing sequence
 */

(function () {
  'use strict';

  // Config parameters
  const TOTAL_FRAMES = 240;
  const IMAGE_DIR = 'Photos';
  const IMAGE_PREFIX = 'ezgif-frame-';
  const IMAGE_EXT = 'png';
  const SCRUB_INERTIA = 0.08; // Lerp smoothing factor

  // State variables
  const state = {
    images: [],
    loadedCount: 0,
    currentFrameIndex: 0,
    targetFrameIndex: 0
  };

  // DOM Elements
  const dom = {
    preloader: document.getElementById('preloader'),
    loadingPercent: document.getElementById('loading-percent'),
    loadingBar: document.getElementById('loading-bar'),
    loadingCircle: document.getElementById('preloader-circle'),
    loadingStatus: document.getElementById('loading-status'),
    canvas: document.getElementById('sequence-canvas'),
    viewport: document.getElementById('canvas-viewport'),
    scrollHelper: document.getElementById('scroll-helper')
  };

  const ctx = dom.canvas.getContext('2d');

  // Preloading sequence images
  function initPreloader() {
    const circleRadius = 50;
    const circumference = 2 * Math.PI * circleRadius;
    dom.loadingCircle.style.strokeDasharray = `${circumference}`;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const frameNum = String(i).padStart(3, '0');
      const imgPath = `${IMAGE_DIR}/${IMAGE_PREFIX}${frameNum}.${IMAGE_EXT}`;

      const img = new Image();
      img.src = imgPath;
      img.onload = () => handleImageLoad(i);
      img.onerror = () => handleImageError(i, imgPath);
      state.images.push(img);
    }
  }

  function handleImageLoad(index) {
    state.loadedCount++;
    const progress = state.loadedCount / TOTAL_FRAMES;
    const percentage = Math.round(progress * 100);

    // Update loader text and bar
    dom.loadingPercent.textContent = `${percentage}%`;
    dom.loadingBar.style.width = `${percentage}%`;
    dom.loadingStatus.textContent = `${state.loadedCount} / ${TOTAL_FRAMES} frames loaded`;

    // SVG Circle offset update
    const circleRadius = 50;
    const circumference = 2 * Math.PI * circleRadius;
    const strokeOffset = circumference - progress * circumference;
    dom.loadingCircle.style.strokeDashoffset = strokeOffset;

    if (state.loadedCount === TOTAL_FRAMES) {
      setTimeout(completePreload, 500);
    }
  }

  function handleImageError(index, path) {
    console.warn(`Could not load frame ${index} at: ${path}`);
    // Count it anyway to avoid stalling the experience
    handleImageLoad(index);
  }

  function completePreload() {
    // Hide preloader overlay smoothly
    dom.preloader.style.opacity = 0;
    dom.preloader.style.pointerEvents = 'none';
    setTimeout(() => {
      dom.preloader.style.display = 'none';
    }, 800);

    // Set up canvas sizing
    resizeCanvas();
    renderFrame(0);

    // Start smoothing animation loop
    requestAnimationFrame(animationLoop);

    // Event listeners for interactivity
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    // Execute scroll calculation once to establish start position
    handleScroll();
  }

  // Handle high-DPI scaling and fit sizing
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = dom.viewport.getBoundingClientRect();

    dom.canvas.width = rect.width * dpr;
    dom.canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    // Redraw immediately on resize
    renderFrame(Math.round(state.currentFrameIndex));
  }

  // Draw target frame on canvas with letterbox cover fitting
  function renderFrame(index) {
    if (!state.images[index]) return;

    const img = state.images[index];
    const canvasWidth = dom.canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = dom.canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Object-fit: cover computations
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgRatio;
      drawHeight = canvasHeight;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  // Calculate target frame index on scroll
  function handleScroll() {
    const scrollTop = window.scrollY;
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollMax <= 0) return;

    const progress = Math.max(0, Math.min(1, scrollTop / scrollMax));

    // Map scroll percentage directly to target frame index
    state.targetFrameIndex = progress * (TOTAL_FRAMES - 1);

    // Fade out indicator helper after initial scrolling
    if (scrollTop > 80) {
      dom.scrollHelper.style.opacity = 0;
      dom.scrollHelper.style.pointerEvents = 'none';
    } else {
      dom.scrollHelper.style.opacity = 1;
    }
  }

  // Smooth lerp rendering loop
  function animationLoop() {
    const diff = state.targetFrameIndex - state.currentFrameIndex;

    // Snapping logic if distance is negligible
    if (Math.abs(diff) < 0.01) {
      state.currentFrameIndex = state.targetFrameIndex;
    } else {
      state.currentFrameIndex += diff * SCRUB_INERTIA;
    }

    renderFrame(Math.round(state.currentFrameIndex));
    requestAnimationFrame(animationLoop);
  }

  // Initialize loading process
  document.addEventListener('DOMContentLoaded', initPreloader);
})();

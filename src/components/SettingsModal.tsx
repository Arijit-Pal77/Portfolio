import React, { useState } from 'react';
import { Settings, ShieldAlert, Cpu, X, Volume2, Eye, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  crtActive: boolean;
  setCrtActive: (active: boolean) => void;
  ambientGlow: number;
  setAmbientGlow: (glow: number) => void;
  soundEffects: boolean;
  setSoundEffects: (active: boolean) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  crtActive,
  setCrtActive,
  ambientGlow,
  setAmbientGlow,
  soundEffects,
  setSoundEffects
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'display' | 'audio' | 'security'>('display');

  const handleReset = () => {
    setCrtActive(true);
    setAmbientGlow(60);
    setSoundEffects(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Animated backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="w-full max-w-xl rounded-2xl overflow-hidden border border-electric-cyan/20 bg-[#070707] shadow-[0_0_25px_rgba(0,243,255,0.2)] flex flex-col relative p-6 z-10"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h4 className="font-headline text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-electric-cyan animate-spin" style={{ animationDuration: '8s' }} />
            Mainframe Configuration Grid
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Configure display, terminal telemetry, and security protocols of the portfolio container.
          </p>
        </div>

        {/* Inner layout split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[260px]">
          
          {/* Left Navigation tabs */}
          <div className="md:col-span-4 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 pr-0 md:pr-4">
            <button
              onClick={() => setActiveTab('display')}
              className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-mono tracking-wider transition-all cursor-pointer ${
                activeTab === 'display'
                  ? 'bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/30 shadow-[0_0_10px_rgba(0,243,255,0.1)]'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              DISPLAY
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-mono tracking-wider transition-all cursor-pointer ${
                activeTab === 'audio'
                  ? 'bg-primary-amber/10 text-primary-amber border border-primary-amber/30 shadow-[0_0_10px_rgba(255,183,0,0.1)]'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              AUDIO
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-mono tracking-wider transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-primary-orange/10 text-primary-orange border border-primary-orange/30 shadow-[0_0_10px_rgba(236,122,1,0.1)]'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              SECURITY
            </button>
          </div>

          {/* Right Contents pane */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {activeTab === 'display' && (
                <motion.div
                  key="display"
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="space-y-5"
                >
                  <div className="flex justify-between items-center bg-black/40 border border-white/5 p-3 rounded-lg">
                    <div>
                      <span className="block text-xs font-bold text-white uppercase font-mono">CRT Scanlines</span>
                      <span className="text-[10px] text-slate-500">Inject retro cathode-ray tube filter</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={crtActive}
                        onChange={(e) => setCrtActive(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-electric-cyan/20 peer-checked:after:bg-electric-cyan peer-checked:after:border-electric-cyan border border-white/10" />
                    </label>
                  </div>

                  <div className="bg-black/40 border border-white/5 p-3 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="block text-xs font-bold text-white uppercase font-mono">Ambient Bloom</span>
                      <span className="text-xs font-mono text-electric-cyan font-bold">{ambientGlow}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={ambientGlow}
                      onChange={(e) => setAmbientGlow(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-electric-cyan"
                    />
                    <span className="block text-[10px] text-slate-500 mt-1">Adjust intensity of peripheral neon backlights</span>
                  </div>
                </motion.div>
              )}

              {activeTab === 'audio' && (
                <motion.div
                  key="audio"
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="space-y-5"
                >
                  <div className="flex justify-between items-center bg-black/40 border border-white/5 p-3 rounded-lg">
                    <div>
                      <span className="block text-xs font-bold text-white uppercase font-mono">System Audio Feed</span>
                      <span className="text-[10px] text-slate-500">Enable micro-interaction sound outputs</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={soundEffects}
                        onChange={(e) => setSoundEffects(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-amber/20 peer-checked:after:bg-primary-amber peer-checked:after:border-primary-amber border border-white/10" />
                    </label>
                  </div>
                  
                  <div className="p-3 border border-dashed border-primary-amber/20 bg-primary-amber/5 rounded-lg font-mono text-[10px] text-primary-amber">
                    INFO: Sound synthesis libraries are offline. Audio triggers are queued.
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="space-y-4 font-mono text-[10px] text-slate-400 bg-black/40 border border-white/5 p-4 rounded-lg"
                >
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500">ENCRYPTION ENGINE</span>
                    <span className="text-green-400 font-bold">ACTIVE (AES-256)</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500">SMTP RELAY NODE</span>
                    <span className="text-electric-cyan font-bold">SECURE (TLSv1.3)</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-500">INTEGRITY MATRIX</span>
                    <span className="text-green-400 font-bold">SECURE (100%)</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white font-mono text-[10px] uppercase rounded transition-all cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Defaults
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-electric-cyan hover:bg-white text-background hover:text-electric-cyan font-mono text-[10px] uppercase rounded transition-all cursor-pointer font-bold"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

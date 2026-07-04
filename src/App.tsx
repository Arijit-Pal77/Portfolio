import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProfileView from './components/ProfileView';
import ProjectsView from './components/ProjectsView';
import SettingsModal from './components/SettingsModal';
import BackgroundScrubber from './components/BackgroundScrubber';
import { PROFILE_DETAILS } from './data';
import { Github, Linkedin, Cpu } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'profile' | 'projects'>('profile');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Interactive Mainframe Settings
  const [crtActive, setCrtActive] = useState<boolean>(true);
  const [ambientGlow, setAmbientGlow] = useState<number>(60);
  const [soundEffects, setSoundEffects] = useState<boolean>(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <div className="min-h-screen text-[#e2e8f0] relative overflow-hidden">
      {/* Cinematic Film Grain */}
      <div className="film-grain" />

      {/* Cinematic Scroll-Driven Background Photo Sequence */}
      <BackgroundScrubber />

      {/* Decorative ambient lighting bloom */}
      <div 
        className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-electric-cyan/5 blur-[120px] pointer-events-none transition-opacity duration-300"
        style={{ opacity: ambientGlow / 100 }}
      ></div>
      <div 
        className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-primary-orange/5 blur-[120px] pointer-events-none transition-opacity duration-300"
        style={{ opacity: ambientGlow / 100 }}
      ></div>

      {/* Global CRT Scanlines Overlay */}
      {crtActive && <div className="scanline pointer-events-none fixed inset-0 z-[90] opacity-15" />}

      {/* Side Vertical Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-28' : 'ml-6 sm:ml-12'} min-h-screen flex flex-col justify-between px-6 sm:px-12 lg:px-24 py-12 relative w-full max-w-[1400px]`}>
        <div className="flex-grow">
          {/* Top Global Navigation Bar Switcher */}
          <div className="sticky top-0 z-40 bg-transparent flex justify-between items-center mb-12 py-4 border-b border-white/5 -mx-6 px-6 sm:-mx-12 sm:px-12 lg:-mx-24 lg:px-24">
            <div className="flex gap-6">
              <button
                onClick={() => setCurrentView('profile')}
                className={`font-headline text-xs font-bold tracking-widest uppercase border-b-2 pb-2 transition-all cursor-pointer ${
                  currentView === 'profile'
                    ? 'text-primary-amber border-primary-amber neon-text-amber'
                    : 'text-slate-500 border-transparent hover:text-white'
                }`}
              >
                PROFILE LOGS
              </button>
              <button
                onClick={() => setCurrentView('projects')}
                className={`font-headline text-xs font-bold tracking-widest uppercase border-b-2 pb-2 transition-all cursor-pointer ${
                  currentView === 'projects'
                    ? 'text-primary-orange border-primary-orange neon-text-orange'
                    : 'text-slate-500 border-transparent hover:text-white'
                }`}
              >
                SOFTWARE PROJECTS
              </button>
            </div>
          </div>

          {/* Render Active View */}
          {currentView === 'profile' ? (
            <ProfileView
              setActiveSection={setActiveSection}
            />
          ) : (
            <ProjectsView />
          )}
        </div>

        {/* Global Footer block branding */}
        <footer className="border-t border-white/5 pt-20 mt-48">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-6 space-y-4 text-left select-none">
              <div className="font-headline font-extrabold text-2xl text-white tracking-tighter">
                {PROFILE_DETAILS.name}
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Architecting the future of software through machine learning, clean diagnostics, and interactive telemetry grids.
              </p>
            </div>

            <div className="md:col-span-6 flex flex-col items-end justify-between gap-6">
              {/* Connect socials links */}
              <div className="flex gap-4">
                <a
                  href={PROFILE_DETAILS.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-electric-cyan hover:border-electric-cyan/40 hover:bg-electric-cyan/5 transition-all"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={PROFILE_DETAILS.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-electric-cyan hover:border-electric-cyan/40 hover:bg-electric-cyan/5 transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={PROFILE_DETAILS.socials.x}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-electric-cyan hover:border-electric-cyan/40 hover:bg-electric-cyan/5 transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>

              {/* Status credits */}
              <div className="font-mono text-[9px] text-slate-500 uppercase tracking-widest text-right select-none">
                © 2026 SYSTEM_ARIJIT. STATUS:{' '}
                <span className="text-electric-cyan font-bold neon-text-cyan">ONLINE</span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Interactive Overlays */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        crtActive={crtActive}
        setCrtActive={setCrtActive}
        ambientGlow={ambientGlow}
        setAmbientGlow={setAmbientGlow}
        soundEffects={soundEffects}
        setSoundEffects={setSoundEffects}
      />
    </div>
  );
}

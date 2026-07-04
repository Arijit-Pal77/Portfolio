import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProfileView from './components/ProfileView';
import ProjectsView from './components/ProjectsView';
import ContactModal from './components/ContactModal';
import BackgroundScrubber from './components/BackgroundScrubber';
import { PROFILE_DETAILS } from './data';
import { Github, Linkedin, Mail, Cpu } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'profile' | 'projects'>('profile');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <div className="min-h-screen text-[#e2e8f0] relative overflow-hidden">
      {/* Cinematic Film Grain */}
      <div className="film-grain" />

      {/* Cinematic Scroll-Driven Background Photo Sequence */}
      <BackgroundScrubber />

      {/* Decorative ambient lighting bloom */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-electric-cyan/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-primary-orange/5 blur-[120px] pointer-events-none"></div>

      {/* Side Vertical Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenContact={() => setIsContactOpen(true)}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Container Layout */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-20' : 'ml-6 sm:ml-12'} min-h-screen flex flex-col justify-between px-6 sm:px-12 lg:px-24 py-12 relative max-w-7xl`}>
        <div className="flex-grow">
          {/* Top Global Navigation Bar Switcher */}
          <div className="flex justify-between items-center mb-16 border-b border-white/5 pb-6">
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
              onOpenContact={() => setIsContactOpen(true)}
              setActiveSection={setActiveSection}
            />
          ) : (
            <ProjectsView
              onOpenContact={() => setIsContactOpen(true)}
            />
          )}
        </div>

        {/* Global Footer block branding */}
        <footer className="border-t border-white/5 pt-16 mt-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-6 space-y-4 text-center md:text-left select-none">
              <div className="font-headline font-extrabold text-2xl text-white tracking-tighter">
                {PROFILE_DETAILS.name}
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Architecting the future of software through machine learning, clean diagnostics, and interactive telemetry grids.
              </p>
            </div>

            <div className="md:col-span-6 flex flex-col items-center md:items-end justify-between gap-6">
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
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-electric-cyan hover:border-electric-cyan/40 hover:bg-electric-cyan/5 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>

              {/* Status credits */}
              <div className="font-mono text-[9px] text-slate-500 uppercase tracking-widest text-center md:text-right select-none">
                © 2026 SYSTEM_ARIJIT. STATUS:{' '}
                <span className="text-electric-cyan font-bold neon-text-cyan">ONLINE</span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Interactive Overlays */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}

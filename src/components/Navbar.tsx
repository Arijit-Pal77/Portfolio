import React from 'react';
import { Home, User, GraduationCap, Layers, Terminal, Send, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { TabId } from '../types';

interface NavbarProps {
  currentView: 'profile' | 'projects';
  setCurrentView: (view: 'profile' | 'projects') => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onOpenSettings: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Navbar({
  currentView,
  setCurrentView,
  activeSection,
  setActiveSection,
  onOpenSettings,
  isSidebarOpen,
  setIsSidebarOpen
}: NavbarProps) {

  const handleNavClick = (view: 'profile' | 'projects', sectionId?: string) => {
    setCurrentView(view);
    if (sectionId) {
      setActiveSection(sectionId);
      // Wait for React to render/switch, then smooth scroll
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);
    }
  };

  return (
    <nav className={`fixed z-50 border border-electric-cyan/20 bg-[#050505]/80 backdrop-blur-xl select-none transition-all duration-300
      /* Mobile: horizontal bottom bar */
      bottom-0 left-0 right-0 h-16 flex flex-row items-center justify-around px-4 rounded-t-2xl
      /* Desktop: vertical left sidebar */
      md:bottom-4 md:left-4 md:top-4 md:right-auto md:h-auto md:w-20 md:rounded-2xl md:flex-col md:items-center md:py-10 md:justify-between md:px-0 ${
      isSidebarOpen ? 'md:translate-x-0' : 'md:-translate-x-[calc(100%+1.5rem)]'
    }`}>
      {/* Brand Logo Header - hidden on mobile bottom bar, shown on desktop sidebar */}
      <div className="hidden md:flex flex-col items-center gap-4">
        <div 
          onClick={() => handleNavClick('profile', 'home')}
          className="w-10 h-10 rounded-xl border border-electric-cyan/25 overflow-hidden shadow-[0_0_15px_rgba(0,243,255,0.15)] hover:shadow-[0_0_25px_rgba(0,243,255,0.35)] hover:border-electric-cyan/50 hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center bg-black"
        >
          <img 
            src="/Photos/avatar.jpeg" 
            className="w-full h-full object-cover" 
            alt="Arijit Pal"
          />
        </div>
        <div 
          onClick={() => handleNavClick('profile', 'home')}
          className="font-headline font-bold text-base tracking-widest neon-text-cyan vertical-text cursor-pointer hover:opacity-80 transition-all duration-300"
        >
          ARIJIT PAL
        </div>
      </div>

      {/* Nav Icons list */}
      <div className="flex flex-row gap-6 items-center md:flex-col md:gap-9">
        {/* Home */}
        <button
          onClick={() => handleNavClick('profile', 'home')}
          className="group relative cursor-pointer"
        >
          <Home className={`w-5.5 h-5.5 transition-all duration-300 ${
            currentView === 'profile' && activeSection === 'home'
              ? 'text-primary-amber neon-text-amber scale-110'
              : 'text-electric-cyan/60 hover:text-electric-cyan'
          }`} />
          <span className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-[#101010] border border-electric-cyan/20 text-[10px] font-mono text-electric-cyan opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded">
            Home
          </span>
        </button>

        {/* About */}
        <button
          onClick={() => handleNavClick('profile', 'about')}
          className="group relative cursor-pointer"
        >
          <User className={`w-5.5 h-5.5 transition-all duration-300 ${
            currentView === 'profile' && activeSection === 'about'
              ? 'text-primary-amber neon-text-amber scale-110'
              : 'text-electric-cyan/60 hover:text-electric-cyan'
          }`} />
          <span className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-[#101010] border border-electric-cyan/20 text-[10px] font-mono text-electric-cyan opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded">
            About
          </span>
        </button>

        {/* Education */}
        <button
          onClick={() => handleNavClick('profile', 'education')}
          className="group relative cursor-pointer"
        >
          <GraduationCap className={`w-5.5 h-5.5 transition-all duration-300 ${
            currentView === 'profile' && activeSection === 'education'
              ? 'text-primary-amber neon-text-amber scale-110'
              : 'text-electric-cyan/60 hover:text-electric-cyan'
          }`} />
          <span className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-[#101010] border border-electric-cyan/20 text-[10px] font-mono text-electric-cyan opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded">
            Education
          </span>
        </button>

        {/* Projects */}
        <button
          onClick={() => handleNavClick('projects')}
          className="group relative cursor-pointer"
        >
          <Layers className={`w-5.5 h-5.5 transition-all duration-300 ${
            currentView === 'projects'
              ? 'text-primary-orange neon-text-orange scale-110'
              : 'text-electric-cyan/60 hover:text-electric-cyan'
          }`} />
          <span className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-[#101010] border border-electric-cyan/20 text-[10px] font-mono text-electric-cyan opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded">
            Projects
          </span>
        </button>
      </div>

      {/* Settings Action Button */}
      <button
        onClick={onOpenSettings}
        className="bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan p-2.5 rounded-lg hover:bg-electric-cyan hover:text-background transition-all duration-300 cursor-pointer shadow-[0_0_10px_rgba(0,243,255,0.15)] group relative"
        title="Settings"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-[#101010] border border-electric-cyan/20 text-[10px] font-mono text-electric-cyan opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded pointer-events-none">
          Settings
        </span>
      </button>

      {/* absolute sidebar toggle button - desktop only */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="hidden md:flex w-9 h-9 absolute top-6 -right-9 border border-l-0 border-electric-cyan/20 bg-[#050505]/45 backdrop-blur-xl text-electric-cyan/60 rounded-r-lg items-center justify-center hover:text-electric-cyan hover:bg-electric-cyan/5 hover:border-electric-cyan/40 transition-all cursor-pointer shadow-[2px_0_10px_rgba(0,0,0,0.5)]"
        title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </nav>
  );
}

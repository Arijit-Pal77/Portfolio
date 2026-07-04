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
    <nav className={`fixed left-4 top-4 bottom-4 w-20 z-50 border border-electric-cyan/20 bg-[#050505]/45 backdrop-blur-xl rounded-2xl flex flex-col items-center py-10 justify-between select-none transition-all duration-300 ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1.5rem)]'
    }`}>
      {/* Brand Logo Header */}
      <div className="flex flex-col items-center gap-4">
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
      <div className="flex flex-col gap-9 items-center">
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
          <span className="absolute left-full ml-4 px-2 py-1 bg-[#101010] border border-electric-cyan/20 text-[10px] font-mono text-electric-cyan opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded">
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
          <span className="absolute left-full ml-4 px-2 py-1 bg-[#101010] border border-electric-cyan/20 text-[10px] font-mono text-electric-cyan opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded">
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
          <span className="absolute left-full ml-4 px-2 py-1 bg-[#101010] border border-electric-cyan/20 text-[10px] font-mono text-electric-cyan opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded">
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
          <span className="absolute left-full ml-4 px-2 py-1 bg-[#101010] border border-electric-cyan/20 text-[10px] font-mono text-electric-cyan opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded">
            Projects
          </span>
        </button>
      </div>

      {/* Settings Action Button at bottom */}
      <button
        onClick={onOpenSettings}
        className="bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan p-2.5 rounded-lg hover:bg-electric-cyan hover:text-background transition-all duration-300 cursor-pointer shadow-[0_0_10px_rgba(0,243,255,0.15)] group relative"
        title="Settings"
      >
        <Settings className="w-4 h-4" />
        <span className="absolute left-full ml-4 px-2 py-1 bg-[#101010] border border-electric-cyan/20 text-[10px] font-mono text-electric-cyan opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded pointer-events-none">
          Settings
        </span>
      </button>

      {/* absolute sidebar toggle button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="w-9 h-9 absolute top-6 -right-9 border border-l-0 border-electric-cyan/20 bg-[#050505]/45 backdrop-blur-xl text-electric-cyan/60 rounded-r-lg flex items-center justify-center hover:text-electric-cyan hover:bg-electric-cyan/5 hover:border-electric-cyan/40 transition-all cursor-pointer shadow-[2px_0_10px_rgba(0,0,0,0.5)]"
        title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </nav>
  );
}

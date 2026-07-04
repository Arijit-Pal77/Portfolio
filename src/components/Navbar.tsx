import React from 'react';
import { Home, User, GraduationCap, Layers, Terminal, Send, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { TabId } from '../types';
import { motion, AnimatePresence } from 'motion/react';

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
    // Skip scroll if already on the same view and section
    if (currentView === view && (!sectionId || activeSection === sectionId)) {
      return;
    }
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

  const isNavActive = (view: 'profile' | 'projects', section?: string) => {
    if (section) return currentView === view && activeSection === section;
    return currentView === view;
  };

  // Nav item component with smooth spring-animated active indicator
  const NavItem = ({ 
    icon: Icon, 
    label, 
    view, 
    section,
    activeColor = 'amber'
  }: { 
    icon: React.ElementType; 
    label: string; 
    view: 'profile' | 'projects'; 
    section?: string;
    activeColor?: 'amber' | 'orange';
  }) => {
    const active = section ? isNavActive(view, section) : isNavActive(view);
    const colorClasses = activeColor === 'orange' 
      ? { active: 'text-primary-orange', glow: 'neon-text-orange', dot: 'bg-primary-orange' }
      : { active: 'text-primary-amber', glow: 'neon-text-amber', dot: 'bg-primary-amber' };

    return (
      <button
        onClick={() => handleNavClick(view, section)}
        className="group relative cursor-pointer"
      >
        <motion.div
          animate={{
            scale: active ? 1.15 : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Icon className={`w-5.5 h-5.5 transition-colors duration-300 ${
            active
              ? `${colorClasses.active} ${colorClasses.glow}`
              : 'text-electric-cyan/60 hover:text-electric-cyan'
          }`} />
        </motion.div>
        
        {/* Active dot indicator */}
        <AnimatePresence>
          {active && (
            <motion.div
              className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${colorClasses.dot} md:left-auto md:-right-2.5 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </AnimatePresence>

        {/* Tooltip with smooth fade+slide */}
        <span className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-[#101010] border border-electric-cyan/20 text-[10px] font-mono text-electric-cyan opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap rounded pointer-events-none">
          {label}
        </span>
      </button>
    );
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
      <div className="hidden md:flex flex-col items-center gap-3">
        <motion.div 
          onClick={() => handleNavClick('profile', 'home')}
          className="group w-12 h-12 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,243,255,0.15)] hover:shadow-[0_0_25px_rgba(0,243,255,0.35)] transition-all duration-300 cursor-pointer flex items-center justify-center bg-[#0a0a0a] border border-electric-cyan/20 hover:border-electric-cyan/50"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <img 
            src="/Photos/logo.jpeg" 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
            alt="AP Logo"
          />
        </motion.div>
        <div 
          onClick={() => handleNavClick('profile', 'home')}
          className="font-headline font-bold text-sm tracking-widest neon-text-cyan vertical-text cursor-pointer hover:opacity-80 transition-all duration-300"
        >
          ARIJIT PAL
        </div>
      </div>

      {/* Nav Icons list */}
      <div className="flex flex-row gap-6 items-center md:flex-col md:gap-9">
        <NavItem icon={Home} label="Home" view="profile" section="home" />
        <NavItem icon={User} label="About" view="profile" section="about" />
        <NavItem icon={GraduationCap} label="Education" view="profile" section="education" />
        <NavItem icon={Layers} label="Projects" view="projects" activeColor="orange" />
      </div>

      {/* Settings Action Button */}
      <motion.button
        onClick={onOpenSettings}
        className="bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan p-2.5 rounded-lg hover:bg-electric-cyan hover:text-background transition-all duration-300 cursor-pointer shadow-[0_0_10px_rgba(0,243,255,0.15)] group relative"
        title="Settings"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <Settings className="w-4 h-4" />
        <span className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-[#101010] border border-electric-cyan/20 text-[10px] font-mono text-electric-cyan opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap rounded pointer-events-none">
          Settings
        </span>
      </motion.button>

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

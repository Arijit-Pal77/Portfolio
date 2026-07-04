import React, { useState } from 'react';
import { Eye, Code, Layers, Video, Mail, FileText, Cpu, ChevronRight, Play, Gamepad2 } from 'lucide-react';
import { PROJECTS, PROFILE_DETAILS } from '../data';
import { Project } from '../types';
import DiseaseScanner from './DiseaseScanner';
import CaptionerDemo from './CaptionerDemo';
import SnakeGame from './SnakeGame';
import TicTacToeGame from './TicTacToeGame';

interface ProjectsViewProps {
  onOpenContact: () => void;
}

export default function ProjectsView({ onOpenContact }: ProjectsViewProps) {
  const [activeInteractiveId, setActiveInteractiveId] = useState<string | null>(null);

  const getInteractiveComponent = (id: string) => {
    switch (id) {
      case 'plant-disease':
        return <DiseaseScanner />;
      case 'video-captioner':
        return <CaptionerDemo />;
      case 'python-snake':
        return <SnakeGame />;
      case 'tictactoe-ai':
        return <TicTacToeGame />;
      case 'auto-wisher':
        return (
          <div className="w-full glass-cyber p-6 rounded-2xl border-secondary/20 font-mono text-xs">
            <h4 className="font-headline text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-electric-cyan" />
              SMTP Bulk Mailer Staging Area
            </h4>
            <div className="bg-black/60 p-4 border border-white/5 rounded-lg mb-4 space-y-2">
              <div><span className="text-slate-400 font-medium">MAPPING VECTOR:</span> <span className="text-electric-cyan font-bold">pandas.DataFrame(db_logs.csv)</span></div>
              <div><span className="text-slate-400 font-medium">SENDER PIPELINE:</span> <span className="text-slate-200">automated-daemon@arijitpal.com</span></div>
              <div><span className="text-slate-400 font-medium">TEMPLATE FORMAT:</span> <span className="text-slate-200">"Greetings, {'{user_name}'}! Host server marks another solar rotation."</span></div>
            </div>
            <button
              onClick={() => {
                alert("AUTOMATION DEPLOYED: SMTP socket bound. Sending signals in background.");
              }}
              className="px-5 py-2.5 bg-primary-orange text-background font-bold uppercase tracking-widest text-[10px] rounded hover:neon-border-orange hover:bg-black hover:text-primary-orange transition-all cursor-pointer"
            >
              Exert Bulk Trigger
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative scanline py-12">
      {/* Header Section */}
      <header className="mb-24 relative select-none">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary-orange/10 border border-primary-orange/30 text-primary-orange mb-8 clip-path-polygon">
          <Code className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Data Repository / Selected Works</span>
        </div>
        <h1 className="font-headline text-5xl lg:text-7xl font-bold tracking-tight mb-6">
          Engineering <br />
          <span className="neon-text-orange italic">Intelligent</span>{' '}
          <span className="text-white opacity-90">Solutions.</span>
        </h1>
        <p className="font-mono text-[10px] sm:text-xs text-electric-cyan/70 max-w-2xl leading-relaxed border-l-2 border-electric-cyan/30 pl-6 uppercase tracking-wider">
          SYSTEM_LOG: A collection of projects spanning Deep Learning, automation, and interactive web experiences. Each piece represents a journey in technical problem-solving.
        </p>
      </header>

      {/* Interactive Playground Sandbox */}
      {activeInteractiveId && (
        <div className="mb-16 border-t border-b border-electric-cyan/20 bg-electric-cyan/[0.01] py-8 relative">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-mono text-primary-orange uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-primary-orange animate-pulse" />
                Live Matrix Sandpit: {PROJECTS.find(p => p.id === activeInteractiveId)?.title}
              </span>
              <button
                onClick={() => setActiveInteractiveId(null)}
                className="text-xs font-mono text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                [ Shut Down Container ]
              </button>
            </div>
            {getInteractiveComponent(activeInteractiveId)}
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-32">
        {/* Plant Disease Detection (Large Featured) */}
        <article className="md:col-span-8 group">
          <div className="glass-cyber clip-corner h-full flex flex-col relative overflow-hidden group-hover:neon-border-orange transition-all duration-500">
            <div className="relative h-80 overflow-hidden border-b border-primary-orange/20">
              <img
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                src={PROJECTS[0].image}
                alt={PROJECTS[0].title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
            </div>
            <div className="p-8 lg:p-10 flex-grow relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-headline text-3xl font-bold text-white group-hover:neon-text-orange transition-colors">
                    {PROJECTS[0].title}
                  </h3>
                  <button
                    onClick={() => setActiveInteractiveId(PROJECTS[0].id)}
                    className="text-electric-cyan hover:scale-115 transition-all cursor-pointer"
                    title="Launch Live Container"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
                <p className="font-body text-sm text-slate-300 mb-8 leading-relaxed max-w-xl font-medium">
                  {PROJECTS[0].description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-auto">
                {PROJECTS[0].tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-electric-cyan/10 border border-electric-cyan/30 font-mono text-[10px] text-electric-cyan uppercase tracking-tighter font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {/* Decorative Corner */}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary-orange/20 pointer-events-none"></div>
          </div>
        </article>

        {/* AI Video Caption Generator */}
        <article className="md:col-span-4 group">
          <div className="glass-cyber clip-corner h-full flex flex-col group-hover:neon-border-cyan transition-all duration-500">
            <div className="relative h-64 overflow-hidden border-b border-electric-cyan/20">
              <img
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                src={PROJECTS[1].image}
                alt={PROJECTS[1].title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-electric-cyan/5 group-hover:bg-transparent transition-colors"></div>
              <button
                onClick={() => setActiveInteractiveId(PROJECTS[1].id)}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-electric-cyan/80 text-background flex items-center justify-center hover:bg-white transition-colors cursor-pointer shadow-[0_0_15px_rgba(0,243,255,0.6)] scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            </div>
            <div className="p-8">
              <h3 className="font-headline text-xl font-bold text-white mb-3 group-hover:neon-text-cyan transition-colors">
                {PROJECTS[1].title}
              </h3>
              <p className="text-xs text-slate-300 mb-8 leading-relaxed font-medium">
                {PROJECTS[1].description}
              </p>
              <div className="flex flex-wrap gap-2">
                {PROJECTS[1].tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/10 border border-white/15 text-electric-cyan font-mono text-[9px] uppercase font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Automatic Birthday Wisher */}
        <article className="md:col-span-4 group">
          <div className="glass-cyber clip-corner h-full p-8 border-l-4 border-l-primary-orange/40 relative group-hover:neon-border-orange transition-all duration-500">
            <div className="flex justify-between mb-8 select-none">
              <div className="w-12 h-12 bg-primary-orange/10 border border-primary-orange/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary-orange" />
              </div>
            </div>
            <h3 className="font-headline text-xl font-bold text-white mb-4">
              {PROJECTS[2].title}
            </h3>
            <p className="text-xs text-slate-300 mb-8 leading-relaxed font-medium">
              {PROJECTS[2].description}
            </p>
            <div className="flex justify-between items-center mt-auto">
              <div className="flex gap-3 text-electric-cyan font-mono text-[9px] uppercase tracking-widest font-bold">
                <span>Pandas</span>
                <span className="text-slate-700">•</span>
                <span>SMTP</span>
              </div>
              <button
                onClick={() => setActiveInteractiveId(PROJECTS[2].id)}
                className="text-[10px] font-mono text-primary-orange hover:neon-text-orange transition-all cursor-pointer uppercase"
              >
                Run [EXE]
              </button>
            </div>
          </div>
        </article>

        {/* Snake Game */}
        <article className="md:col-span-4 group">
          <div className="glass-cyber clip-corner h-full p-8 relative overflow-hidden group-hover:neon-border-cyan transition-all duration-500">
            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none select-none">
              <Gamepad2 className="w-28 h-28" />
            </div>
            <h3 className="font-headline text-xl font-bold text-white mb-4 group-hover:neon-text-cyan transition-colors">
              {PROJECTS[3].title}
            </h3>
            <p className="text-xs text-slate-300 mb-10 leading-relaxed font-medium">
              {PROJECTS[3].description}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-400 uppercase">Engine</span>
                  <span className="font-mono text-xs text-electric-cyan font-bold">PyGame</span>
                </div>
                <div className="w-px h-6 bg-electric-cyan/20"></div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-400 uppercase">Ver</span>
                  <span className="font-mono text-xs text-electric-cyan font-bold">2.0.23</span>
                </div>
              </div>
              <button
                onClick={() => setActiveInteractiveId(PROJECTS[3].id)}
                className="text-[10px] font-mono text-electric-cyan hover:neon-text-cyan transition-all cursor-pointer uppercase border border-electric-cyan/30 px-3 py-1 bg-electric-cyan/10 rounded font-bold"
              >
                PLAY GAME
              </button>
            </div>
          </div>
        </article>

        {/* Tic Tac Toe AI */}
        <article className="md:col-span-4 group">
          <div className="glass-cyber clip-corner h-full p-8 border-r-4 border-r-electric-cyan/40 group-hover:neon-border-cyan transition-all duration-500 flex flex-col justify-between">
            <div>
              <h3 className="font-headline text-xl font-bold text-white mb-4">
                {PROJECTS[4].title}
              </h3>
              <p className="text-xs text-slate-300 mb-8 leading-relaxed font-medium">
                {PROJECTS[4].description}
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 font-mono text-[10px] text-electric-cyan font-bold select-none">
                  <span className="w-1.5 h-1.5 bg-electric-cyan"></span>
                  Minimax Implementation
                </li>
                <li className="flex items-center gap-3 font-mono text-[10px] text-electric-cyan font-bold select-none">
                  <span className="w-1.5 h-1.5 bg-electric-cyan"></span>
                  Heuristic Evaluation
                </li>
              </ul>
            </div>
            <div className="flex justify-between items-center mt-auto">
              <span className="px-3 py-1 bg-electric-cyan/10 border border-electric-cyan/30 rounded-sm font-mono text-[9px] text-electric-cyan uppercase tracking-widest select-none">
                Algorithmic Theory
              </span>
              <button
                onClick={() => setActiveInteractiveId(PROJECTS[4].id)}
                className="text-[10px] font-mono text-electric-cyan hover:neon-text-cyan transition-all cursor-pointer uppercase font-bold"
              >
                CHALLENGE AI
              </button>
            </div>
          </div>
        </article>
      </div>


    </div>
  );
}

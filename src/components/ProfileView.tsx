import React, { useEffect, useRef, useState } from 'react';
import { Mail, Download, Code, GraduationCap, Cpu, ShieldCheck, MapPin, ExternalLink, Compass, Phone } from 'lucide-react';
import { PROFILE_DETAILS, EDUCATION_MILESTONES } from '../data';
import { motion } from 'motion/react';

interface ProfileViewProps {
  setActiveSection: (sec: string) => void;
}

export default function ProfileView({ setActiveSection }: ProfileViewProps) {
  const homeRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const [isImageTapped, setIsImageTapped] = useState(false);

  // IntersectionObserver for section tracking (replaces scroll event listener)
  useEffect(() => {
    const sections = [
      { ref: educationRef, id: 'education' },
      { ref: aboutRef, id: 'about' },
      { ref: homeRef, id: 'home' }
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        }
        if (bestEntry) {
          const id = bestEntry.target.getAttribute('id');
          if (id) setActiveSection(id);
        }
      },
      {
        rootMargin: '-30% 0px -50% 0px',
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    sections.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [setActiveSection]);

  // Animation Variants
  const name = PROFILE_DETAILS.name;
  const nameLetters = Array.from(name);

  const imageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const nameContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const rolesContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.9
      }
    }
  };

  const roleItemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.6,
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const detailsVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 2.0,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const scrollIndicatorVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: {
      opacity: 0.5,
      y: 0,
      transition: {
        delay: 2.5,
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1],
        repeat: Infinity,
        repeatType: 'reverse' as const,
        repeatDelay: 0.2
      }
    }
  };

  // Scroll-reveal variants for About & Education sections
  const sectionRevealVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const staggerContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const staggerItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div className="space-y-20 sm:space-y-36 pb-24 sm:pb-32">
      {/* 1. Home Section */}
      <section id="home" ref={homeRef} className="pt-8 sm:pt-16 min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center scroll-mt-24 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left profile graphics frame */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 flex justify-center lg:justify-start"
          >
            <div 
              className="relative w-36 sm:w-72 md:w-80 aspect-square group cursor-pointer"
              onClick={() => setIsImageTapped(!isImageTapped)}
            >
              {/* Outer Cyberpunk bracket animations */}
              <div className={`absolute -inset-4 border rounded-2xl group-hover:border-electric-cyan/50 transition-all duration-500 ${
                isImageTapped ? 'border-electric-cyan/50' : 'border-electric-cyan/20'
              }`}></div>
              <div 
                className={`absolute -inset-1 border-2 border-dashed rounded-2xl group-hover:border-primary-amber/70 transition-all duration-700 animate-spin ${
                  isImageTapped ? 'border-primary-amber/70' : 'border-primary-amber/30'
                }`} 
                style={{ animationDuration: '60s' }}
              ></div>

              {/* Glowing Corner Accents */}
              <div className="absolute -top-4 -left-4 w-6 h-6 border-t-2 border-l-2 border-electric-cyan"></div>
              <div className="absolute -top-4 -right-4 w-6 h-6 border-t-2 border-r-2 border-electric-cyan"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 border-b-2 border-l-2 border-electric-cyan"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 border-b-2 border-r-2 border-electric-cyan"></div>

              {/* Core Image container */}
              <div className={`w-full h-full rounded-xl overflow-hidden border border-electric-cyan/30 relative bg-[#0b0b0b] transition-all duration-500 ${
                isImageTapped 
                  ? 'shadow-[0_0_35px_rgba(0,243,255,0.35)]' 
                  : 'shadow-[0_0_20px_rgba(0,243,255,0.15)] group-hover:shadow-[0_0_35px_rgba(0,243,255,0.35)]'
              }`}>
                <img
                  src={PROFILE_DETAILS.avatar}
                  alt={PROFILE_DETAILS.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover brightness-95 transition-all duration-750 group-hover:grayscale-0 group-hover:scale-105 ${
                    isImageTapped ? 'grayscale-0 scale-105' : 'grayscale'
                  }`}
                />
              </div>
            </div>
          </motion.div>

          {/* Right profile detail summary briefing */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left flex flex-col justify-center lg:items-start items-center">
            <motion.h1
              variants={nameContainerVariants}
              initial="hidden"
              animate="visible"
              className="font-headline text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight"
            >
              I am{" "}
              <span className="neon-text-cyan inline-block">
                {nameLetters.map((char, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    className="inline-block whitespace-pre"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            <motion.div
              variants={rolesContainerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-2 font-mono text-xs sm:text-sm text-primary-amber font-semibold uppercase tracking-wider"
            >
              {["AI & ML Engineer", "Software Developer", "Problem Solver"].map((role, idx) => (
                <motion.div key={idx} variants={roleItemVariants} className="flex items-center gap-2 justify-center lg:justify-start">
                  <span className="w-1.5 h-1.5 bg-primary-amber rounded-full animate-pulse"></span>
                  {role}
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              variants={taglineVariants}
              initial="hidden"
              animate="visible"
              className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl italic font-medium"
            >
              "Building intelligent systems for the future."
            </motion.p>

            <motion.div
              variants={detailsVariants}
              initial="hidden"
              animate="visible"
              className="w-full space-y-6 flex flex-col items-center lg:items-start"
            >
              <div className="w-full max-w-xl border-t border-b border-white/5 py-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 font-mono text-[10px] text-slate-500 uppercase">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <MapPin className="w-3.5 h-3.5 text-electric-cyan" />
                  <span>Sector: Chandigarh, Punjab, India</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Compass className="w-3.5 h-3.5 text-primary-amber" />
                  <span>Chandigarh University</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start lowercase">
                  <Mail className="w-3.5 h-3.5 text-electric-cyan" />
                  <a href={PROFILE_DETAILS.socials.email} className="hover:text-electric-cyan transition-colors">
                    arijitpal2350@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Phone className="w-3.5 h-3.5 text-primary-amber" />
                  <a href={PROFILE_DETAILS.socials.phone} className="hover:text-primary-amber transition-colors">
                    +91 9832434164
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                <a
                  href="/Arijit_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-white/20 hover:border-primary-amber hover:text-primary-amber text-white font-bold text-xs uppercase tracking-widest rounded transition-all cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  Access Resume
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          variants={scrollIndicatorVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 font-mono text-[10px] text-slate-500 uppercase tracking-widest pointer-events-none select-none"
        >
          <span>↓ Scroll to Explore</span>
        </motion.div>
      </section>

      {/* 2. About / Competencies Section — Scroll-revealed */}
      <motion.section
        id="about"
        ref={aboutRef}
        className="scroll-mt-24"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.div className="mb-12" variants={staggerItemVariants}>
          <div className="inline-flex items-center gap-2 font-mono text-[10px] text-primary-amber uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 bg-primary-amber"></span>
            Background Briefing
          </div>
          <h2 className="font-headline text-3xl font-bold text-white">Core Competency Matrix</h2>
          <p className="text-xs text-slate-500 mt-1 uppercase font-mono">Querying neural capabilities and stack performance</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <motion.div className="md:col-span-5 space-y-4" variants={staggerItemVariants}>
            <h3 className="font-headline text-lg font-semibold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-electric-cyan" />
              Machine Learning & Data
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {PROFILE_DETAILS.extendedBio}
            </p>
            <div className="bg-[#0b0b0b] border border-white/5 p-4 rounded-xl space-y-1.5 font-mono text-[10px] text-slate-400">
              <div className="flex justify-between border-b border-white/5 pb-1 text-slate-500">
                <span>METRIC PROTOCOL</span>
                <span>EFFICIENCY VALUE</span>
              </div>
              <div className="flex justify-between">
                <span>Statistical Modeling</span>
                <span className="text-electric-cyan">High Precision</span>
              </div>
              <div className="flex justify-between">
                <span>Neural Layer Construction</span>
                <span className="text-electric-cyan">PyTorch Optimized</span>
              </div>
              <div className="flex justify-between">
                <span>Data Extraction & Pipelines</span>
                <span className="text-electric-cyan">Pandas Bound</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="md:col-span-7 space-y-5" variants={staggerItemVariants}>
            {/* Programming & Mathematics sliders */}
            <div className="space-y-4 bg-white/[0.01] border border-white/5 p-6 rounded-2xl">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-white">Mathematics (Linear Algebra & Statistics)</span>
                  <span className="text-electric-cyan font-bold">94%</span>
                </div>
                <div className="w-full bg-[#141414] h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-electric-cyan h-full shadow-[0_0_8px_#00f3ff]" style={{ width: '94%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-white">Deep Learning (PyTorch, EfficientNet)</span>
                  <span className="text-electric-cyan font-bold">90%</span>
                </div>
                <div className="w-full bg-[#141414] h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-electric-cyan h-full shadow-[0_0_8px_#00f3ff]" style={{ width: '90%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-white">Full-Stack Frameworks (React, FastAPI)</span>
                  <span className="text-electric-cyan font-bold">85%</span>
                </div>
                <div className="w-full bg-[#141414] h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-electric-cyan h-full shadow-[0_0_8px_#00f3ff]" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-white">Automation Scripting (SMTP, Python)</span>
                  <span className="text-electric-cyan font-bold">95%</span>
                </div>
                <div className="w-full bg-[#141414] h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-electric-cyan h-full shadow-[0_0_8px_#00f3ff]" style={{ width: '95%' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 3. Education Journey Section — Scroll-revealed */}
      <motion.section
        id="education"
        ref={educationRef}
        className="scroll-mt-24"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div className="mb-12" variants={staggerItemVariants}>
          <div className="inline-flex items-center gap-2 font-mono text-[10px] text-electric-cyan uppercase tracking-widest mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-electric-cyan" />
            Academic Chronicles
          </div>
          <h2 className="font-headline text-3xl font-bold text-white">Education Milestones</h2>
          <p className="text-xs text-slate-500 mt-1 uppercase font-mono">Registered credentials on the mainframe</p>
        </motion.div>

        <div className="max-w-3xl">
          {EDUCATION_MILESTONES.map((edu, idx) => (
            <motion.div
              key={idx}
              className="relative pl-8 border-l border-electric-cyan/20 space-y-4"
              variants={staggerItemVariants}
            >
              {/* Timeline dot */}
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-black border border-electric-cyan rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-electric-cyan rounded-full animate-ping" />
              </div>

              <div className="glass-cyber p-6 sm:p-8 rounded-2xl relative overflow-hidden group hover:neon-border-cyan transition-all duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                  <div>
                    <span className="font-mono text-[10px] text-primary-amber uppercase bg-primary-amber/10 border border-primary-amber/20 px-2.5 py-1 rounded">
                      {edu.period}
                    </span>
                    <h3 className="font-headline text-xl font-bold text-white mt-3">
                      {edu.degree}
                    </h3>
                  </div>
                  <div className="text-right sm:text-right">
                    <span className="font-mono text-xs text-electric-cyan font-bold block">{edu.institution}</span>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-200 font-bold uppercase tracking-wider mb-3">
                  {edu.specialization}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-medium">
                  {edu.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {edu.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-white/10 border border-white/15 rounded font-mono text-[9px] text-white uppercase font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

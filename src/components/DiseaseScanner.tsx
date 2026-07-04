import React, { useState } from 'react';
import { Leaf, Cpu, ShieldCheck, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LeafSpecimen {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  diseaseDetected: string;
  confidence: number;
  remedy: string;
  severity: 'Healthy' | 'Moderate' | 'Severe';
  heatmapUrl: string;
}

const SPECIMENS: LeafSpecimen[] = [
  {
    id: 'specimen-01',
    name: 'Tomato Leaf - Specimen T42',
    type: 'Solanum lycopersicum',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400',
    diseaseDetected: 'Tomato Early Blight (Alternaria solani)',
    confidence: 98.4,
    remedy: 'Apply organic copper-based fungicides immediately. Prune lower infected foliage to suppress spore dispersion and establish adequate soil aeration.',
    severity: 'Severe',
    heatmapUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400&blur=10'
  },
  {
    id: 'specimen-02',
    name: 'Apple Leaf - Specimen A12',
    type: 'Malus domestica',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=400',
    diseaseDetected: 'Apple Scab (Venturia inaequalis)',
    confidence: 96.1,
    remedy: 'Remove fallen leaf litter which serves as a spore vector. Administer systemic protectant fungicides during wet conditions.',
    severity: 'Moderate',
    heatmapUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=400&blur=10'
  },
  {
    id: 'specimen-03',
    name: 'Grape Leaf - Specimen G89',
    type: 'Vitis vinifera',
    imageUrl: 'https://images.unsplash.com/photo-1539321908154-04927596764d?auto=format&fit=crop&q=80&w=400',
    diseaseDetected: 'Grape Powdery Mildew (Erysiphe necator)',
    confidence: 99.2,
    remedy: 'Increase solar irradiation penetration via leaf canopy pruning. Spray sulfur solutions at regular intervals during humid stages.',
    severity: 'Severe',
    heatmapUrl: 'https://images.unsplash.com/photo-1539321908154-04927596764d?auto=format&fit=crop&q=80&w=400&blur=10'
  },
  {
    id: 'specimen-04',
    name: 'Basilicum Leaf - Specimen B05',
    type: 'Ocimum basilicum',
    imageUrl: 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&q=80&w=400',
    diseaseDetected: 'Pathogen Absent (Specimen Healthy)',
    confidence: 99.7,
    remedy: 'No fungal anomalies spotted. Maintain systematic irrigation intervals and biological soil monitoring to guarantee continued vigor.',
    severity: 'Healthy',
    heatmapUrl: 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&q=80&w=400&blur=10'
  }
];

export default function DiseaseScanner() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const activeSpecimen = SPECIMENS[selectedIdx];

  const handleDiagnosticRun = () => {
    setIsScanning(true);
    setHasScanned(false);
    setShowHeatmap(false);
    setScanProgress(0);
    setConsoleLogs([]);

    const logs = [
      'SYS_INIT: Booting diagnostic neural network...',
      'EFFICIENTNET: Loading weights, model architecture: EfficientNet-B4',
      'INPUT: Capturing 224x224 leaf specimen frame matrix...',
      'STAGING: Normalizing float tensor matrices...',
      'DIAGNOSTIC: Running forward propagation passes...',
      'LAYER_ACTIVATION: Processing Class Activation Map (Grad-CAM)...',
      'SYS_COMPLETED: Diagnosis completed with highest confidence leaf nodes.'
    ];

    let logCounter = 0;
    const interval = setInterval(() => {
      if (logCounter < logs.length) {
        setConsoleLogs(prev => [...prev, logs[logCounter]]);
        setScanProgress(curr => curr + 14);
        logCounter++;
      } else {
        clearInterval(interval);
        setScanProgress(100);
        setTimeout(() => {
          setIsScanning(false);
          setHasScanned(true);
        }, 300);
      }
    }, 350);
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'Healthy':
        return 'text-green-400 border-green-500/20 bg-green-500/10';
      case 'Moderate':
        return 'text-primary-amber border-primary-amber/20 bg-primary-amber/10';
      case 'Severe':
        return 'text-primary-orange border-primary-orange/20 bg-primary-orange/10';
      default:
        return 'text-white border-white/10 bg-white/5';
    }
  };

  return (
    <div className="w-full glass-cyber rounded-2xl border-secondary/20 p-6 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h4 className="font-headline text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-electric-cyan" />
            Neural Plant Pathology Node
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Test the live EfficientNet-B4 diagnostic engine on botanical specimen layers.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {SPECIMENS.map((spec, idx) => (
            <button
              key={spec.id}
              onClick={() => {
                if (!isScanning) {
                  setSelectedIdx(idx);
                  setHasScanned(false);
                  setShowHeatmap(false);
                }
              }}
              disabled={isScanning}
              className={`px-3 py-1 text-xs font-mono border rounded transition-all ${
                selectedIdx === idx
                  ? 'border-electric-cyan/60 text-electric-cyan bg-electric-cyan/10 neon-text-cyan'
                  : 'border-white/10 text-slate-300 bg-white/5 hover:border-white/20'
              }`}
            >
              Specimen 0{idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Specimen Image Frame */}
        <div className="md:col-span-5 flex flex-col">
          <div className="relative aspect-square w-full rounded-xl border border-secondary/20 overflow-hidden bg-black flex items-center justify-center">
            <img
              src={showHeatmap && hasScanned ? activeSpecimen.heatmapUrl : activeSpecimen.imageUrl}
              alt={activeSpecimen.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Heatmap CAM Grid overlay */}
            {showHeatmap && hasScanned && (
              <div className="absolute inset-0 bg-red-500/10 mix-blend-color-burn pointer-events-none" />
            )}

            {/* Scanning Line overlay */}
            {isScanning && (
              <>
                <div className="absolute inset-x-0 h-1 bg-electric-cyan shadow-[0_0_12px_#00f3ff] animate-bounce top-0 bottom-0 pointer-events-none" />
                <div className="absolute inset-0 bg-electric-cyan/5 pointer-events-none animate-pulse" />
              </>
            )}
            {hasScanned && (
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-2.5 py-1 text-[10px] font-mono border rounded backdrop-blur bg-black/70 flex items-center gap-1 transition-all ${
                    showHeatmap
                      ? 'border-primary-orange text-primary-orange neon-text-orange'
                      : 'border-white/20 text-white hover:border-white/40'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  {showHeatmap ? 'Grad-CAM On' : 'Grad-CAM Heatmap'}
                </button>
              </div>
            )}
          </div>
          <div className="mt-3 font-mono text-xs">
            <div className="text-slate-300 font-bold">{activeSpecimen.name}</div>
            <div className="text-slate-500 italic text-[11px] mt-0.5">{activeSpecimen.type}</div>
          </div>
        </div>

        {/* Right Side: Analysis Display and Terminal Console */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div className="space-y-4 flex-grow">
            {/* Run Diagnosis Button */}
            {!isScanning && !hasScanned ? (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-8 bg-white/[0.01]">
                <Leaf className="w-12 h-12 text-slate-600 animate-pulse mb-3" />
                <h5 className="font-headline text-sm font-semibold text-white">Pathology Engine Idle</h5>
                <p className="text-xs text-slate-400 text-center max-w-sm mt-1 mb-4 font-medium">
                  Select a specimen from the upper node selectors and boot the diagnostics pipeline.
                </p>
                <button
                  onClick={handleDiagnosticRun}
                  className="px-6 py-2.5 bg-primary-orange text-background hover:bg-background hover:text-primary-orange border border-primary-orange/30 font-bold text-xs uppercase tracking-widest rounded flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Cpu className="w-4 h-4" />
                  Run Diagnostics Scan
                </button>
              </div>
            ) : isScanning ? (
              /* Diagnostic Running state with scan progress */
              <div className="bg-black/40 border border-white/10 p-5 rounded-xl h-full flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="flex justify-between items-center mb-2 font-mono text-xs text-electric-cyan font-bold">
                    <span>FORWARD PROPAGATION...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      className="bg-electric-cyan h-full shadow-[0_0_10px_#00f3ff]"
                      style={{ width: `${scanProgress}%` }}
                      transition={{ ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div className="mt-4 font-mono text-[10px] text-slate-300 space-y-1.5 flex-grow overflow-y-auto max-h-[140px] p-2 bg-black/50 border border-white/10 rounded">
                  <AnimatePresence>
                    {consoleLogs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className={`${
                          log.startsWith('SYS_COMPLETED')
                            ? 'text-green-400'
                            : log.startsWith('INPUT') || log.startsWith('DIAGNOSTIC')
                            ? 'text-electric-cyan'
                            : 'text-slate-400'
                        }`}
                      >
                        {log}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              /* Scanning Completed results */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-black/40 border border-white/10 p-5 rounded-xl backdrop-blur-md">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">IDENTIFIED PATHOGEN</div>
                      <h5 className="font-headline text-lg font-bold text-white mt-1">
                        {activeSpecimen.diseaseDetected}
                      </h5>
                    </div>
                    <div className={`px-2.5 py-1 border rounded text-[10px] font-mono uppercase ${severityColor(activeSpecimen.severity)}`}>
                      {activeSpecimen.severity}
                    </div>
                  </div>

                  {/* Confidence metrics */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-14 h-14 flex items-center justify-center font-mono">
                      {/* Circular border for diagnostic score */}
                      <div className="absolute inset-0 border border-dashed border-white/10 rounded-full" />
                      <div className="text-electric-cyan text-xs font-bold text-center">
                        <div className="text-[10px] text-slate-400 font-medium">CONF</div>
                        {activeSpecimen.confidence}%
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-[10px] font-mono text-slate-400 uppercase mb-1 font-semibold">RELIABILITY VALUE</div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-electric-cyan h-full shadow-[0_0_8px_#00f3ff]"
                          style={{ width: `${activeSpecimen.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#1b1b1b] pt-4">
                    <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1.5 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                      REMEDIAL ACTION PROTOCOL
                    </div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                      {activeSpecimen.remedy}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleDiagnosticRun}
                    className="flex-grow py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Rescan Specimen
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

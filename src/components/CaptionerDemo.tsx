import React, { useState } from 'react';
import { Video, Cpu, FileText, Play, Pause, Save, CheckCircle2, Languages, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SubtitleLine {
  id: string;
  start: string;
  end: string;
  speaker: string;
  rawText: string;
  gptProcessed: string;
}

interface VideoSource {
  id: string;
  title: string;
  duration: string;
  subtitles: SubtitleLine[];
}

const VIDEO_SOURCES: VideoSource[] = [
  {
    id: 'ai-lecture',
    title: 'CS50 AI/ML: Neural Layer Introduction',
    duration: '0:24',
    subtitles: [
      {
        id: 'sub-01',
        start: '00:00.50',
        end: '00:04.20',
        speaker: 'Dr. Sarah Chen',
        rawText: 'so today we will explore deep networks and why multi layer perceptrons work',
        gptProcessed: 'So today, we will explore deep networks and why Multi-Layer Perceptrons (MLPs) work.'
      },
      {
        id: 'sub-02',
        start: '00:04.80',
        end: '00:09.15',
        speaker: 'Dr. Sarah Chen',
        rawText: 'basically backprop allows the weights to adjust automatically through gradient descent',
        gptProcessed: 'Basically, backpropagation allows the weights to adjust automatically through gradient descent.'
      },
      {
        id: 'sub-03',
        start: '00:09.50',
        end: '00:15.80',
        speaker: 'Dr. Sarah Chen',
        rawText: 'and this is how standard feedforward modules minimize losses in training databases',
        gptProcessed: 'And this is how standard feedforward modules minimize losses in training datasets.'
      },
      {
        id: 'sub-04',
        start: '00:16.10',
        end: '00:23.00',
        speaker: 'Dr. Sarah Chen',
        rawText: 'using relu activation helps us solve the vanishing gradient issue',
        gptProcessed: 'Using ReLU (Rectified Linear Unit) activation helps us solve the vanishing gradient issue.'
      }
    ]
  },
  {
    id: 'startup-pitch',
    title: 'CognitiveCore: Seed Series Pitch',
    duration: '0:18',
    subtitles: [
      {
        id: 'sub-11',
        start: '00:00.20',
        end: '00:04.00',
        speaker: 'CEO James',
        rawText: 'we are building a real time telemetry solution using local onnx weights',
        gptProcessed: 'We are building a real-time telemetry solution using local ONNX weights.'
      },
      {
        id: 'sub-12',
        start: '00:04.50',
        end: '00:10.80',
        speaker: 'CEO James',
        rawText: 'our engine compiles to rust which lets it run with less than five megabytes of memory',
        gptProcessed: 'Our engine compiles to Rust, which lets it run with less than 5 MB of memory.'
      },
      {
        id: 'sub-13',
        start: '00:11.20',
        end: '00:17.50',
        speaker: 'CEO James',
        rawText: 'this provides high edge speed in smart vehicles without sending api payloads',
        gptProcessed: 'This provides high edge speed in smart vehicles without sending API payloads.'
      }
    ]
  }
];

export default function CaptionerDemo() {
  const [selectedVideoIdx, setSelectedVideoIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [hasTranscribed, setHasTranscribed] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [currentSubIdx, setCurrentSubIdx] = useState<number>(-1);
  const [editedSubtitles, setEditedSubtitles] = useState<SubtitleLine[]>([]);
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const activeVideo = VIDEO_SOURCES[selectedVideoIdx];

  const handleTranscribeRun = () => {
    setIsTranscribing(true);
    setHasTranscribed(false);
    setProcessingStep(0);
    setCurrentSubIdx(-1);

    // Simulated Whisper & GPT-4 pipelines
    const timers = [
      setTimeout(() => setProcessingStep(1), 1200), // Loading Audio File
      setTimeout(() => setProcessingStep(2), 2400), // Whisper STT transcribing
      setTimeout(() => setProcessingStep(3), 3800), // GPT-4 Context Enhancing
      setTimeout(() => {
        setIsTranscribing(false);
        setHasTranscribed(true);
        setEditedSubtitles(activeVideo.subtitles);
        // Play subtitles sequentially
        triggerSubtitlePlayback(activeVideo.subtitles);
      }, 5000)
    ];

    return () => timers.forEach(clearTimeout);
  };

  const triggerSubtitlePlayback = (subs: SubtitleLine[]) => {
    setIsPlaying(true);
    let i = 0;
    setCurrentSubIdx(0);

    const playInterval = setInterval(() => {
      i++;
      if (i < subs.length) {
        setCurrentSubIdx(i);
      } else {
        clearInterval(playInterval);
        setIsPlaying(false);
        setCurrentSubIdx(-1);
      }
    }, 4000);
  };

  const startManualPlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentSubIdx(-1);
    } else {
      triggerSubtitlePlayback(editedSubtitles.length > 0 ? editedSubtitles : activeVideo.subtitles);
    }
  };

  const handleEditClick = (sub: SubtitleLine) => {
    setEditingSubId(sub.id);
    setEditValue(sub.gptProcessed);
  };

  const handleSaveEdit = (subId: string) => {
    setEditedSubtitles(prev =>
      prev.map(item => (item.id === subId ? { ...item, gptProcessed: editValue } : item))
    );
    setEditingSubId(null);
  };

  const handleExport = (format: 'srt' | 'vtt') => {
    const list = editedSubtitles.length > 0 ? editedSubtitles : activeVideo.subtitles;
    let content = '';

    if (format === 'srt') {
      content = list
        .map((sub, index) => {
          return `${index + 1}\n00:00:${sub.start.replace('.', ',')} --> 00:00:${sub.end.replace('.', ',')}\n[${sub.speaker}]: ${sub.gptProcessed}\n`;
        })
        .join('\n');
    } else {
      content = 'WEBVTT\n\n' + list
        .map((sub, index) => {
          return `${index + 1}\n00:00:${sub.start} --> 00:00:${sub.end}\n<v ${sub.speaker}>${sub.gptProcessed}\n`;
        })
        .join('\n');
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeVideo.id}-subtitles.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full glass-cyber rounded-2xl border-secondary/20 p-6 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h4 className="font-headline text-lg font-bold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-electric-cyan" />
            Whisper & GPT-4 Captioning Console
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Automate context-aware speech-to-text diarization. Toggle, edit, and export subtitle nodes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {VIDEO_SOURCES.map((vid, idx) => (
            <button
              key={vid.id}
              onClick={() => {
                if (!isTranscribing) {
                  setSelectedVideoIdx(idx);
                  setHasTranscribed(false);
                  setEditedSubtitles([]);
                  setCurrentSubIdx(-1);
                  setIsPlaying(false);
                }
              }}
              disabled={isTranscribing}
              className={`px-3 py-1 text-xs font-mono border rounded transition-all ${
                selectedVideoIdx === idx
                  ? 'border-electric-cyan/60 text-electric-cyan bg-electric-cyan/10 neon-text-cyan'
                  : 'border-white/10 text-slate-300 bg-white/5 hover:border-white/20'
              }`}
            >
              {vid.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left column: Video Mockup / Waveform Analyser */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div className="relative aspect-video w-full rounded-xl border border-secondary/20 bg-black overflow-hidden flex flex-col justify-between p-4">
            <div className="flex justify-between items-center text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold">
                <Video className="w-3.5 h-3.5 text-primary-orange" />
                V_LIVE_INPUT
              </span>
              <span>{activeVideo.duration} SEC</span>
            </div>

            {/* Subtitle Telemetry Display */}
            <div className="flex-grow flex items-center justify-center p-3 relative">
              <AnimatePresence mode="wait">
                {isPlaying && currentSubIdx !== -1 ? (
                  <motion.div
                    key={currentSubIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center"
                  >
                    <span className="text-[10px] font-mono text-electric-cyan bg-electric-cyan/10 px-2 py-0.5 rounded border border-electric-cyan/20">
                      {editedSubtitles[currentSubIdx]?.speaker || activeVideo.subtitles[currentSubIdx]?.speaker}
                    </span>
                    <p className="text-sm font-semibold text-white mt-2 max-w-[280px] drop-shadow-[0_2_4px_rgba(0,0,0,1)]">
                      {editedSubtitles[currentSubIdx]?.gptProcessed || activeVideo.subtitles[currentSubIdx]?.gptProcessed}
                    </p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center">
                    {!hasTranscribed ? (
                      <Video className="w-8 h-8 text-slate-700 animate-pulse" />
                    ) : (
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    )}
                    <span className="text-xs font-mono text-slate-400 uppercase mt-2 font-medium">
                      {!hasTranscribed ? 'STT Node Unprocessed' : 'Telemetry Ready'}
                    </span>
                  </div>
                )}
              </AnimatePresence>

              {/* Glowing Waveform background */}
              {isPlaying && (
                <div className="absolute bottom-1 inset-x-0 h-8 flex items-end justify-center gap-[3px] opacity-25">
                  {Array(20)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="bg-electric-cyan w-1 rounded-t shadow-[0_0_8px_#00f3ff]"
                        style={{
                          height: `${Math.floor(Math.random() * 24) + 4}px`,
                          animation: 'scanline 1s ease infinite alternate'
                        }}
                      />
                    ))}
                </div>
              )}
            </div>

            {/* Play controls */}
            {hasTranscribed && (
              <div className="flex items-center gap-3 border-t border-white/5 pt-2 mt-auto">
                <button
                  onClick={startManualPlayback}
                  className="w-8 h-8 rounded bg-electric-cyan text-background flex items-center justify-center hover:bg-white hover:text-electric-cyan transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  {isPlaying ? 'ACTIVE SYNC BROADCASTING' : 'READY TO FEED'}
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 bg-white/10 rounded-lg border border-white/15 p-3 flex justify-between items-center text-xs font-mono text-white font-medium">
            <span className="text-slate-300">Audio Channels:</span>
            <span className="text-electric-cyan font-bold">DUAL MONO (16KHZ)</span>
          </div>
        </div>

        {/* Right column: Audio Log / Subtitle Line lists */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div className="flex-grow">
            {!isTranscribing && !hasTranscribed ? (
              /* Idle landing */
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-8 bg-white/[0.01]">
                <Languages className="w-12 h-12 text-slate-600 animate-pulse mb-3" />
                <h5 className="font-headline text-sm font-semibold text-white">Transcriber Pipeline Offline</h5>
                <p className="text-xs text-slate-400 text-center max-w-sm mt-1 mb-4 font-medium">
                  Deploy Whisper & GPT-4 microservices on this speech stream to construct transcript maps.
                </p>
                <button
                  onClick={handleTranscribeRun}
                  className="px-6 py-2.5 bg-electric-cyan text-background hover:bg-background hover:text-electric-cyan border border-electric-cyan/30 font-bold text-xs uppercase tracking-widest rounded flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                >
                  <Cpu className="w-4 h-4" />
                  Compute Transcript
                </button>
              </div>
            ) : isTranscribing ? (
              /* Transcribing logs loader */
              <div className="bg-black/40 border border-white/10 p-5 rounded-xl h-full flex flex-col justify-center gap-4 backdrop-blur-md">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono text-electric-cyan uppercase tracking-wider animate-pulse font-bold">
                    COMPUTING AUDIO NODES...
                  </span>
                </div>

                <div className="space-y-2 border border-white/10 bg-black/50 p-4 rounded-lg font-mono text-[10px]">
                  <div className={`flex items-center gap-2 ${processingStep >= 1 ? 'text-green-400 font-bold' : 'text-slate-500'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>LOAD AUDIO STREAMS [OK]</span>
                  </div>
                  <div className={`flex items-center gap-2 ${processingStep >= 2 ? 'text-green-400' : 'text-slate-600'}`}>
                    {processingStep === 1 ? (
                      <div className="w-2.5 h-2.5 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>WHISPER STT: CONSTRUCTING TEXT GRID MAPS</span>
                  </div>
                  <div className={`flex items-center gap-2 ${processingStep >= 3 ? 'text-green-400' : 'text-slate-600'}`}>
                    {processingStep === 2 ? (
                      <div className="w-2.5 h-2.5 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>GPT-4 EXTREME GLOSSARY SANITIZER ENHANCE</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Transcribed subtitles view */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 max-h-[300px] overflow-y-auto pr-1"
              >
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase pb-1 border-b border-white/10">
                  <span>Timestamp & Speaker</span>
                  <span>Interactive Telemetry Editor</span>
                </div>

                {(editedSubtitles.length > 0 ? editedSubtitles : activeVideo.subtitles).map((sub, idx) => (
                  <div
                    key={sub.id}
                    className={`p-3 rounded-lg border transition-all duration-150 ${
                      currentSubIdx === idx
                        ? 'bg-electric-cyan/5 border-electric-cyan/40'
                        : 'bg-black/30 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>
                        {sub.start} - {sub.end} | <span className="text-slate-200 font-bold">{sub.speaker}</span>
                      </span>
                      {editingSubId !== sub.id && (
                        <button
                          onClick={() => handleEditClick(sub)}
                          className="hover:text-electric-cyan flex items-center gap-1 transition-colors text-slate-300 font-medium"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit Node
                        </button>
                      )}
                    </div>

                    <div className="mt-1.5 text-xs text-slate-200">
                      {editingSubId === sub.id ? (
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="flex-grow bg-black/60 border border-electric-cyan/40 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan"
                          />
                          <button
                            onClick={() => handleSaveEdit(sub.id)}
                            className="bg-electric-cyan text-background px-3 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 hover:bg-white transition-colors cursor-pointer"
                          >
                            <Save className="w-3 h-3" />
                            SAVE
                          </button>
                        </div>
                      ) : (
                        <p className="font-medium">{sub.gptProcessed}</p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Export Panel footer */}
          {hasTranscribed && (
            <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-2">
              <button
                onClick={() => handleExport('srt')}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-mono rounded-lg flex items-center gap-2 transition-all cursor-pointer font-semibold"
              >
                <FileText className="w-3.5 h-3.5" />
                Export SRT
              </button>
              <button
                onClick={() => handleExport('vtt')}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-mono rounded-lg flex items-center gap-2 transition-all cursor-pointer font-semibold"
              >
                <FileText className="w-3.5 h-3.5" />
                Export WEBVTT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

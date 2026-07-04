import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, ShieldAlert, Cpu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [networkLogs, setNetworkLogs] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setIsSending(true);
      setHasSent(false);
      setNetworkLogs([
        'NET_INIT: Connecting to local environment variables...',
        'ERR_CONFIG: Web3Forms access key not found in environment.',
        'INSTRUCTION: Please register a free key at https://web3forms.com',
        'INSTRUCTION: Add VITE_WEB3FORMS_ACCESS_KEY="your_key" to your .env file.',
        'SYS_ABORTED: Packet delivery cancelled.'
      ]);
      return;
    }

    setIsSending(true);
    setHasSent(false);
    setNetworkLogs(['NET_INIT: Connecting to secure Web3Forms API routing node...']);

    // Run the animation step updates
    const steps = [
      'ENCRYPTION: Initiating SSL/TLS payload wrapping key exchanges...',
      'TRANSMITTING: Injecting packet matrices of message payload...',
      'DISPATCH: Attempting message routing via Web3Forms gateway...'
    ];

    let stepCounter = 0;
    const logInterval = setInterval(() => {
      if (stepCounter < steps.length) {
        setNetworkLogs(prev => [...prev, steps[stepCounter]]);
        stepCounter++;
      } else {
        clearInterval(logInterval);
      }
    }, 300);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Portfolio Contact Form Message',
          message: formData.message
        })
      });

      const data = await response.json();
      clearInterval(logInterval);
      
      if (data.success) {
        setNetworkLogs(prev => [
          ...prev,
          'DISPATCH: Message routed through local mail delivery agent.',
          'SYS_COMPLETED: Packet delivery confirmed by receiver. Status: 200 OK'
        ]);
        setTimeout(() => {
          setIsSending(false);
          setHasSent(true);
          setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1000);
      } else {
        setNetworkLogs(prev => [
          ...prev,
          `ERR_API: Web3Forms rejected the payload. Message: ${data.message || 'Unknown error'}`,
          'SYS_ABORTED: Telemetry delivery failed.'
        ]);
      }
    } catch (error) {
      clearInterval(logInterval);
      setNetworkLogs(prev => [
        ...prev,
        'ERR_CONN: Failed to establish network handshake with mail server.',
        'SYS_ABORTED: Telemetry delivery failed.'
      ]);
    }
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
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="w-full max-w-lg rounded-2xl overflow-hidden border border-secondary/20 bg-[#070707] shadow-[0_0_25px_rgba(0,243,255,0.2)] flex flex-col relative p-6 z-10"
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

        <div className="mb-6">
          <h4 className="font-headline text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-electric-cyan" />
            Initialize Direct Communication Pipeline
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch securely routed packets directly to Arijit's mailbox. Logs will print transmission diagnostics.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isSending && !hasSent ? (
            /* Contact Fields Form */
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#101010] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan transition-colors"
                    placeholder="Enter name..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#101010] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan transition-colors"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">
                  Subject Descriptor
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#101010] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan transition-colors"
                  placeholder="Internship opportunity, research proposal..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">
                  Message Payload *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#101010] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan transition-colors resize-none"
                  placeholder="Write message details..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-electric-cyan hover:bg-white text-background hover:text-electric-cyan font-bold text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,243,255,0.2)]"
              >
                <Send className="w-3.5 h-3.5" />
                Transmit Payload
              </button>
            </motion.form>
          ) : isSending ? (
            /* Sending telemetry terminal logs */
            <motion.div
              key="sending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/60 border border-secondary/10 p-5 rounded-xl flex flex-col min-h-[300px] justify-between"
            >
              {(() => {
                const isFailed = networkLogs.some(log => log.startsWith('SYS_ABORTED'));
                return (
                  <>
                    <div className="flex flex-col items-center gap-2 text-center py-4">
                      {!isFailed ? (
                        <>
                          <div className="w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs font-mono text-electric-cyan uppercase tracking-widest animate-pulse">
                            Broadcasting Matrix packets...
                          </span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-8 h-8 text-red-500 animate-bounce" />
                          <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">
                            Transmission Terminated
                          </span>
                        </>
                      )}
                    </div>

                    <div className="space-y-1.5 font-mono text-[10px] bg-[#030303] p-4 rounded border border-white/5 flex-grow overflow-y-auto max-h-[160px]">
                      {networkLogs.map((log, index) => (
                        <div
                          key={index}
                          className={`${
                            log.startsWith('SYS_COMPLETED')
                              ? 'text-green-400'
                              : log.startsWith('TRANSMITTING') || log.startsWith('ENCRYPTION') || log.startsWith('DISPATCH') || log.startsWith('NET_INIT')
                              ? 'text-electric-cyan'
                              : log.startsWith('ERR_') || log.startsWith('SYS_ABORTED') || log.startsWith('INSTRUCTION')
                              ? 'text-red-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {log}
                        </div>
                      ))}
                    </div>

                    {isFailed && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsSending(false);
                          setNetworkLogs([]);
                        }}
                        className="mt-4 w-full py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer text-center"
                      >
                        Return to Form Input
                      </button>
                    )}
                  </>
                );
              })()}
            </motion.div>
          ) : (
            /* Success confirmation card */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-4"
            >
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <h5 className="font-headline text-lg font-bold text-white uppercase tracking-wider">
                  Transmission Securely Sent
                </h5>
                <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                  The socket packet reached the target port. Thank you! Arijit will analyze your payload shortly and respond via mail.
                </p>
              </div>

              <button
                onClick={() => setHasSent(false)}
                className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs uppercase tracking-wider rounded-lg transition-all"
              >
                Send New Packet
              </button>
            </motion.div>
          )}
        </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

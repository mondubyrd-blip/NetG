import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, WifiOff, RefreshCcw, BellRing, OctagonAlert } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface FailoverAlertProps {
  ssid: string;
  previousSsid: string;
  reason: string;
  timestamp: string;
  onClose: () => void;
}

export default function FailoverAlert({ ssid, previousSsid, reason, timestamp, onClose }: FailoverAlertProps) {
  const [beepActive, setBeepActive] = useState(true);

  useEffect(() => {
    // Generate audible alert using Web Audio API
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playBeep = () => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    };

    if (beepActive) {
      const interval = setInterval(playBeep, 1000);
      return () => {
        clearInterval(interval);
        audioCtx.close();
      };
    }
  }, [beepActive]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg bg-brand-bg border-2 border-brand-danger rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.3)]"
      >
        <div className="bg-brand-danger px-6 py-4 flex items-center justify-between animate-pulse">
           <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
             <ShieldAlert size={28} /> CRITICAL_NETWORK_FAILOVER
           </h2>
           <OctagonAlert size={24} className="text-white" />
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-start gap-4 p-4 bg-brand-danger/10 border border-brand-danger/30 rounded-xl">
             <div className="bg-brand-danger p-3 rounded-lg shrink-0">
                <WifiOff size={24} className="text-white" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase text-brand-text/40 tracking-widest mb-1">Status Report</p>
                <p className="text-sm font-bold text-white leading-relaxed">
                  Connection to primary anchor <span className="text-brand-danger">'{previousSsid}'</span> dropped.
                  Sovereign authority has engaged a failover secondary link.
                </p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-brand-card border border-brand-border rounded-xl">
                <span className="text-[9px] font-black uppercase text-brand-text/40 tracking-widest block mb-1">New SSID</span>
                <span className="text-lg font-black text-brand-success flex items-center gap-2 uppercase italic">
                   <RefreshCcw size={16} /> {ssid}
                </span>
             </div>
             <div className="p-4 bg-brand-card border border-brand-border rounded-xl">
                <span className="text-[9px] font-black uppercase text-brand-text/40 tracking-widest block mb-1">Event Timestamp</span>
                <span className="text-sm font-mono font-bold text-white uppercase italic">
                   {new Date(timestamp).toLocaleTimeString()}
                </span>
             </div>
          </div>

          <div className="p-4 bg-brand-card/50 border border-brand-border rounded-xl">
             <span className="text-[9px] font-black uppercase text-brand-text/40 tracking-widest block mb-1">Reason for Transition</span>
             <p className="text-xs font-bold text-brand-warning uppercase italic leading-relaxed">
               {reason}
             </p>
          </div>

          <div className="pt-4 flex flex-col gap-3">
             <button 
               onClick={() => setBeepActive(!beepActive)}
               className={cn(
                 "w-full py-3 rounded-lg border transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2",
                 beepActive ? "bg-brand-warning/10 border-brand-warning text-brand-warning" : "bg-brand-bg border-brand-border text-brand-text/40 hover:text-white"
               )}
             >
               <BellRing size={14} /> {beepActive ? "Mute Audible Alarm" : "Resume Alarm Sound"}
             </button>
             
             <button 
               onClick={onClose}
               className="w-full py-4 bg-brand-danger hover:bg-brand-danger/80 text-white rounded-lg transition-all text-xs font-black uppercase tracking-[4px] shadow-[0_0_20px_rgba(239,68,68,0.2)]"
             >
               Acknowledge & Clear Alert
             </button>
          </div>
        </div>
        
        <div className="px-6 py-2 bg-brand-card/50 border-t border-brand-border text-center">
           <p className="text-[8px] font-bold text-brand-text/30 uppercase tracking-[2px]">
             Emergency Protocol 24.S - Logged in Sovereign Audit Trail
           </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

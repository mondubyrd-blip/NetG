import React from "react";
import { BiometricIdentity } from "@/src/types";
import { Mic, Fingerprint, Eye, ShieldCheck, RefreshCw, Smartphone, Monitor, Binary } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";
import NaturalLanguageInterface from "./NaturalLanguageInterface";

interface BiometricNexusProps {
  anchors: BiometricIdentity[];
}

export default function BiometricNexus({ anchors }: BiometricNexusProps) {
  const [isFlushing, setIsFlushing] = React.useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case "voice": return <Mic size={20} />;
      case "fingerprint": return <Fingerprint size={20} />;
      case "visual": return <Eye size={20} />;
      default: return <ShieldCheck size={20} />;
    }
  };

  const initiateFlush = async () => {
    setIsFlushing(true);
    try {
      await fetch("/api/sovereign-flush", { method: "POST" });
      setTimeout(() => setIsFlushing(false), 5000);
    } catch (e) {
      console.error(e);
      setIsFlushing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        <div className="bg-brand-accent/20 px-6 py-4 border-b border-brand-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-[4px] flex items-center gap-2">
              <ShieldCheck size={18} className="text-brand-success" /> Identity Sovereignty Nexus
            </h3>
            <p className="text-[9px] text-brand-text/50 uppercase tracking-widest mt-0.5">Primary Handheld Anchor Point</p>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={initiateFlush}
               disabled={isFlushing}
               className={cn(
                 "px-3 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all animate-pulse",
                 isFlushing ? "bg-brand-danger text-white" : "bg-brand-accent/20 text-brand-accent hover:bg-brand-accent hover:text-white border border-brand-accent/30"
               )}
             >
               {isFlushing ? "FLUSHING_SHADOWS..." : "SOVEREIGN_FLUSH"}
             </button>
             <div className="flex items-center gap-2 border-l border-brand-border pl-4">
                <Smartphone size={14} className="text-brand-success" />
                <span className="text-[9px] font-black text-brand-success uppercase tracking-widest">Handheld Linked</span>
             </div>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {anchors.map((anchor, i) => (
            <motion.div
              key={anchor.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-4 rounded-lg border transition-all flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden",
                anchor.is_flagged ? "bg-brand-danger/10 border-brand-danger/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" :
                anchor.status === "anchored" ? "bg-brand-success/5 border-brand-success/30 shadow-[0_0_15px_rgba(34,197,94,0.05)]" : "bg-brand-bg border-brand-border"
              )}
            >
              {anchor.is_flagged && (
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-danger" />
              )}
              <div className={cn(
                "p-3 rounded-full",
                anchor.is_flagged ? "bg-brand-danger/20 text-brand-danger animate-pulse" :
                anchor.status === "anchored" ? "bg-brand-success/20 text-brand-success shadow-[0_0_10px_rgba(34,197,94,0.2)]" : "bg-brand-accent/20 text-brand-accent"
              )}>
                {getIcon(anchor.type)}
              </div>
              <div>
                <div className="flex items-center gap-1 justify-center mb-1">
                  <span className={cn(
                    "text-[7px] font-black uppercase px-1 rounded",
                    anchor.role === "primary" ? "bg-brand-success text-brand-bg" : "bg-brand-warning text-brand-bg"
                  )}>
                    {anchor.role}
                  </span>
                  <span className="text-[9px] font-bold text-white/70 uppercase tracking-tighter">{anchor.label}</span>
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[2px] mb-1">{anchor.type} Recognition</h4>
                <div className={cn(
                  "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest mb-2",
                  anchor.is_flagged ? "bg-brand-danger text-white" :
                  anchor.status === "anchored" ? "bg-brand-success/20 text-brand-success" : "bg-brand-warning/20 text-brand-warning"
                )}>
                  {anchor.is_flagged ? "FLAGGED" : anchor.status === "anchored" ? "Anchored" : "Ingesting..."}
                </div>

                {anchor.origin_mac ? (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[7px] font-black text-brand-text/30 uppercase">Origin MAC:</span>
                    <span className={cn(
                      "text-[8px] font-mono",
                      anchor.origin_mac === "77:88:99:AA:BB:CC" ? "text-brand-success" : "text-brand-danger"
                    )}>
                      {anchor.origin_mac}
                    </span>
                  </div>
                ) : (
                  <span className="text-[8px] font-mono text-brand-text/30 italic">No Origin Data</span>
                )}
              </div>
              <div className="text-[8px] font-mono text-brand-text/40">
                 {new Date(anchor.last_anchor_ts).toLocaleTimeString()}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="px-6 py-4 bg-brand-accent/5 border-t border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
               <div className="w-6 h-6 rounded-full border border-brand-border bg-brand-bg flex items-center justify-center">
                  <Smartphone size={10} className="text-brand-success" />
               </div>
               <div className="w-6 h-6 rounded-full border border-brand-border bg-brand-bg flex items-center justify-center">
                  <Monitor size={10} className="text-brand-success" />
               </div>
            </div>
            <p className="text-[9px] text-brand-text/60 uppercase font-bold">Anchored to Phone & Logic Root</p>
          </div>
          <button 
            onClick={() => alert("IDENTITY_SYNC: Biometric entropy pools have been refreshed. Sovereignty re-anchored to primary handheld device.")}
            className="flex items-center gap-2 text-[9px] font-black text-brand-accent hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
          >
             <RefreshCw size={12} /> Sync Identity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
           <NaturalLanguageInterface />
        </div>
        <div className="lg:col-span-4 space-y-4">
           <div className="bg-brand-card border border-brand-border rounded-xl p-6 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-brand-accent/10 rounded flex items-center justify-center mb-6 border border-brand-accent/20">
                   <Binary size={24} className="text-brand-accent" />
                </div>
                <h4 className="text-lg font-black uppercase italic tracking-tighter text-white mb-2">Metadata Stream</h4>
                <p className="text-[11px] text-brand-text leading-relaxed">
                   The Biometric Nexus ingests real-time voice and visual telemetry from anchored devices. 
                   Sovereign Semantic Link allows the primary user to interact with the Guardian logic root directly through natural language.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-brand-border flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-[9px] text-brand-text/40 font-bold uppercase uppercase">Link Status</span>
                    <span className="text-xs font-black text-brand-success uppercase">Active Ingest</span>
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-[9px] text-brand-text/40 font-bold uppercase">Encryption</span>
                    <span className="text-xs font-black text-white uppercase italic">Sovereign_09</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}


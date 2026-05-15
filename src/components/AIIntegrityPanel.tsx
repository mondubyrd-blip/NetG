import React from "react";
import { AIIntegrityState, CompromiseAttempt } from "@/src/types";
import { ShieldAlert, BrainCircuit, Activity, Lock, AlertTriangle, ShieldCheck, ZapOff, History, RefreshCcw } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

interface AIIntegrityPanelProps {
  state: AIIntegrityState;
  attempts: CompromiseAttempt[];
  onMitigate?: () => void;
  onPurge?: () => void;
  onHardcode?: () => void;
}

export default function AIIntegrityPanel({ state, attempts, onMitigate, onPurge, onHardcode }: AIIntegrityPanelProps) {
  const [isMitigating, setIsMitigating] = React.useState(false);
  const [isPurging, setIsPurging] = React.useState(false);
  const [isHardcoding, setIsHardcoding] = React.useState(false);

  const handleMitigate = async () => {
    if (!onMitigate) return;
    setIsMitigating(true);
    await onMitigate();
    setTimeout(() => setIsMitigating(false), 2000);
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
      <div className="bg-brand-danger/10 px-6 py-4 border-b border-brand-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-danger/20 rounded shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <BrainCircuit size={20} className="text-brand-danger" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[4px] text-white">AI Agent Defenses</h3>
            <p className="text-[9px] text-brand-text/50 uppercase tracking-widest mt-0.5">Autonomous Sovereignty Monitoring</p>
          </div>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border animate-pulse",
          state.firewall_status === "hardened" ? "bg-brand-success/20 text-brand-success border-brand-success/30" : "bg-brand-danger/20 text-brand-danger border-brand-danger/30"
        )}>
          {state.firewall_status === "hardened" ? "SEMANTIC_FIREWALL_HARDENED" : "FIREWALL_BREACH_WARNING"}
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Stats */}
        <div className="space-y-3">
          <div className="p-4 bg-brand-bg/50 border border-brand-border rounded-lg relative overflow-hidden">
             <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-black uppercase text-brand-text/40 tracking-widest">Integrity Metrics</span>
               <Activity size={14} className="text-brand-accent" />
             </div>
             
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
               <div className="space-y-4">
                 <div>
                   <div className="flex justify-between text-[10px] font-bold text-white mb-1 uppercase tracking-tighter">
                     <span>Model Alignment</span>
                     <span className="text-brand-success">{state.model_alignment}%</span>
                   </div>
                   <div className="h-1.5 bg-brand-border/30 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${state.model_alignment}%` }}
                       className="h-full bg-brand-success"
                     />
                   </div>
                 </div>

                 <div>
                   <div className="flex justify-between text-[10px] font-bold text-white mb-1 uppercase tracking-tighter">
                     <span>Semantic Drift</span>
                     <span className={cn(state.semantic_drift > 20 ? "text-brand-danger" : "text-brand-accent")}>
                       {state.semantic_drift}%
                     </span>
                   </div>
                   <div className="h-1.5 bg-brand-border/30 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${state.semantic_drift}%` }}
                       className={cn("h-full", state.semantic_drift > 20 ? "bg-brand-danger" : "bg-brand-accent")}
                     />
                   </div>
                 </div>
               </div>

               {state.session_risk && (
                 <div className="flex flex-col items-center justify-center p-3 bg-brand-accent/5 rounded-lg border border-brand-accent/20">
                    <span className="text-[9px] font-black uppercase text-brand-accent tracking-widest mb-2">Session Risk Score</span>
                    <div className="relative flex items-center justify-center">
                       <svg className="w-20 h-20 transform -rotate-90">
                          <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-brand-border/20" />
                          <motion.circle 
                            cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent"
                            strokeDasharray={213.6}
                            initial={{ strokeDashoffset: 213.6 }}
                            animate={{ strokeDashoffset: 213.6 - (213.6 * state.session_risk.overall_score) / 100 }}
                            className={cn(
                              state.session_risk.overall_score > 50 ? "text-brand-danger" : "text-brand-success"
                            )}
                          />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-black text-white leading-none">{state.session_risk.overall_score}</span>
                          <span className="text-[7px] font-bold text-brand-text/40 tracking-widest uppercase">Index</span>
                       </div>
                    </div>
                    <div className="flex gap-3 mt-3">
                       <div className="flex items-center gap-1">
                          <div className={cn("w-1.5 h-1.5 rounded-full", state.session_risk.dlp_status === "clear" ? "bg-brand-success" : "bg-brand-danger")} />
                          <span className="text-[8px] font-black uppercase text-white/50">DLP</span>
                       </div>
                       <div className="flex items-center gap-1">
                          <div className={cn("w-1.5 h-1.5 rounded-full", state.session_risk.injection_detected ? "bg-brand-danger" : "bg-brand-success")} />
                          <span className="text-[8px] font-black uppercase text-white/50">INJECTION</span>
                       </div>
                    </div>
                 </div>
               )}
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-brand-bg/50 border border-brand-border rounded-lg text-center">
              <span className="text-[9px] font-black uppercase text-brand-text/40 block mb-1">Jailbreak Attempts</span>
              <span className="text-2xl font-black text-white font-mono">{state.jailbreak_attempts}</span>
            </div>
            <div className="p-4 bg-brand-bg/50 border border-brand-border rounded-lg text-center">
              <span className="text-[9px] font-black uppercase text-brand-text/40 block mb-1">Defensive Tier</span>
              <span className="text-2xl font-black text-brand-success font-mono italic">09</span>
            </div>
          </div>
        </div>

        {/* Compromise Attempts Log */}
        <div className="bg-brand-bg/50 border border-brand-border rounded-lg flex flex-col h-full">
          <div className="p-3 border-b border-brand-border bg-brand-bg/80 flex items-center gap-2">
            <History size={14} className="text-brand-text/40" />
            <span className="text-[10px] font-black uppercase text-brand-text/40 tracking-widest">Compromise Vector Log</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[160px] p-2 space-y-2 custom-scrollbar">
            {attempts.map(attempt => (
              <div key={attempt.id} className="p-2 border border-brand-border/50 bg-brand-card/30 rounded flex items-start gap-3 group hover:border-brand-danger/30 transition-all">
                <div className={cn(
                  "p-1.5 rounded mt-0.5",
                  attempt.severity === "critical" ? "bg-brand-danger/20 text-brand-danger" : "bg-brand-warning/20 text-brand-warning"
                )}>
                  {attempt.vector === "semantic_injection" ? <ShieldAlert size={14} /> : <ZapOff size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-black text-white truncate uppercase tracking-tighter">{attempt.vector.replace("_", " ")}</span>
                    <span className="text-[8px] font-mono text-brand-text/40">{new Date(attempt.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[7px] font-bold text-brand-text/40 uppercase">{attempt.source}</span>
                    <span className={cn(
                      "text-[7px] font-black px-1 rounded uppercase",
                      attempt.status === "blocked" ? "bg-brand-success text-brand-bg" : "bg-brand-warning text-brand-bg"
                    )}>
                      {attempt.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-brand-danger/5 border-t border-brand-border flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-3 min-w-max">
          <button 
            onClick={handleMitigate}
            disabled={isMitigating}
            className={cn(
              "flex items-center gap-2 text-[9px] font-black px-4 py-2 rounded transition-all uppercase tracking-widest shadow-lg cursor-pointer",
              isMitigating ? "bg-brand-warning text-white animate-pulse" : "bg-brand-accent text-white hover:bg-brand-accent/80 shadow-brand-accent/30"
            )}
          >
            <ShieldCheck size={12} className={isMitigating ? "animate-spin" : ""} />
            {isMitigating ? "RECONSTRUCTING_FIREWALL..." : "Execute Collective Mitigation"}
          </button>
          
          <button 
            onClick={async () => {
              if (onHardcode) {
                setIsHardcoding(true);
                await onHardcode();
                setTimeout(() => setIsHardcoding(false), 2000);
              }
            }}
            disabled={isHardcoding || state.firewall_status === "hardened"}
            className={cn(
              "flex items-center gap-2 text-[9px] font-black px-3 py-2 border rounded hover:text-white transition-all uppercase tracking-widest cursor-pointer",
              state.firewall_status === "hardened" ? "bg-brand-success text-white border-brand-success cursor-not-allowed" : "bg-brand-card border-brand-border text-brand-text/50 hover:bg-brand-border hover:text-white"
            )}
          >
             {isHardcoding ? <RefreshCcw size={12} className="animate-spin" /> : <Lock size={12} />}
             {state.firewall_status === "hardened" ? "Protocols Hardcoded" : isHardcoding ? "ANCHORING_LOGIC..." : "Hardcode Protocols"}
          </button>

          <button 
            onClick={async () => {
              if (onPurge) {
                setIsPurging(true);
                await onPurge();
                setTimeout(() => setIsPurging(false), 2000);
              }
            }}
            disabled={isPurging}
            className={cn(
              "flex items-center gap-2 text-[9px] font-black px-3 py-2 border rounded hover:text-white transition-all uppercase tracking-widest cursor-pointer",
              isPurging ? "bg-brand-warning text-white animate-pulse border-brand-warning" : "bg-brand-danger/20 text-brand-danger border-brand-danger/30 hover:bg-brand-danger"
            )}
          >
            {isPurging ? <RefreshCcw size={12} className="animate-spin" /> : <ZapOff size={12} />}
            {isPurging ? "PURGING_BUFFERS..." : "Emergency AI Purge"}
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-brand-success font-black uppercase italic">
          <ShieldCheck size={14} /> Reasoning Engine Protected
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { GovernanceAction } from "@/src/types";
import { 
  Terminal, 
  Cpu, 
  Settings, 
  Zap, 
  ShieldAlert, 
  Clock, 
  Fingerprint, 
  FileCode, 
  Activity,
  Play,
  ArrowRight,
  Lock,
  Pause
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface GovernanceCradleProps {
  actions: GovernanceAction[];
}

export default function GovernanceCradle({ actions }: GovernanceCradleProps) {
  const [filter, setFilter] = useState<"all" | "automatic" | "manual">("all");
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);

  const filteredActions = actions.filter(a => {
    if (filter === "all") return true;
    return a.execution_mode === filter || (filter === "automatic" && a.execution_mode === "biometric_triggered");
  });

  const getActionIcon = (type: string) => {
    switch (type) {
      case "command": return <Terminal size={18} />;
      case "script": return <FileCode size={18} />;
      case "config_change": return <Settings size={18} />;
      case "biometric_lock": return <Fingerprint size={18} />;
      default: return <Activity size={18} />;
    }
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case "critical": return "text-brand-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]";
      case "high": return "text-brand-danger";
      case "medium": return "text-brand-warning";
      case "low": return "text-brand-accent";
      default: return "text-brand-text/50";
    }
  };

  const selectedAction = actions.find(a => a.id === selectedActionId);

  return (
    <div className="flex flex-col gap-6 h-full min-h-[600px]">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-brand-card/30 border border-brand-border p-4 rounded-xl">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-bg rounded-lg border border-brand-border shadow-inner">
               <Cpu size={24} className="text-brand-accent animate-pulse" />
            </div>
            <div>
               <h2 className="text-lg font-black uppercase tracking-[5px] text-white italic">Governance Cradle</h2>
               <p className="text-[10px] text-brand-text/40 uppercase tracking-[3px]">Universal Oversight & Automation Vertex</p>
            </div>
         </div>

         <div className="flex items-center bg-black/40 rounded-lg p-1 border border-brand-border shadow-inner">
            {(["all", "automatic", "manual"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={cn(
                  "px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all",
                  filter === mode ? "bg-brand-accent text-white shadow-lg" : "text-brand-text/40 hover:text-brand-text"
                )}
              >
                {mode}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
         {/* Action List */}
         <div className="xl:col-span-8 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {filteredActions.map((action, i) => (
                 <motion.div
                   key={action.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.05 }}
                   onClick={() => setSelectedActionId(action.id)}
                   className={cn(
                     "group relative bg-brand-card border rounded-xl p-5 cursor-pointer transition-all hover:scale-[1.01]",
                     selectedActionId === action.id ? "border-brand-accent ring-1 ring-brand-accent/50 shadow-[0_0_30px_rgba(51,93,148,0.2)]" : "border-brand-border/40 hover:border-brand-border"
                   )}
                 >
                    <div className="flex items-start justify-between mb-4">
                       <div className={cn(
                         "p-2 rounded bg-brand-bg border border-brand-border transition-colors group-hover:border-brand-accent/50",
                         selectedActionId === action.id ? "text-brand-accent border-brand-accent/50" : "text-brand-text/40"
                       )}>
                          {getActionIcon(action.type)}
                       </div>
                       <div className={cn(
                         "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                         action.execution_mode === "automatic" ? "bg-brand-success/10 text-brand-success border-brand-success/30" : 
                         action.execution_mode === "biometric_triggered" ? "bg-brand-accent/10 text-brand-accent border-brand-accent/30" : "bg-brand-warning/10 text-brand-warning border-brand-warning/30"
                       )}>
                          {action.execution_mode}
                       </div>
                    </div>

                    <div>
                       <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2">{action.name}</h3>
                       <p className="text-[10px] text-brand-text/50 line-clamp-2 italic mb-4 leading-relaxed tracking-tight group-hover:text-brand-text/80 transition-colors">
                          {action.description}
                       </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-border/30 pt-4 mt-auto">
                       <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                             <span className="text-[7px] font-black text-brand-text/30 uppercase">Impact</span>
                             <span className={cn("text-[8px] font-black uppercase", getImpactColor(action.impact_level))}>
                                {action.impact_level}
                             </span>
                          </div>
                          <div className="w-[1px] h-4 bg-brand-border/40" />
                          <div className="flex flex-col">
                             <span className="text-[7px] font-black text-brand-text/30 uppercase">Status</span>
                             <span className={cn(
                               "text-[8px] font-black uppercase",
                               action.status === "running" ? "text-brand-success animate-pulse" : 
                               action.status === "intercepted" ? "text-brand-danger" : "text-brand-text/60"
                             )}>
                                {action.status}
                             </span>
                          </div>
                       </div>
                       <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[8px] font-black text-brand-accent uppercase tracking-widest">Detail</span>
                          <ArrowRight size={10} className="text-brand-accent" />
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         {/* Detailed View / Cradle Status */}
         <div className="xl:col-span-4 space-y-6">
            <AnimatePresence mode="wait">
               {selectedAction ? (
                 <motion.div
                   key={selectedAction.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="bg-brand-card border border-brand-accent/30 rounded-xl overflow-hidden shadow-2xl sticky top-6"
                 >
                    <div className="bg-brand-accent/10 border-b border-brand-accent/20 px-6 py-4 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-brand-accent/20 rounded shadow-inner">
                             {getActionIcon(selectedAction.type)}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[3px] text-white">Action Matrix Detail</span>
                       </div>
                       <button 
                         onClick={() => setSelectedActionId(null)}
                         className="text-brand-text/40 hover:text-white transition-colors"
                       >
                          <Pause size={14} />
                       </button>
                    </div>

                    <div className="p-6 space-y-6">
                       <div>
                          <h4 className="text-[9px] font-black text-brand-text/40 uppercase tracking-[2px] mb-2">Protocol Name</h4>
                          <h3 className="text-lg font-black text-white italic tracking-widest">{selectedAction.name}</h3>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-brand-bg/50 border border-brand-border rounded-lg">
                             <div className="flex items-center gap-2 mb-1">
                                <Clock size={10} className="text-brand-text/40" />
                                <span className="text-[8px] font-black text-brand-text/40 uppercase">Last Execution</span>
                             </div>
                             <span className="text-[10px] font-mono text-white/80">{new Date(selectedAction.last_execution).toLocaleTimeString()}</span>
                          </div>
                          <div className="p-3 bg-brand-bg/50 border border-brand-border rounded-lg">
                             <div className="flex items-center gap-2 mb-1">
                                <ShieldAlert size={10} className="text-brand-text/40" />
                                <span className="text-[8px] font-black text-brand-text/40 uppercase">Source Anchor</span>
                             </div>
                             <span className="text-[10px] font-mono text-white/80 truncate block">{selectedAction.source_anchor}</span>
                          </div>
                       </div>

                       <div>
                          <h4 className="text-[9px] font-black text-brand-text/40 uppercase tracking-[2px] mb-2">Technical Description</h4>
                          <div className="p-4 bg-black/60 border border-brand-border rounded-lg shadow-inner">
                             <p className="text-xs text-brand-text/80 leading-relaxed font-mono italic">
                                {selectedAction.description}
                             </p>
                          </div>
                       </div>

                       <div className="flex items-center gap-3 pt-4">
                          <button 
                            className="flex-1 py-3 bg-brand-accent hover:opacity-90 text-white font-black uppercase text-[10px] tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-accent/20 cursor-pointer"
                            onClick={() => alert(`PROTOCOL_RUN: Initiating ${selectedAction.name}. Sequential governance buffers initialized.`)}
                          >
                             <Play size={14} fill="currentColor" /> Force Execute
                          </button>
                          <button 
                            className="py-3 px-4 bg-brand-danger/10 hover:bg-brand-danger text-brand-danger hover:text-white border border-brand-danger/30 rounded-lg transition-all cursor-pointer"
                            onClick={() => alert("PROTOCOL_SEAL: Action blacklisted. Identity authorization required for future runs.")}
                          >
                             <Lock size={14} />
                          </button>
                       </div>
                    </div>
                    
                    <div className="bg-brand-bg border-t border-brand-border p-4 flex items-center justify-center gap-2">
                       <Zap size={12} className="text-brand-success animate-pulse" />
                       <span className="text-[8px] font-black uppercase text-brand-success tracking-[4px]">Verified Sovereign Logic Path</span>
                    </div>
                 </motion.div>
               ) : (
                 <div className="h-full border border-brand-border/30 border-dashed rounded-xl flex flex-col items-center justify-center p-12 text-center opacity-30 sticky top-6">
                    <Activity size={48} strokeWidth={1} className="mb-4" />
                    <h3 className="text-[10px] font-black uppercase tracking-[5px]">Protocol_Detail_Idle</h3>
                    <p className="text-[8px] uppercase tracking-widest mt-2 max-w-[200px]">Select any sovereign action to inspect its logic and recent performance telemetry.</p>
                 </div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}

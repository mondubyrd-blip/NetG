import React from "react";
import { Command } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { Terminal, ShieldCheck, ShieldAlert, Cpu, Globe, CloudOff, FileCode, Calendar, Check, X, ShieldX } from "lucide-react";
import { format } from "date-fns";

interface CommandCenterProps {
  commands: Command[];
  onApprove: (id: string) => void;
  onQuarantine: (id: string) => void;
}

export default function CommandCenter({ commands, onApprove, onQuarantine }: CommandCenterProps) {
  const pendingCount = commands.filter(c => c.status === "pending").length;

  const getTypeIcon = (type: Command["type"]) => {
    switch (type) {
      case "online": return <Globe size={14} className="text-brand-accent" />;
      case "offline": return <CloudOff size={14} className="text-brand-warning" />;
      case "scripted": return <FileCode size={14} className="text-brand-success" />;
      case "scheduled": return <Calendar size={14} className="text-brand-danger" />;
    }
  };

  return (
    <div className="bg-brand-card/30 border border-brand-border rounded-xl overflow-hidden backdrop-blur-md">
      <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-bg/40">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[4px] text-white flex items-center gap-2">
            <Terminal size={18} className="text-brand-danger animate-pulse" /> Sovereign_Logic_Intercept
          </h3>
          <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest mt-0.5">
            Human-in-the-loop Governance | {pendingCount} PENDING_INTERACTION
          </p>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
          pendingCount > 0 ? "bg-brand-danger/20 text-brand-danger border border-brand-danger/40 animate-pulse" : "bg-brand-success/20 text-brand-success border border-brand-success/40"
        )}>
          {pendingCount > 0 ? "G_PROTOCOL: INTERCEPTION_ACTIVE" : "G_PROTOCOL: IDLE"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-brand-border">
        {commands.map((cmd) => (
          <div 
            key={cmd.id} 
            className={cn(
              "p-4 rounded-xl border transition-all relative overflow-hidden",
              cmd.status === "pending" ? (
                cmd.risk_score >= 90 
                  ? "bg-brand-card border-brand-danger/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-[pulse_2s_infinite]" 
                  : "bg-brand-card border-brand-border shadow-lg"
              ) : 
              cmd.status === "approved" ? "bg-brand-success/5 border-brand-success/20 opacity-60" : 
              "bg-brand-danger/5 border-brand-danger/20 opacity-60 grayscale"
            )}
          >
            {cmd.status !== "pending" && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 text-[9px] font-black uppercase border border-white/10 z-10">
                {cmd.status === "approved" ? <ShieldCheck size={10} className="text-brand-success" /> : <ShieldX size={10} className="text-brand-danger" />}
                {cmd.status}
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-bg/60 border border-brand-border flex items-center justify-center">
                  {getTypeIcon(cmd.type)}
                </div>
                <div>
                  <div className="text-[10px] font-black text-brand-text/40 uppercase tracking-widest leading-none mb-1">
                    {cmd.type}_Command
                  </div>
                  <div className="text-[11px] font-mono text-white break-all font-bold">
                    {cmd.payload}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-[10px]">
              <div className="flex justify-between items-center text-brand-text/60">
                <span className="font-bold uppercase tracking-tight">Command_Origin:</span>
                <span className="font-mono text-white bg-brand-border/30 px-1 rounded">{cmd.source}</span>
              </div>
              <div className="flex justify-between items-center text-brand-text/60">
                <span className="font-bold uppercase tracking-tight">Creation_Logic:</span>
                <span className="font-mono text-white">{cmd.creation_point}</span>
              </div>
              <div className="flex justify-between items-center text-brand-text/60">
                <span className="font-bold uppercase tracking-tight">Process_Link:</span>
                <span className="font-mono text-brand-accent">PID:{cmd.processId}</span>
              </div>
              <div className="flex justify-between items-center text-brand-text/60">
                <span className="font-bold uppercase tracking-tight">Risk_Assessment:</span>
                <div className="flex items-center gap-2">
                   {cmd.risk_score >= 90 && (
                     <span className="animate-pulse flex items-center gap-1 bg-brand-danger text-white px-1.5 py-0.5 rounded text-[8px] font-black italic">
                       <ShieldAlert size={10} /> THREAT
                     </span>
                   )}
                   <span className={cn(
                     "font-black tracking-widest px-1.5 py-0.5 rounded",
                     cmd.risk_score > 80 ? "text-brand-danger bg-brand-danger/10" : "text-brand-warning bg-brand-warning/10"
                   )}>{cmd.risk_score}%</span>
                </div>
              </div>
            </div>

            {cmd.status === "pending" && (
              <div className="flex gap-2 mt-5 pt-4 border-t border-brand-border/50">
                <button 
                  onClick={() => onApprove(cmd.id)}
                  className="flex-1 bg-brand-success/10 hover:bg-brand-success/20 text-brand-success border border-brand-success/30 rounded-lg py-2 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Check size={14} /> Authorize
                </button>
                <button 
                  onClick={() => onQuarantine(cmd.id)}
                  className="flex-1 bg-brand-danger/10 hover:bg-brand-danger/20 text-brand-danger border border-brand-danger/30 rounded-lg py-2 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <ShieldX size={14} /> Quarantine
                </button>
              </div>
            )}
          </div>
        ))}

        {commands.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-20">
             <Cpu size={48} className="mx-auto mb-4" />
             <p className="font-black uppercase tracking-widest">No Commands Intercepted</p>
          </div>
        )}
      </div>
    </div>
  );
}

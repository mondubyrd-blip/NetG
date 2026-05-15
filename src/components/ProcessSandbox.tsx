import React from "react";
import { NetworkProcess } from "@/src/types";
import { Lock, Cpu, CheckCircle2, AlertTriangle, Activity, Shield, Eye } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ProcessSandboxProps {
  processes: NetworkProcess[];
}

export default function ProcessSandbox({ processes }: ProcessSandboxProps) {
  return (
    <div className="bg-brand-card/20 border border-brand-border rounded-lg overflow-hidden">
      <div className="bg-brand-accent/30 px-4 py-2 border-b border-brand-border flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Cpu size={14} /> Process Governance Sandbox
        </h3>
        <span className="text-[9px] font-mono opacity-50">RECORD_COUNT: {processes.length}</span>
      </div>
      
      <div className="p-2 space-y-1">
        {processes.map(proc => (
          <div key={proc.pid} className={cn(
            "flex items-center justify-between p-2 rounded transition-all border",
            proc.governance_state === "quarantined" || proc.governance_state === "sandboxed" ? "bg-brand-danger/5 border-brand-danger/20 hover:bg-brand-danger/10" : "bg-brand-bg/50 border-transparent hover:bg-brand-accent/10"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-1.5 rounded",
                proc.governance_state === "sandboxed" ? "bg-brand-danger/20 text-brand-danger" : 
                proc.governance_state === "frozen" ? "bg-brand-accent/20 text-brand-accent" :
                proc.governance_state === "quarantined" ? "bg-brand-danger text-white" : "bg-brand-success/20 text-brand-success"
              )}>
                {proc.governance_state === "sandboxed" ? <Lock size={12} /> : 
                 proc.governance_state === "frozen" ? <Activity size={12} className="rotate-90" /> :
                 proc.governance_state === "quarantined" ? <Shield size={12} /> : <CheckCircle2 size={12} />}
              </div>
              <div>
                <div className="text-[11px] font-bold text-white flex items-center gap-2">
                  {proc.name}
                  {proc.classification && (
                    <span className={cn(
                      "text-[7px] px-1 rounded uppercase tracking-[1px] font-black",
                      proc.classification === "system_core" ? "bg-brand-accent/20 text-brand-accent" :
                      proc.classification === "user_task" ? "bg-brand-success/20 text-brand-success" :
                      proc.classification === "scripted_process" ? "bg-brand-warning/20 text-brand-warning" :
                      "bg-brand-danger/20 text-brand-danger animate-pulse"
                    )}>
                      {proc.classification.replace("_", " ")}
                    </span>
                  )}
                </div>
                <div className="text-[9px] font-mono text-brand-text/50 uppercase tracking-tighter">
                  PID: {proc.pid} | CPU: {proc.consumption} | {proc.governance_state === "quarantined" ? "PATH: SEALED" : `USER: ${proc.user}`}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => alert(`PROCESS_PURGE: PID ${proc.pid} (${proc.name}) has been forcefully terminated. Memory buffers zeroed.`)}
                className="p-1.5 bg-brand-danger/10 hover:bg-brand-danger text-brand-danger hover:text-white rounded border border-brand-danger/20 transition-all cursor-pointer"
                title="Terminate Process"
              >
                <ZapOff size={10} />
              </button>
              <div className={cn(
                "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter border",
                proc.governance_state === "sandboxed" ? "bg-brand-danger/20 text-brand-danger border-brand-danger/30" : 
                proc.governance_state === "quarantined" ? "bg-brand-danger text-white border-brand-danger shadow-[0_0_8px_rgba(239,68,68,0.4)]" :
                proc.governance_state === "frozen" ? "bg-brand-accent/20 text-brand-accent border-brand-accent/30" : "bg-brand-success/20 text-brand-success border-brand-success/30"
              )}>
                {proc.governance_state}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ZapOff({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m10.5 7-3.5 6h5l-3.5 6" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

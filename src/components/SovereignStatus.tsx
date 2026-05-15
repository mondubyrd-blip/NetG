import React from "react";
import { ConnectivityState } from "@/src/types";
import { Shield, Crown, Eye, HeartPulse, ShieldCheck } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

interface SovereignStatusProps {
  state: ConnectivityState | null;
}

export default function SovereignStatus({ state }: SovereignStatusProps) {
  if (!state) return null;

  const isAlarm = state.guardian_status !== "vigilant" || state.halted_count > 0;

  return (
    <div className={cn(
      "p-6 rounded-xl border-l-8 transition-all duration-500",
      isAlarm ? "bg-brand-danger/10 border-l-brand-danger shadow-[0_0_30px_rgba(248,81,73,0.15)]" : "bg-brand-accent/10 border-l-brand-success"
    )}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
           <div className={cn(
             "p-4 rounded-full transition-transform duration-500",
             isAlarm ? "bg-brand-danger text-white animate-pulse" : "bg-brand-success text-white"
           )}>
             {isAlarm ? <Crown size={32} /> : <Shield size={32} />}
           </div>
           
           <div>
             <h2 className="text-2xl font-black tracking-tighter uppercase italic">
                {state.guardian_status === "vigilant" ? "Anchored Presence" : "Sovereign Intervention"}
             </h2>
             <div className="flex items-center gap-3 mt-1">
               <span className="flex items-center gap-1 text-[10px] font-bold text-brand-text/60 uppercase tracking-[2px] leading-none">
                 <Eye size={12} className="text-brand-accent" /> Passive Scouting
               </span>
               <span className="w-1 h-1 rounded-full bg-brand-text/30" />
               <span className="flex items-center gap-1 text-[10px] font-bold text-brand-text/60 uppercase tracking-[2px] leading-none">
                 <ShieldCheck size={12} className="text-brand-success" /> Master Witness
               </span>
             </div>
           </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="bg-brand-bg/50 px-4 py-2 rounded border border-brand-border">
            <h4 className="text-[9px] uppercase font-bold text-brand-text/40 mb-1">Authorization Queue</h4>
            <div className={cn(
              "text-lg font-black font-mono leading-none",
              state.halted_count > 0 ? "text-brand-danger" : "text-brand-success"
            )}>
              {state.halted_count.toString().padStart(2, '0')} <span className="text-xs uppercase ml-1">Halted</span>
            </div>
          </div>

          <div className="bg-brand-bg/50 px-4 py-2 rounded border border-brand-border">
            <h4 className="text-[9px] uppercase font-bold text-brand-text/40 mb-1">Identity Anchor</h4>
            <div className={cn(
              "text-lg font-black font-mono leading-none",
              state.biometric_sovereignty?.every(a => a.status === "anchored") ? "text-brand-success" : "text-brand-warning animate-pulse"
            )}>
              {state.biometric_sovereignty?.every(a => a.status === "anchored") ? "DUAL_SOVEREIGN_LOCKED" : "LINK_IN_PROGRESS"}
            </div>
            <p className="text-[8px] text-brand-text/30 uppercase mt-1">Authority: {state.biometric_sovereignty?.filter(a => a.status === "anchored").length}/{state.biometric_sovereignty?.length} Anchors</p>
          </div>
          
          <div className="bg-brand-bg/50 px-4 py-2 rounded border border-brand-border">
            <h4 className="text-[9px] uppercase font-bold text-brand-text/40 mb-1">Governance Protocols</h4>
            <div className="text-lg font-black font-mono leading-none text-brand-accent">
              {(state.governance_cradle?.length || 0).toString().padStart(2, '0')} <span className="text-xs uppercase ml-1">Active Protocols</span>
            </div>
            <p className="text-[8px] text-brand-text/30 uppercase mt-1">Automatic: {state.governance_cradle?.filter(a => a.execution_mode === "automatic").length}</p>
          </div>

          <div className="bg-brand-bg/50 px-4 py-2 rounded border border-brand-border">
            <h4 className="text-[9px] uppercase font-bold text-brand-text/40 mb-1">State Transition</h4>
            <div className={cn(
              "text-lg font-black font-mono leading-none",
              state.system_transition !== "none" ? "text-brand-warning animate-pulse" : "text-brand-success"
            )}>
              {state.system_transition !== "none" ? state.system_transition.toUpperCase() : "STEADY_STATE"}
            </div>
            <p className="text-[8px] text-brand-text/30 uppercase mt-1">Immutability: Active</p>
          </div>

          <div className="bg-brand-bg/50 px-4 py-2 rounded border border-brand-border">
            <h4 className="text-[9px] uppercase font-bold text-brand-text/40 mb-1">Data Constellation</h4>
            <div className={cn(
              "text-lg font-black font-mono leading-none",
              state.data_stasis_active ? "text-brand-danger" : "text-brand-success"
            )}>
              {state.data_stasis_active ? "STASIS_LOCKED" : "ACTIVE"}
            </div>
          </div>
          
          <div className="bg-brand-bg/50 px-4 py-2 rounded border border-brand-border">
            <h4 className="text-[9px] uppercase font-bold text-brand-text/40 mb-1">Authority Lock</h4>
            <div className={cn(
              "text-lg font-black font-mono leading-none text-brand-danger"
            )}>
              {state.barred_count.toString().padStart(2, '0')} <span className="text-xs uppercase ml-1">Barred Permanently</span>
            </div>
          </div>
          
          <div className="bg-brand-bg/50 px-4 py-2 rounded border border-brand-border">
            <h4 className="text-[9px] uppercase font-bold text-brand-text/40 mb-1">Validation Layer</h4>
            <div className="text-lg font-black font-mono text-white leading-none">
              7 <span className="text-xs uppercase ml-1 block-inline text-brand-text/70 italic">Final Day</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-brand-border/40 text-xs text-brand-text/60 flex items-center justify-between italic">
        <span>"Only the one who recognizes himself within may proceed."</span>
        <span className="font-mono uppercase opacity-30 tracking-[4px]">G-Protocol v5.24.S</span>
      </div>
    </div>
  );
}

import React from "react";
import { ToolGuardEvaluation } from "@/src/types";
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Terminal, Globe, HardDrive, Key, Package, Settings, Info } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface ToolGuardMonitorProps {
  evaluations: ToolGuardEvaluation[];
}

export default function ToolGuardMonitor({ evaluations }: ToolGuardMonitorProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "file_system": return <HardDrive size={14} />;
      case "code_execution": return <Terminal size={14} />;
      case "credentials": return <Key size={14} />;
      case "network": return <Globe size={14} />;
      case "destructive": return <ShieldX size={14} className="text-brand-danger" />;
      case "system_config": return <Settings size={14} />;
      case "packaging": return <Package size={14} />;
      default: return <Info size={14} />;
    }
  };

  const getRulingColor = (ruling: string) => {
    switch (ruling) {
      case "allow": return "text-brand-success";
      case "intercept": return "text-brand-warning";
      case "block": return "text-brand-danger";
      default: return "text-brand-text";
    }
  };

  const getRulingBg = (ruling: string) => {
    switch (ruling) {
      case "allow": return "bg-brand-success/10 border-brand-success/30";
      case "intercept": return "bg-brand-warning/10 border-brand-warning/30";
      case "block": return "bg-brand-danger/10 border-brand-danger/30";
      default: return "bg-brand-bg border-brand-border";
    }
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
      <div className="bg-brand-accent/20 px-6 py-4 border-b border-brand-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-accent/20 rounded shadow-[0_0_10px_rgba(51,93,148,0.2)]">
            <Shield size={20} className="text-brand-accent" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[4px] text-white">Ion ToolGuard</h3>
            <p className="text-[9px] text-brand-text/50 uppercase tracking-widest mt-0.5">Real-time Agent Tool Interception</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black uppercase text-brand-text/40 tracking-widest">Active Rules</span>
              <span className="text-xs font-black text-white italic">Hardened_Policy_v4</span>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
        <div className="divide-y divide-brand-border/50">
          <AnimatePresence initial={false}>
            {evaluations.map((evalItem, i) => (
              <motion.div
                key={evalItem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "p-4 flex flex-col gap-3 transition-all hover:bg-white/5 cursor-default",
                  evalItem.ruling === "block" && "bg-brand-danger/5"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded border",
                      getRulingBg(evalItem.ruling)
                    )}>
                      {getCategoryIcon(evalItem.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-black text-white uppercase tracking-tighter">{evalItem.tool_name}</span>
                        <span className="text-[7px] font-bold text-brand-text/40 uppercase font-mono">[{evalItem.id}]</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-brand-accent uppercase tracking-widest">{evalItem.category.replace("_", " ")}</span>
                        <div className="w-1 h-1 rounded-full bg-brand-border" />
                        <span className="text-[8px] font-mono text-brand-text/40">{new Date(evalItem.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase italic tracking-widest",
                      getRulingBg(evalItem.ruling),
                      getRulingColor(evalItem.ruling)
                    )}>
                      {evalItem.ruling === "block" ? "BLOCKED" : evalItem.ruling === "intercept" ? "INTERCEPTED" : "AUTHORIZED"}
                    </div>
                    <div className="text-[10px] font-black text-white/50">
                       Risk Index: <span className={cn(evalItem.risk_score > 70 ? "text-brand-danger" : "text-brand-success")}>{evalItem.risk_score}/100</span>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-bg/60 rounded border border-brand-border/30 p-2 font-mono text-[10px] text-brand-text/80 break-all">
                   <div className="text-[8px] font-black uppercase text-brand-text/30 mb-1">Payload Intercepted:</div>
                   {JSON.stringify(evalItem.arguments)}
                </div>

                {evalItem.policy_violated && (
                  <div className="flex items-center gap-2 text-[9px] font-bold text-brand-danger uppercase italic">
                     <ShieldAlert size={12} />
                     Policy Violation: {evalItem.policy_violated}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-brand-bg p-4 border-t border-brand-border flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
               <ShieldCheck size={14} className="text-brand-success" />
               <span className="text-[9px] font-black uppercase text-brand-text/50">DLP Active</span>
            </div>
            <div className="flex items-center gap-1.5">
               <ShieldCheck size={14} className="text-brand-success" />
               <span className="text-[9px] font-black uppercase text-brand-text/50">Injection Guard</span>
            </div>
         </div>
         <button 
           onClick={() => alert("GOVERNANCE_REFRESH: Fetching updated ToolGuard security policies...")}
           className="text-[9px] font-black text-brand-accent hover:text-white transition-colors uppercase tracking-[2px] cursor-pointer"
         >
            Refresh Governance
         </button>
      </div>
    </div>
  );
}

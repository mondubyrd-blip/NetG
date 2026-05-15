import React from "react";
import { NetworkProcess } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { BarChart3, Fingerprint, MousePointer2, FileJson, AlertTriangle, ShieldCheck } from "lucide-react";

interface ProcessIntegrityChartProps {
  processes: NetworkProcess[];
}

export default function ProcessIntegrityChart({ processes }: ProcessIntegrityChartProps) {
  const categories = [
    { id: "system_core", label: "Kernel/Core", icon: Fingerprint, color: "text-brand-accent", bgColor: "bg-brand-accent/10" },
    { id: "user_task", label: "Legitimate User", icon: MousePointer2, color: "text-brand-success", bgColor: "bg-brand-success/10" },
    { id: "scripted_process", label: "Scripted Tasks", icon: FileJson, color: "text-brand-warning", bgColor: "bg-brand-warning/10" },
    { id: "irregular_logic", label: "Irregular/Misuse", icon: AlertTriangle, color: "text-brand-danger", bgColor: "bg-brand-danger/10" }
  ];

  const stats = categories.map(cat => ({
    ...cat,
    count: processes.filter(p => p.classification === cat.id).length,
    avgReasoning: processes.filter(p => p.classification === cat.id).reduce((acc, p) => acc + (p.reasoning_score || 0), 0) / (processes.filter(p => p.classification === cat.id).length || 1)
  }));

  return (
    <div className="bg-brand-card/30 border border-brand-border rounded-xl p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
         <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white flex items-center gap-2">
            <BarChart3 size={16} className="text-brand-accent" /> Logic_Integrity_Comparison
         </h3>
         <div className="px-2 py-1 bg-brand-success/10 text-brand-success border border-brand-success/30 rounded text-[8px] font-black uppercase tracking-widest">
           Sovereign_Validation_Active
         </div>
      </div>

      <div className="space-y-6">
        {stats.map((cat) => (
          <div key={cat.id} className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={cn("p-1.5 rounded", cat.bgColor, cat.color)}>
                  <cat.icon size={14} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{cat.label}</span>
              </div>
              <div className="flex items-center gap-4 text-[10px]">
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-bold text-brand-text/40 uppercase leading-none mb-1">Threads</span>
                   <span className="font-mono text-white">{cat.count}</span>
                </div>
                <div className="flex flex-col items-end min-w-[80px]">
                   <span className="text-[8px] font-bold text-brand-text/40 uppercase leading-none mb-1">Logic Precision</span>
                   <span className={cn(
                     "font-mono font-black",
                     cat.avgReasoning > 80 ? "text-brand-success" : 
                     cat.avgReasoning > 50 ? "text-brand-warning" : "text-brand-danger animate-pulse"
                   )}>
                     {Math.round(cat.avgReasoning)}%
                   </span>
                </div>
              </div>
            </div>
            
            <div className="h-2 bg-brand-bg rounded-full overflow-hidden border border-brand-border/10">
              <div 
                className={cn("h-full transition-all duration-500", cat.color.replace("text-", "bg-"))}
                style={{ width: `${cat.avgReasoning}%` }}
              />
            </div>

            {cat.id === "irregular_logic" && cat.count > 0 && (
              <div className="mt-3 p-2 bg-brand-danger/5 border border-brand-danger/20 rounded text-[9px] text-brand-danger/80 italic font-medium flex items-start gap-2">
                 <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                 <span>Critical Anomaly: Detected reasoning patterns inconsistent with established biometric anchors. AI Contamination suspected.</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t border-brand-border/30">
        <div className="grid grid-cols-2 gap-4">
           <div className="p-3 bg-brand-bg/40 rounded-lg border border-brand-border">
              <div className="text-[8px] font-black text-brand-text/40 uppercase mb-2">Threat Vector Analysis</div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[9px]">
                   <span className="text-brand-text/60 font-bold uppercase">Subversive Intent</span>
                   <span className="text-brand-danger font-mono font-black">
                     {processes.filter(p => p.intent_vector === "subversive").length} PIDs
                   </span>
                </div>
                <div className="flex items-center justify-between text-[9px]">
                   <span className="text-brand-text/60 font-bold uppercase">Neutral Scripting</span>
                   <span className="text-brand-warning font-mono font-black">
                     {processes.filter(p => p.intent_vector === "neutral").length} PIDs
                   </span>
                </div>
              </div>
           </div>
           <div className="flex flex-col justify-center">
              <p className="text-[8px] text-brand-text/40 leading-relaxed uppercase font-bold text-center">
                Automated logic audits running every 10,000ms. Discrepancies between PRINCIPLE and PRACTICE trigger immediate sandbox quarantine.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

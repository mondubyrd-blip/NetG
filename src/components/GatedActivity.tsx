import React from "react";
import { GatedActivity } from "@/src/types";
import { ShieldAlert, ShieldCheck, ShieldX, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface GatedActivityListProps {
  activities: GatedActivity[];
  onAuthorize: (id: string, action: "authorized" | "denied") => void;
}

export default function GatedActivityList({ activities, onAuthorize }: GatedActivityListProps) {
  const halted = activities.filter(a => a.status === "halted");
  
  if (halted.length === 0) {
    return (
      <div className="p-8 text-center bg-brand-card/30 rounded-lg border border-brand-border border-dashed">
        <ShieldCheck size={48} className="mx-auto text-brand-success opacity-20 mb-4" />
        <p className="text-brand-text opacity-40 font-medium">Network Sanctity Maintained</p>
        <p className="text-xs text-brand-text opacity-30 mt-1">No suspicious deviations pending validation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {halted.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "p-4 rounded-lg bg-brand-card border-l-4 overflow-hidden",
              activity.severity === "critical" ? "border-l-brand-danger" : 
              activity.severity === "high" ? "border-l-brand-warning" : "border-l-brand-accent"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                    activity.type === "process" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"
                  )}>
                    {activity.type}
                  </span>
                  <span className="text-xs text-brand-text/50 flex items-center gap-1">
                    <Clock size={10} /> {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{activity.target}</h4>
                <p className="text-[11px] text-brand-text mt-1 leading-tight">{activity.details}</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => onAuthorize(activity.id, "authorized")}
                  className="p-2 bg-brand-success/10 hover:bg-brand-success text-brand-success hover:text-white rounded border border-brand-success/20 transition-all font-bold text-[10px] flex items-center gap-1 uppercase tracking-tighter"
                >
                  <ArrowRight size={12} /> Biometric
                </button>
                <button 
                  onClick={() => onAuthorize(activity.id, "authorized")}
                  className="p-2 bg-brand-accent/10 hover:bg-brand-accent text-brand-accent hover:text-white rounded border border-brand-accent/20 transition-all font-bold text-[10px] flex items-center gap-1 uppercase tracking-tighter"
                >
                   Verbal Sync
                </button>
                <button 
                  onClick={() => onAuthorize(activity.id, "denied")}
                  className="p-2 bg-brand-danger/10 hover:bg-brand-danger text-brand-danger hover:text-white rounded border border-brand-danger/20 transition-all font-bold text-[10px] flex items-center gap-1 uppercase tracking-tighter"
                >
                  <ShieldX size={12} /> Abort
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

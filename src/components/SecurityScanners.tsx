import React from "react";
import { ScannerState } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { Network, Search, Cpu, Loader2, ShieldCheck, ShieldAlert, Wifi, Activity } from "lucide-react";
import { motion } from "motion/react";

interface SecurityScannersProps {
  state: ScannerState;
  onScan: (type: "network" | "port" | "process") => void;
}

export default function SecurityScanners({ state, onScan }: SecurityScannersProps) {
  const scanners = [
    { id: "network", label: "Network_Mapper", icon: Wifi, status: state.network },
    { id: "port", label: "Port_Witness", icon: Search, status: state.port },
    { id: "process", label: "Logic_Auditor", icon: Cpu, status: state.process }
  ];

  return (
    <div className="bg-brand-card/40 border border-brand-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black uppercase tracking-[4px] text-white flex items-center gap-2">
          <Activity size={14} className="text-brand-accent" /> Active_System_Scanners
        </h3>
        <div className="text-[9px] font-bold text-brand-text/40 lowercase italic">
          Last comprehensive sync: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scanners.map((scanner) => (
          <button
            key={scanner.id}
            onClick={() => scanner.status !== "running" && onScan(scanner.id as any)}
            disabled={scanner.status === "running"}
            className={cn(
              "p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden",
              scanner.status === "running" ? "border-brand-accent bg-brand-accent/5" : "border-brand-border bg-brand-bg/50 hover:border-brand-accent/50 hover:bg-brand-bg/80"
            )}
          >
            {scanner.status === "running" && (
              <motion.div 
                className="absolute inset-0 bg-brand-accent/5"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              scanner.status === "running" ? "bg-brand-accent text-white" : "bg-brand-border/30 text-brand-text/40 group-hover:bg-brand-accent/20 group-hover:text-brand-accent"
            )}>
              {scanner.status === "running" ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <scanner.icon size={24} />
              )}
            </div>

            <div className="text-center">
              <div className="text-[10px] font-black uppercase text-white tracking-widest">{scanner.label}</div>
              <div className={cn(
                "text-[8px] font-bold uppercase mt-1",
                scanner.status === "running" ? "text-brand-accent" :
                scanner.status === "completed" ? "text-brand-success" : "text-brand-text/30"
              )}>
                {scanner.status === "running" ? "Scanning_Now..." : scanner.status === "completed" ? "Verification_Stable" : "Awaiting_Input"}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 py-3 border-t border-brand-border/30">
        <div className="text-center">
          <div className="text-[8px] font-black text-brand-text/40 uppercase tracking-tighter">Nodes Found</div>
          <div className="text-sm font-bold text-white font-mono">{state.last_results.network_objects}</div>
        </div>
        <div className="text-center border-x border-brand-border/30">
          <div className="text-[8px] font-black text-brand-text/40 uppercase tracking-tighter">Ports Audited</div>
          <div className="text-sm font-bold text-white font-mono">{state.last_results.open_ports}</div>
        </div>
        <div className="text-center">
          <div className="text-[8px] font-black text-brand-text/40 uppercase tracking-tighter">Logic Threats</div>
          <div className={cn(
            "text-sm font-bold font-mono",
            state.last_results.threats_detected > 0 ? "text-brand-danger" : "text-brand-success"
          )}>
            {state.last_results.threats_detected}
          </div>
        </div>
      </div>
    </div>
  );
}

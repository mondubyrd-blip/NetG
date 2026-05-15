import React from "react";
import { Device } from "@/src/types";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Shield, Info, Activity, Camera, Cpu, HardDrive } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface DeviceDetailModalProps {
  device: Device | null;
  onClose: () => void;
}

export default function DeviceDetailModal({ device, onClose }: DeviceDetailModalProps) {
  if (!device) return null;

  return (
    <AnimatePresence>
      {device && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-bg/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-brand-card border border-brand-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-brand-accent/20 px-6 py-4 border-b border-brand-border flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-accent rounded shadow-[0_0_10px_rgba(51,93,148,0.3)]">
                    <Shield size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Entity Metadata Report</h3>
                    <p className="text-[9px] text-brand-text/50 font-bold uppercase tracking-widest leading-none mt-1">Classification: {device.type}</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
               </button>
            </div>

            <div className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-brand-bg/50 rounded-xl border border-brand-border h-full">
                       <span className="text-[10px] font-black uppercase text-brand-text/40 block mb-2 tracking-widest">Ident Parameters</span>
                       <h4 className="text-2xl font-black text-white mb-4">{device.label || "UNKNOWN_ENTITY"}</h4>
                       
                       <div className="space-y-2 font-mono text-[11px]">
                          <div className="flex justify-between border-b border-brand-border/10 pb-1">
                            <span className="text-brand-text/40">MAC_ADDR</span>
                            <span className="text-white uppercase">{device.mac}</span>
                          </div>
                          <div className="flex justify-between border-b border-brand-border/10 pb-1">
                            <span className="text-brand-text/40">IP_ADDR</span>
                            <span className="text-brand-success">{device.current_ip || "DHCP_PENDING"}</span>
                          </div>
                          <div className="flex justify-between border-b border-brand-border/10 pb-1">
                            <span className="text-brand-text/40">OUI_VENDOR</span>
                            <span className="text-brand-text">{device.vendor}</span>
                          </div>
                          <div className="flex justify-between border-b border-brand-border/10 pb-1">
                            <span className="text-brand-text/40">HOST_ALIAS</span>
                            <span className="text-brand-text">{device.host}</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-brand-bg/50 rounded-xl border border-brand-border flex items-center justify-between">
                       <div>
                          <span className="text-[10px] font-black uppercase text-brand-text/40 block mb-1 tracking-widest">Temporal Log</span>
                          <div className="flex items-center gap-2 text-white font-mono text-xs">
                             <Calendar size={14} className="text-brand-accent" />
                             {device.last_seen ? new Date(device.last_seen).toLocaleString() : "N/A"}
                          </div>
                       </div>
                    </div>

                    <div className="p-4 bg-brand-bg/50 rounded-xl border border-brand-border">
                       <span className="text-[10px] font-black uppercase text-brand-text/40 block mb-2 tracking-widest">Entity Status</span>
                       <div className="flex items-center gap-3">
                          <div className={cn(
                            "px-3 py-1 rounded font-black text-xs uppercase italic",
                            device.status === "online" ? "bg-brand-success/20 text-brand-success" : "bg-brand-danger/20 text-brand-danger"
                          )}>
                            {device.status}
                          </div>
                          {device.ip_locked && (
                            <div className="flex items-center gap-1 text-[10px] font-black text-brand-success uppercase">
                               <ShieldCheck size={12} /> IP VAULT LOCKED
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="p-4 bg-brand-accent/5 rounded-xl border border-brand-border">
                     <div className="flex items-center gap-2 mb-2">
                        <Info size={16} className="text-brand-accent" />
                        <span className="text-[10px] font-black uppercase text-brand-accent tracking-widest">Observation Evidence</span>
                     </div>
                     <p className="text-sm text-brand-text leading-relaxed italic">
                        "{device.evidence || "No biometric or packet evidence collected for this entity yet."}"
                     </p>
                  </div>

                  <div className="p-4 bg-brand-bg/40 rounded-xl border border-brand-border">
                     <div className="flex items-center gap-2 mb-2">
                        <Activity size={16} className="text-brand-text/40" />
                        <span className="text-[10px] font-black uppercase text-brand-text/40 tracking-widest">Sovereign Notes</span>
                     </div>
                     <p className="text-sm text-white leading-relaxed">
                        {device.notes || "Entity is performing within expected parameters. No manual overrides present."}
                     </p>
                  </div>
               </div>

               {device.feed_url && (
                 <div className="relative rounded-xl overflow-hidden border border-brand-border aspect-video group">
                    <img src={device.feed_url} alt="Feed Evidence" className="w-full h-full object-cover filter contrast-125 saturate-50 grayscale hover:grayscale-0 transition-all duration-500" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
                       <Camera size={14} className="text-brand-danger animate-pulse" /> LIVE TRUTH FEED ACTIVE
                    </div>
                 </div>
               )}
            </div>

            <div className="bg-brand-bg p-4 border-t border-brand-border flex items-center justify-end gap-3">
               <button onClick={onClose} className="px-6 py-2 bg-brand-border/20 text-brand-text hover:text-white rounded font-black uppercase text-[10px] tracking-widest transition-all">
                  Close Report
               </button>
               <button 
                 onClick={() => alert(`TRACE_EXPORT: Sequential packet telemetry for ${device.label} has been bundled and anchored to the sovereign storage vertex.`)}
                 className="px-6 py-2 bg-brand-accent hover:bg-brand-accent/80 text-white rounded font-black uppercase text-[10px] tracking-widest transition-all shadow-[0_0_15px_rgba(51,93,148,0.3)] cursor-pointer"
               >
                  Export Trace
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Helper icons
function ShieldCheck({ size }: { size: number }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

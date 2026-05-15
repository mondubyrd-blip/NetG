import React from "react";
import { PortActivity } from "@/src/types";
import { Network, Globe, Lock, ShieldCheck, UserCheck, AlertOctagon, Info, ArrowDownLeft, ArrowUpRight, Fingerprint, Mic } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

interface PortWitnessProps {
  ports: PortActivity[];
}

export default function PortWitness({ ports }: PortWitnessProps) {
  return (
    <div className="bg-brand-card border border-brand-border rounded-xl flex flex-col overflow-hidden h-full">
      <div className="bg-brand-accent/20 px-6 py-4 border-b border-brand-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
            <Network size={20} className="text-brand-success" /> Sovereign Port Witness
          </h3>
          <p className="text-[10px] text-brand-text/50 uppercase tracking-widest mt-0.5">Anchored Identification & Recognition</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-[10px] font-bold text-brand-text/40 uppercase">
             <div className="w-2 h-2 rounded-full bg-brand-success" /> Known Local
           </div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-brand-text/40 uppercase">
             <div className="w-2 h-2 rounded-full bg-brand-danger animate-pulse" /> Shadow Entity
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {ports.map((p, i) => (
          <motion.div
            key={`${p.port}-${p.process_id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "group relative p-4 rounded-lg bg-brand-bg/50 border transition-all hover:bg-brand-accent/5",
              p.locality_type === "inserted" ? "border-brand-danger/30 shadow-[0_0_15px_rgba(239,68,68,0.05)]" : "border-brand-border"
            )}
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Port & Direction */}
              <div className="w-full md:w-32 flex flex-col justify-center border-r border-brand-border/30 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn(
                    "p-1 rounded bg-brand-bg",
                    p.direction === "ingress" ? "text-brand-success" : "text-brand-danger shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                  )}>
                    {p.direction === "ingress" ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-50">{p.direction}</span>
                </div>
                <div className="text-2xl font-black font-mono text-white tracking-tighter">
                   {p.port}
                </div>
                <div className={cn(
                  "mt-1 text-[8px] font-black uppercase px-2 py-0.5 rounded inline-block w-fit tracking-widest",
                  p.status === "listening" ? "bg-brand-success/10 text-brand-success" : 
                  p.status === "established" ? "bg-brand-accent/10 text-brand-accent" : "bg-brand-danger/10 text-brand-danger"
                )}>
                  {p.status}
                </div>
              </div>

              {/* Process & Attribution */}
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-brand-text/40 uppercase block mb-0.5">Process Recognition</label>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                       {p.process_name} <span className="opacity-40 text-[10px]">({p.process_id})</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-brand-text/40 uppercase block mb-0.5">Source / Origin</label>
                    <div className="text-xs font-bold text-brand-text flex items-center gap-2">
                       {p.is_local ? <Lock size={12} className="text-brand-success" /> : <Globe size={12} className="text-brand-danger shadow-[0_0_5px_rgba(239,68,68,0.2)]" />}
                       {p.origin}
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-brand-text/40 uppercase block mb-0.5">Logic Starter</label>
                    <div className="text-xs font-bold text-brand-text uppercase">{p.starter}</div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-brand-text/40 uppercase block mb-0.5">Recognition Lock</label>
                    <div className={cn(
                      "text-[10px] font-black flex items-center gap-2",
                      p.permission_granted ? "text-brand-success" : "text-brand-danger"
                    )}>
                      {p.permission_granted ? <UserCheck size={12} /> : <AlertOctagon size={12} />}
                      {p.permission_granted ? "VERIFIED" : "HALTED"}
                      
                      {!p.permission_granted && p.validation_method && (
                        <div className="flex gap-1">
                          {p.validation_method === "biometric" && <Fingerprint size={10} className="animate-pulse" />}
                          {p.validation_method === "verbal" && <Mic size={10} className="animate-pulse" />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={cn(
                  "p-3 rounded border transition-all",
                  p.direction === "egress" && !p.permission_granted ? "bg-brand-danger/5 border-brand-danger/20" : "bg-brand-accent/5 border-brand-border/20",
                  p.status === "frozen" ? "border-brand-danger bg-brand-danger/10" : ""
                )}>
                  <div className="flex items-start gap-4">
                    <Info size={14} className="text-brand-text/40 mt-0.5 shrink-0" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] font-black text-brand-text/60 uppercase block">Guardian Reason</span>
                        <p className="text-xs text-brand-text/80 italic">"{p.reason}"</p>
                      </div>
                      {p.intent && (
                        <div>
                          <span className="text-[9px] font-black text-brand-text/60 uppercase block">Stated Intent</span>
                          <p className="text-xs text-white font-bold">{p.intent}</p>
                        </div>
                      )}
                    </div>
                    {p.attempts_count !== undefined && (
                      <div className="text-right border-l border-brand-border/20 pl-4">
                        <span className="text-[9px] font-black text-brand-text/60 uppercase block">Attempts</span>
                        <p className={cn(
                          "text-sm font-black font-mono",
                          p.attempts_count > 10 ? "text-brand-danger animate-pulse" : "text-white"
                        )}>{p.attempts_count.toString().padStart(2, '0')}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-brand-border/20">
                   <button 
                     onClick={() => alert(`PORT_INTERVENTION: Port ${p.port} has been manually rotated. Ingress path re-allocated.`)}
                     className="px-3 py-1 bg-brand-accent/10 hover:bg-brand-accent text-brand-accent hover:text-white border border-brand-accent/30 rounded text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                   >
                      Force Rotation
                   </button>
                   <button 
                     onClick={() => alert(`PORT_QUARANTINE: Sovereign firewall has blacklisted all traffic matching signature of Port ${p.port}.`)}
                     className="px-3 py-1 bg-brand-danger/10 hover:bg-brand-danger text-brand-danger hover:text-white border border-brand-danger/30 rounded text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                   >
                      Quarantine Port
                   </button>
                </div>
              </div>

              {/* Locality Decal */}
              <div className="absolute top-2 right-2">
                 <div className={cn(
                   "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[1px]",
                   p.locality_type === "born_local" ? "bg-brand-success/10 text-brand-success" : "bg-brand-danger/10 text-brand-danger"
                 )}>
                   {p.locality_type === "inserted" ? "SHADOW ENTITY" : p.locality_type.replace('_', ' ')}
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
        {ports.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-center opacity-30">
            <Lock size={48} className="mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">Quiet Net</p>
            <p className="text-xs mt-2">No active egress protocols observed.</p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-brand-accent/5 border-t border-brand-border">
         <p className="text-[9px] text-brand-text/40 uppercase leading-relaxed text-center leading-tight">
           All inserted processes must name themselves. Any that does not ask for permission will be instantly stoped.
           <br/>Guardian Wisdom persists.
         </p>
      </div>
    </div>
  );
}

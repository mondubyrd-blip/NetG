import React from "react";
import { FrozenAgent, CommandOrigin } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";
import { 
  Snowflake, 
  Terminal, 
  Link, 
  ShieldCheck, 
  ShieldAlert, 
  FileCode, 
  Clock,
  MapPin,
  Cpu,
  Lock
} from "lucide-react";

interface AuthorityInterceptionProps {
  agents: FrozenAgent[];
  origins: CommandOrigin[];
}

export default function AuthorityInterception({ agents, origins }: AuthorityInterceptionProps) {
  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Command Source Mapping */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Link className="text-brand-accent" size={18} />
          <h2 className="text-sm font-black uppercase tracking-[3px] text-white">Command_Origin_Mapping</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {origins.map((origin, idx) => (
            <div key={idx} className="bg-brand-card/50 border border-brand-border p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
               <div className={cn(
                 "absolute top-0 right-0 px-2 py-0.5 text-[7px] font-black uppercase tracking-widest",
                 origin.authority_level === "MAX" ? "bg-brand-success text-black" : 
                 origin.authority_level === "BLOCKED" ? "bg-brand-danger text-white" : "bg-brand-accent text-white"
               )}>
                  {origin.authority_level}
               </div>
               <div className="flex items-center gap-2 mb-1">
                  <MapPin size={12} className="text-brand-text/40" />
                  <span className="text-[10px] font-black text-white uppercase">{origin.source}</span>
               </div>
               <div className="p-2 bg-black/40 rounded border border-brand-border/40">
                  <p className="text-[9px] font-mono text-brand-text/80 leading-relaxed italic break-all">{origin.path}</p>
               </div>
               <div className="flex items-center gap-1.5 mt-1">
                  {origin.verified ? (
                    <ShieldCheck size={10} className="text-brand-success" />
                  ) : (
                    <ShieldAlert size={10} className="text-brand-danger" />
                  )}
                  <span className={cn(
                    "text-[8px] font-bold uppercase",
                    origin.verified ? "text-brand-success" : "text-brand-danger"
                  )}>
                    {origin.verified ? "Identity_Verified" : "SPOOF_RISK_DETECTED"}
                  </span>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frozen Agents List */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Snowflake className="text-brand-accent" size={18} />
          <h2 className="text-sm font-black uppercase tracking-[3px] text-white">AI_Agent_Intercept_Registry</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {agents.map((agent) => (
            <motion.div 
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden hover:border-brand-accent/50 transition-colors"
            >
              <div className="p-4 bg-brand-accent/5 border-b border-brand-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-brand-danger/10 rounded-lg border border-brand-danger/30">
                    <Cpu size={16} className="text-brand-danger animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black text-white uppercase tracking-widest">{agent.name}</h3>
                    <p className="text-[9px] text-brand-text/50 font-mono">{agent.origin_ip}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex flex-col items-end">
                      <span className="text-[8px] font-black text-brand-danger uppercase tracking-widest">{agent.violation}</span>
                      <span className="text-[8px] text-brand-text/30 uppercase mt-0.5 flex items-center gap-1">
                        <Clock size={8} /> {new Date(agent.intercept_time).toLocaleTimeString()}
                      </span>
                   </div>
                   <div className="h-8 w-[1px] bg-brand-border mx-2" />
                   <div className="px-3 py-1.5 bg-brand-danger/10 border border-brand-danger/30 text-brand-danger rounded uppercase text-[9px] font-black flex items-center gap-2">
                      <Lock size={10} /> FROZEN_STATE
                   </div>
                </div>
              </div>

              <div className="p-5 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal size={12} className="text-brand-accent" />
                    <span className="text-[9px] font-black text-brand-text/40 uppercase tracking-widest">Intercepted_Command_Queue</span>
                  </div>
                  <div className="bg-black/60 border border-brand-border rounded-xl p-4 font-mono text-[10px] space-y-1.5 shadow-inner">
                    {agent.last_command_queue.map((cmd, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-brand-accent/40 select-none">[{i+1}]</span>
                        <span className="text-brand-danger/90">{cmd}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:w-64 space-y-4">
                  <div className="p-3 bg-brand-bg/50 border border-brand-border rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldAlert size={12} className="text-brand-danger" />
                      <span className="text-[8px] font-black text-brand-text/40 uppercase tracking-widest">MITIGATION_STATUS</span>
                    </div>
                    <p className="text-[9px] text-white/80 italic leading-relaxed">
                      Process halted via G_PROTOCOL. Authority inheritance stripped. Ingress routes flushed.
                    </p>
                  </div>
                  <button className="w-full py-3 bg-brand-accent/5 hover:bg-brand-accent border border-brand-accent/20 hover:text-white text-brand-accent rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer">
                    Request Full Telemetry
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

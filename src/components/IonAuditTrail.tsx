import React from "react";
import { AIAgentAuditEntry } from "@/src/types";
import { History, Search, Filter, Tag, AlertCircle, Info, MessageSquare, Wrench, Download } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

interface IonAuditTrailProps {
  entries: AIAgentAuditEntry[];
}

export default function IonAuditTrail({ entries }: IonAuditTrailProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredEntries = entries.filter(entry => 
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportAudit = () => {
    const dataStr = JSON.stringify(filteredEntries, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `ion_audit_trail_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "request": return <MessageSquare size={14} />;
      case "response": return <Info size={14} />;
      case "tool_call": return <Wrench size={14} />;
      case "security_alert": return <AlertCircle size={14} className="text-brand-danger" />;
      default: return <History size={14} />;
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "dlp": return "bg-brand-warning/20 text-brand-warning border-brand-warning/30";
      case "injection": return "bg-brand-danger/20 text-brand-danger border-brand-danger/30";
      case "exfiltration": return "bg-brand-danger/20 text-brand-danger border-brand-danger/30";
      case "pii": return "bg-brand-accent/20 text-brand-accent border-brand-accent/30";
      case "command": return "bg-brand-success/20 text-brand-success border-brand-success/30";
      case "ai": return "bg-brand-accent/20 text-brand-accent border-brand-accent/30";
      case "purge": return "bg-brand-warning/20 text-brand-warning border-brand-warning/30";
      default: return "bg-brand-bg border-brand-border text-brand-text";
    }
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden flex flex-col h-full">
      <div className="bg-brand-bg/80 px-6 py-4 border-b border-brand-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-bg border border-brand-border rounded shadow-inner">
            <History size={20} className="text-brand-text/60" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[4px] text-white">Ion Audit Trail</h3>
            <p className="text-[9px] text-brand-text/50 uppercase tracking-widest mt-0.5">Comprehensive Agent Telemetry</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={exportAudit}
             className="flex items-center gap-2 px-3 py-1.5 bg-brand-accent/10 hover:bg-brand-accent text-brand-accent hover:text-white border border-brand-accent/30 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
           >
              <Download size={12} />
              Export Audit
           </button>
           <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-text/40" />
              <input 
                type="text" 
                placeholder="SEARCH_AUDIT..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-brand-bg/50 border border-brand-border rounded-full pl-9 pr-4 py-1.5 text-[10px] lowercase font-mono w-48 focus:outline-none focus:border-brand-accent/50 transition-all cursor-text"
              />
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-brand-accent/10 border-b border-brand-border sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="px-6 py-3 text-[10px] font-black uppercase text-brand-text/40 tracking-widest">Temporal Index</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase text-brand-text/40 tracking-widest">Event Type</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase text-brand-text/40 tracking-widest">Metadata Content</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase text-brand-text/40 tracking-widest text-right">Risk Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/30">
            {filteredEntries.map((entry, i) => (
              <motion.tr 
                key={entry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-white/5 transition-all group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex flex-col">
                      <span className="text-[11px] font-mono font-bold text-white mb-0.5">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                      <span className="text-[8px] font-mono text-brand-text/30 uppercase tracking-tighter">[{entry.id.toUpperCase()}]</span>
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-center gap-2">
                      <div className="text-brand-accent/60 group-hover:text-brand-accent transition-colors">
                        {getEventIcon(entry.event_type)}
                      </div>
                      <span className="text-[10px] font-black uppercase text-white/70 italic tracking-tighter">{entry.event_type.replace("_", " ")}</span>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <div className="space-y-2">
                      <p className="text-xs text-brand-text line-clamp-2 leading-relaxed">
                        {entry.content}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                         {entry.tags.map(tag => (
                           <span key={tag} className={cn(
                             "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[1px] border",
                             getTagColor(tag)
                           )}>
                             {tag}
                           </span>
                         ))}
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                   <div className="flex flex-col items-end">
                      <span className={cn(
                        "text-xs font-black font-mono",
                        entry.risk_increment > 10 ? "text-brand-danger" : "text-brand-warning"
                      )}>
                        +{entry.risk_increment}.0
                      </span>
                      <span className="text-[8px] font-black uppercase text-brand-text/30 tracking-widest mt-0.5">Session Impact</span>
                   </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-brand-bg px-6 py-2 border-t border-brand-border flex items-center justify-between text-[9px] font-mono text-brand-text/40">
         <div className="flex items-center gap-4">
            <span>TRAIL_STATE: WRITING</span>
            <span>TOTAL: {entries.length}</span>
            <span>MATCHES: {filteredEntries.length}</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-brand-success uppercase">Verity_Sync: Established</span>
         </div>
      </div>
    </div>
  );
}

import React from "react";
import { StasisFile } from "@/src/types";
import { FileLock2, AlertCircle, Scale, ShieldAlert, FileText } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface DataStasisPanelProps {
  files: StasisFile[];
}

export default function DataStasisPanel({ files }: DataStasisPanelProps) {
  return (
    <div className="bg-brand-danger/5 border border-brand-danger/30 rounded-xl overflow-hidden">
      <div className="bg-brand-danger/20 px-6 py-3 border-b border-brand-danger/30 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[3px] flex items-center gap-2 text-brand-danger">
            <FileLock2 size={18} /> Data Stasis Active
          </h3>
          <p className="text-[9px] text-brand-danger/60 uppercase font-bold mt-0.5">Attempted Authority Breach Detected - File Access Gated</p>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-brand-danger text-white text-[9px] font-black rounded animate-pulse">
           <ShieldAlert size={12} /> PROBABLE CAUSE REQUIRED
        </div>
      </div>

      <div className="p-4 space-y-3">
        {files.map(file => (
          <div key={file.id} className="flex items-center justify-between p-3 bg-brand-bg/40 border border-brand-danger/10 rounded-lg group hover:border-brand-danger/40 transition-all">
            <div className="flex items-center gap-3">
               <div className="p-2 rounded bg-brand-danger/10 text-brand-danger">
                  <FileText size={16} />
               </div>
               <div>
                  <div className="text-[11px] font-mono font-bold text-white tracking-tighter">
                    {file.path}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "text-[8px] font-black uppercase px-1.5 py-0.5 rounded border",
                      file.status === "locked" ? "bg-brand-danger/20 text-brand-danger border-brand-danger/30" : "bg-brand-warning/20 text-brand-warning border-brand-warning/30"
                    )}>
                      {file.status === "locked" ? "HEAVILY SEALED" : "SOVEREIGN GATE"}
                    </span>
                    {file.explanation_required && (
                      <span className="text-[8px] font-black uppercase text-brand-text/40 flex items-center gap-1">
                        <Scale size={10} /> Explan. Req.
                      </span>
                    )}
                  </div>
               </div>
            </div>

            <button 
              onClick={() => alert(`PROBABLE_CAUSE_COLLECTION: Please state your biometric intent for accessing ${file.path}. Evidence will be anchored to your sovereign signature.`)}
              className="px-3 py-1.5 bg-brand-danger/10 hover:bg-brand-danger text-brand-danger hover:text-white border border-brand-danger/20 rounded text-[9px] font-black uppercase tracking-tighter transition-all cursor-pointer"
            >
               Provide Legal Cause
            </button>
          </div>
        ))}

        <div className="pt-2 border-t border-brand-danger/10 mt-2">
           <div className="flex items-start gap-2 text-[9px] text-brand-danger/60 uppercase font-medium leading-tight">
             <AlertCircle size={12} className="shrink-0 mt-0.5" />
             <p>No file shall be edited, exported, copied, or migrated without valid explanation. All data is put into stasis until users trusted individual seek access.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

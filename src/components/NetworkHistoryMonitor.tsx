import React from "react";
import { ConnectivityState } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { format } from "date-fns";
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";

interface NetworkHistoryMonitorProps {
  history: ConnectivityState[];
}

export default function NetworkHistoryMonitor({ history }: NetworkHistoryMonitorProps) {
  const reversedHistory = [...history].reverse();

  const getStatusIcon = (status: "ok" | "down" | "unknown") => {
    switch (status) {
      case "ok": return <CheckCircle2 size={12} className="text-brand-success" />;
      case "down": return <XCircle size={12} className="text-brand-danger" />;
      default: return <AlertCircle size={12} className="text-brand-warning" />;
    }
  };

  return (
    <div className="bg-brand-card/30 border border-brand-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-brand-border bg-brand-bg/40 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-[3px] text-white flex items-center gap-2">
          <Clock size={16} className="text-brand-accent" /> Connectivity_Log_Stream
        </h3>
        <span className="text-[10px] font-bold text-brand-text/40 lowercase italic">Buffer size: {history.length} frames</span>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-brand-border">
        {reversedHistory.length > 0 ? (
          <table className="w-full text-left text-[11px] border-collapse">
            <thead className="bg-brand-bg text-brand-text/60 uppercase text-[9px] font-black tracking-widest sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 border-b border-brand-border">Timestamp</th>
                <th className="px-4 py-2 border-b border-brand-border">SSID</th>
                <th className="px-4 py-2 border-b border-brand-border text-center">WiFi</th>
                <th className="px-4 py-2 border-b border-brand-border text-center">GW</th>
                <th className="px-4 py-2 border-b border-brand-border text-center">INET</th>
                <th className="px-4 py-2 border-b border-brand-border">Protocol_State</th>
              </tr>
            </thead>
            <tbody className="font-mono divide-y divide-brand-border/30">
              {reversedHistory.map((point, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                  <td className="px-4 py-2 text-brand-text/80">
                    {format(new Date(point.lastScan), "HH:mm:ss")}
                  </td>
                  <td className="px-4 py-2 text-white font-bold tracking-tighter">
                    {point.ssid}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center">{getStatusIcon(point.wifi)}</div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center">{getStatusIcon(point.gateway)}</div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center">{getStatusIcon(point.internet)}</div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[9px] font-black uppercase",
                      point.guardian_status === "lockdown" ? "bg-brand-danger text-white" :
                      point.guardian_status === "alert" ? "bg-brand-warning/20 text-brand-warning" :
                      "bg-brand-success/10 text-brand-success"
                    )}>
                      {point.guardian_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-20 text-center opacity-30">
             <Clock size={32} className="mx-auto mb-2" />
             <p className="text-xs font-black uppercase italic">No Historical Data Recorded</p>
          </div>
        )}
      </div>
    </div>
  );
}

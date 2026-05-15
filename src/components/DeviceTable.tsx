import React from "react";
import { Device } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { Camera, Monitor, Smartphone, Router, Shield, Zap, Power, Activity, Eye, ShieldCheck, Video, Circle, ShieldAlert, Unlock, Clock } from "lucide-react";
import { motion } from "motion/react";
import { formatDistanceToNow } from "date-fns";

interface DeviceTableProps {
  devices: Device[];
  filter: string;
  onSelect: (device: Device) => void;
  onQuarantineToggle: (mac: string) => void;
  selectedMac?: string;
}

export default function DeviceTable({ devices, filter, onSelect, onQuarantineToggle, selectedMac }: DeviceTableProps) {
  const [typeFilter, setTypeFilter] = React.useState<string>("all");

  const deviceTypes = ["all", "router", "camera", "phone", "desktop", "unknown"];

  const filteredDevices = devices.filter(d => {
    const searchStr = `${d.label} ${d.current_ip} ${d.mac} ${d.vendor} ${d.type}`.toLowerCase();
    const matchesSearch = searchStr.includes(filter.toLowerCase());
    const matchesType = typeFilter === "all" || d.type === typeFilter;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (a.status === b.status) {
      if (a.type === b.type) return a.label.localeCompare(b.label);
      return a.type === "camera" ? -1 : 1;
    }
    return a.status === "online" ? -1 : 1;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "router": return <Router size={16} />;
      case "camera": return <Camera size={16} />;
      case "voice_assistant": return <Activity size={16} />;
      case "wifi_point": return <Zap size={16} />;
      case "streaming_box": return <Monitor size={16} />;
      case "phone": return <Smartphone size={16} />;
      case "desktop": return <Monitor size={16} />;
      default: return <Shield size={16} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Type Filter */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-brand-bg/40 border border-brand-border/50 rounded-lg">
        <span className="text-[9px] font-black uppercase text-brand-text/40 tracking-widest mr-2">Filter Type:</span>
        {deviceTypes.map(type => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={cn(
              "px-3 py-1 rounded text-[10px] font-bold uppercase transition-all border",
              typeFilter === type 
                ? "bg-brand-accent border-brand-accent text-white shadow-[0_0_10px_rgba(51,93,148,0.3)]" 
                : "bg-brand-bg/50 border-brand-border/30 text-brand-text/50 hover:text-white"
            )}
          >
            {type.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border border-brand-border rounded-lg bg-brand-card">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-brand-accent text-white uppercase text-[11px] font-bold tracking-widest sticky top-0">
          <tr>
            <th className="px-4 py-3 border-b border-brand-border">Device</th>
            <th className="px-4 py-3 border-b border-brand-border">IP Address</th>
            <th className="px-4 py-3 border-b border-brand-border hidden lg:table-cell">MAC Address</th>
            <th className="px-4 py-3 border-b border-brand-border hidden xl:table-cell">Vendor</th>
            <th className="px-4 py-3 border-b border-brand-border">Type</th>
            <th className="px-4 py-3 border-b border-brand-border">Ping</th>
            <th className="px-4 py-3 border-b border-brand-border">Connection</th>
            <th className="px-4 py-3 border-b border-brand-border">Last Seen</th>
            <th className="px-4 py-3 border-b border-brand-border">Status</th>
          </tr>
        </thead>
        <tbody className="font-mono">
          {filteredDevices.map((device, idx) => (
            <motion.tr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.02 }}
              key={device.mac}
              onClick={() => onSelect(device)}
              className={cn(
                "data-row",
                selectedMac === device.mac && "bg-brand-accent/30"
              )}
            >
              <td className="px-4 py-3 font-sans font-medium text-white flex items-center gap-2">
                <span className={cn(
                  "p-1.5 rounded bg-brand-bg border",
                  device.status === "quarantined" ? "text-brand-danger border-brand-danger" : "text-brand-text/60 border-brand-border/30"
                )}>
                  {device.type === "shadow" ? <Eye size={16} className="animate-pulse" /> : getIcon(device.type)}
                </span>
                <div className="flex flex-col">
                  <span className="flex items-center gap-2">
                    {device.label || device.mac}
                    {device.status === "frozen" && <span className="text-[8px] font-black uppercase text-brand-accent tracking-widest bg-brand-accent/10 px-1 rounded">Frozen</span>}
                    {(device.type === "phone" || device.type === "desktop") && <ShieldCheck size={10} className="text-brand-success" />}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-brand-text flex flex-col">
                 <span>{device.current_ip || (device.status === 'offline' ? 'OFFLINE' : 'PENDING')}</span>
              </td>
              <td className="px-4 py-3 text-brand-text hidden lg:table-cell uppercase">{device.mac}</td>
              <td className="px-4 py-3 text-brand-text hidden xl:table-cell">{device.vendor}</td>
              <td className="px-4 py-3 text-brand-text uppercase text-[10px]">{device.type}</td>
              <td className="px-4 py-3 text-brand-text">
                <span className={cn(
                  "text-[10px] font-mono",
                  device.status === "online" && device.latency ? (device.latency < 20 ? "text-brand-success" : "text-brand-warning") : "text-brand-text/30"
                )}>
                  {device.status === "online" && device.latency ? `${device.latency}ms` : "N/A"}
                </span>
              </td>
              <td className="px-4 py-3 text-brand-text">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                  device.connection_method === "bridge" ? "bg-brand-success/10 text-brand-success border-brand-success/20" :
                  device.connection_method === "tether" ? "bg-brand-accent/10 text-brand-accent border-brand-accent/20" :
                  "bg-brand-bg/50 text-brand-text/40 border-brand-border/30"
                )}>
                  {device.connection_method || "Direct"}
                </span>
              </td>
              <td className="px-4 py-3 text-brand-text">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <Clock size={10} className="text-brand-text/40" />
                  <span className="text-[10px] uppercase font-bold tracking-tight">
                    {formatDistanceToNow(new Date(device.last_seen), { addSuffix: true })}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Circle 
                      size={8} 
                      fill="currentColor" 
                      className={cn(
                        device.status === "online" ? "text-brand-success" : 
                        device.status === "quarantined" ? "text-brand-danger" :
                        device.status === "frozen" ? "text-brand-accent shadow-[0_0_8px_rgba(51,93,148,0.5)]" : "text-brand-text/20"
                      )} 
                    />
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      device.status === "online" ? "bg-brand-success/20 text-brand-success border border-brand-success/40" : 
                      device.status === "quarantined" ? "bg-brand-danger text-white border border-brand-danger shadow-[0_0_10px_rgba(239,68,68,0.3)]" :
                      device.status === "frozen" ? "bg-brand-accent/20 text-brand-accent border border-brand-accent/40" : "bg-brand-text/10 text-brand-text/40 border border-brand-border/20"
                    )}>
                      {device.status === "online" ? "Recognized" : 
                       device.status === "quarantined" ? "Quarantined" : 
                       device.status === "frozen" ? "Frozen" : "Offline"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuarantineToggle(device.mac);
                      }}
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all cursor-pointer border",
                        device.status === "quarantined" 
                          ? "bg-brand-success/10 text-brand-success border-brand-success/30 hover:bg-brand-success hover:text-white" 
                          : "bg-brand-danger/10 text-brand-danger border-brand-danger/30 hover:bg-brand-danger hover:text-white"
                      )}
                    >
                      {device.status === "quarantined" ? (
                        <>
                          <Unlock size={10} />
                          <span>Release</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert size={10} />
                          <span>Quarantine</span>
                        </>
                      )}
                    </button>

                    {device.type === "camera" && device.feed_url && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(device);
                        }}
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-brand-accent/10 border border-brand-accent/30 text-brand-accent hover:bg-brand-accent hover:text-white transition-all text-[9px] font-black uppercase tracking-widest cursor-pointer whitespace-nowrap"
                        title="View Live Feed"
                      >
                        <Video size={10} />
                        <span>Live</span>
                      </button>
                    )}
                  </div>
                </div>
              </td>
            </motion.tr>
          ))}
          {filteredDevices.length === 0 && (
            <tr>
              <td colSpan={9} className="px-4 py-10 text-center text-brand-text opacity-50 font-sans italic">
                No devices found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
  );
}

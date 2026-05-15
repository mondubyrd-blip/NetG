import React from "react";
import { Device } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { 
  Network, 
  Search, 
  Info, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Map as MapIcon,
  Crosshair,
  Activity,
  Maximize2
} from "lucide-react";

interface IPMappingProps {
  devices: Device[];
  onQuarantineToggle?: (mac: string) => Promise<void>;
  subnet?: string;
}

export default function IPMapping({ devices, onQuarantineToggle, subnet }: IPMappingProps) {
  const [hoveredIp, setHoveredIp] = React.useState<string | null>(null);
  const [selectedIp, setSelectedIp] = React.useState<string | null>(null);
  const [isToggling, setIsToggling] = React.useState(false);

  // Derive subnet from devices or use a default if not provided
  const activeSubnet = React.useMemo(() => {
    if (subnet) return subnet;
    if (devices.length > 0 && devices[0].current_ip) {
      const parts = devices[0].current_ip.split('.');
      return parts.slice(0, 3).join('.');
    }
    return "127.0.0";
  }, [subnet, devices]);

  // Generate 256 IPs (0-255)
  const ipGrid = Array.from({ length: 256 }, (_, i) => `${activeSubnet}.${i}`);

  const deviceMap = React.useMemo(() => {
    const map: Record<string, Device> = {};
    devices.forEach(device => {
      map[device.current_ip] = device;
    });
    return map;
  }, [devices]);

  const handleToggle = async (mac: string) => {
    if (!onQuarantineToggle) return;
    setIsToggling(true);
    try {
      await onQuarantineToggle(mac);
    } finally {
      setIsToggling(false);
    }
  };

  const getStatusColor = (device: Device) => {
    if (device.status === "quarantined") return "bg-brand-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]";
    if (device.status === "frozen") return "bg-brand-warning";
    if (device.status === "online") return "bg-brand-success shadow-[0_0_10px_rgba(34,197,94,0.5)]";
    return "bg-brand-text/20";
  };

  const selectedDevice = selectedIp ? deviceMap[selectedIp] : null;

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-brand-card/30 border border-brand-border p-4 rounded-xl">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-bg rounded-lg border border-brand-border shadow-inner">
               <Network size={24} className="text-brand-accent animate-pulse" />
            </div>
            <div>
               <h2 className="text-lg font-black uppercase tracking-[5px] text-white italic">IP Mapping Matrix</h2>
               <p className="text-[10px] text-brand-text/40 uppercase tracking-[3px]">Subnet: {activeSubnet}.0/24 • {devices.length} Nodes Anchored</p>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-widest text-brand-text/40">
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-success" /> Online</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-danger" /> Quarantined</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-warning" /> Frozen</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-text/10" /> Empty</div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1">
         {/* The Grid */}
         <div className="xl:col-span-8 flex flex-col gap-4">
            <div className="bg-brand-card/40 border border-brand-border p-6 rounded-2xl shadow-inner relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(51,93,148,0.05),transparent)] pointer-events-none" />
               
               <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 sm:gap-1.5 relative">
                  {ipGrid.map((ip, i) => {
                    const device = deviceMap[ip];
                    return (
                      <motion.div
                        key={ip}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.001 }}
                        onMouseEnter={() => setHoveredIp(ip)}
                        onMouseLeave={() => setHoveredIp(null)}
                        onClick={() => setSelectedIp(ip)}
                        className={cn(
                          "aspect-square rounded-[2px] transition-all cursor-pointer relative group",
                          device ? getStatusColor(device) : "bg-brand-text/5 hover:bg-brand-text/20",
                          selectedIp === ip ? "ring-2 ring-white scale-110 z-10" : "",
                          hoveredIp === ip ? "scale-125 z-20" : ""
                        )}
                      >
                         {/* Tooltip on hover */}
                         {hoveredIp === ip && (
                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[8px] font-black uppercase tracking-widest whitespace-nowrap rounded pointer-events-none shadow-xl border border-white/10 z-50">
                              {ip} {device ? `• ${device.label}` : "• AVAILABLE"}
                           </div>
                         )}
                         {device && device.status === "quarantined" && (
                           <div className="absolute inset-0 flex items-center justify-center">
                              <ShieldAlert size={8} className="text-white/80" />
                           </div>
                         )}
                      </motion.div>
                    );
                  })}
               </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
               <div className="bg-brand-card border border-brand-border p-4 rounded-xl">
                  <div className="text-[8px] font-black uppercase text-brand-text/40 tracking-[2px] mb-1">Node Density</div>
                  <div className="text-xl font-black text-brand-success italic">{devices.length} <span className="text-[10px] text-brand-text/40">Verified</span></div>
               </div>
               <div className="bg-brand-card border border-brand-border p-4 rounded-xl">
                  <div className="text-[8px] font-black uppercase text-brand-text/40 tracking-[2px] mb-1">Subnet Mapping</div>
                  <div className="text-xl font-black text-brand-accent italic uppercase">{activeSubnet}.x</div>
               </div>
            </div>
         </div>

         {/* Selection Detail */}
         <div className="xl:col-span-4 flex flex-col gap-6">
            <AnimatePresence mode="wait">
               {selectedDevice ? (
                 <motion.div
                   key={selectedDevice.mac}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="bg-brand-card border border-brand-accent/30 rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col"
                 >
                    <div className="bg-brand-accent/10 p-6 border-b border-brand-accent/20">
                       <div className="flex items-center justify-between mb-4">
                          <div className={cn(
                            "px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest",
                            selectedDevice.status === "online" ? "bg-brand-success/20 text-brand-success" : 
                            selectedDevice.status === "quarantined" ? "bg-brand-danger/20 text-brand-danger" : "bg-brand-warning/20 text-brand-warning"
                          )}>
                             {selectedDevice.status}
                          </div>
                          <button onClick={() => setSelectedIp(null)} className="text-brand-text/40 hover:text-white"><Maximize2 size={14} /></button>
                       </div>
                       <h3 className="text-xl font-black uppercase tracking-[3px] text-white italic mb-1">{selectedDevice.label}</h3>
                       <p className="text-[10px] font-mono text-brand-accent/80">{selectedDevice.current_ip}</p>
                    </div>

                    <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-brand-bg/50 border border-brand-border rounded-lg">
                             <span className="block text-[7px] font-black text-brand-text/30 uppercase mb-1">Hardware Vendor</span>
                             <span className="text-[10px] font-black text-white uppercase">{selectedDevice.vendor}</span>
                          </div>
                          <div className="p-3 bg-brand-bg/50 border border-brand-border rounded-lg">
                             <span className="block text-[7px] font-black text-brand-text/30 uppercase mb-1">MAC Signature</span>
                             <span className="text-[10px] font-mono text-white/70">{selectedDevice.mac}</span>
                          </div>
                       </div>

                       <div>
                          <span className="block text-[7px] font-black text-brand-text/30 uppercase mb-2">Authority Evidence</span>
                          <div className="p-4 bg-black/60 border border-brand-border rounded-xl shadow-inner">
                             <div className="flex items-start gap-3">
                                <ShieldCheck size={16} className="text-brand-success shrink-0" />
                                <p className="text-[10px] text-brand-text/80 italic leading-relaxed">{selectedDevice.evidence}</p>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-brand-bg/30 border border-brand-border/40 rounded-lg">
                             <div className="flex items-center gap-3">
                                <Activity size={14} className="text-brand-accent" />
                                <span className="text-[9px] font-black uppercase text-brand-text/60">Node Logic Status</span>
                             </div>
                             <span className="text-[9px] font-black text-brand-success uppercase">VERIFIED</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-brand-bg/30 border border-brand-border/40 rounded-lg">
                             <div className="flex items-center gap-3">
                                <Zap size={14} className="text-brand-warning" />
                                <span className="text-[9px] font-black uppercase text-brand-text/60">Transit Logic</span>
                                
                             </div>
                             <span className="text-[9px] font-black text-white italic">0.12 GB/s</span>
                          </div>
                       </div>

                       {selectedDevice.status !== "quarantined" ? (
                         <button 
                           disabled={isToggling}
                           className="w-full py-4 bg-brand-danger/10 hover:bg-brand-danger text-brand-danger hover:text-white border border-brand-danger/30 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest cursor-pointer shadow-lg shadow-brand-danger/5 group disabled:opacity-50"
                           onClick={() => handleToggle(selectedDevice.mac)}
                         >
                            <ShieldAlert size={14} className={cn("inline mr-2 group-hover:animate-bounce", isToggling && "animate-spin")} /> {isToggling ? "PROCESSING..." : "Quarantine Node"}
                         </button>
                       ) : (
                         <button 
                           disabled={isToggling}
                           className="w-full py-4 bg-brand-success/10 hover:bg-brand-success text-brand-success hover:text-white border border-brand-success/30 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest cursor-pointer shadow-lg shadow-brand-success/5 group disabled:opacity-50"
                           onClick={() => handleToggle(selectedDevice.mac)}
                         >
                            <ShieldCheck size={14} className={cn("inline mr-2 group-hover:scale-125 transition-transform", isToggling && "animate-spin")} /> {isToggling ? "PROCESSING..." : "Restore Access"}
                         </button>
                       )}
                    </div>
                    
                    <div className="bg-brand-bg p-4 border-t border-brand-border flex items-center justify-center gap-2">
                       <Crosshair size={12} className="text-brand-accent animate-pulse" />
                       <span className="text-[8px] font-black uppercase text-brand-accent tracking-[4px]">Sovereign Target Locked</span>
                    </div>
                 </motion.div>
               ) : (
                 <div className="flex-1 border border-brand-border/30 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 text-center opacity-30 shadow-inner italic">
                    <MapIcon size={48} strokeWidth={1} className="mb-4 text-brand-text" />
                    <h3 className="text-[10px] font-black uppercase tracking-[5px]">Matrix_Detail_Idle</h3>
                    <p className="text-[8px] uppercase tracking-widest mt-2 max-w-[200px]">Pulse any node in the IP Matrix to inspect current telemetry and hardware signatures.</p>
                 </div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}

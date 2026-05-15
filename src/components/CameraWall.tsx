import React, { useState, useRef, useEffect } from "react";
import { Device } from "@/src/types";
import { Camera, Maximize2, LayoutGrid, ScanEye, ShieldCheck, Video, VideoOff, RefreshCw, Smartphone, UserCheck } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface CameraWallProps {
  devices: Device[];
}

export default function CameraWall({ devices }: CameraWallProps) {
  const cameras = devices.filter(d => d.type === "camera");
  const [selectedMainId, setSelectedMainId] = useState<string | null>(cameras[0]?.mac || null);
  const [isPrimaryActive, setIsPrimaryActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const togglePrimaryCamera = async () => {
    if (isPrimaryActive) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setIsPrimaryActive(false);
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        setIsPrimaryActive(true);
      } catch (err) {
        console.error("Failed to access primary camera", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const selectedMain = cameras.find(c => c.mac === selectedMainId);

  return (
    <div className="flex flex-col gap-6">
      {/* Primary Comparison Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary User Link */}
        <div className="bg-brand-card border border-brand-accent/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(51,93,148,0.15)]">
           <div className="px-6 py-4 bg-brand-accent/20 border-b border-brand-accent/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-brand-accent/20 rounded">
                    <UserCheck size={18} className="text-brand-accent" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-[3px] text-white">Sovereign Visual Anchor</h3>
                    <p className="text-[9px] text-brand-text/50 uppercase tracking-widest mt-0.5">Direct Biometric Comparison</p>
                 </div>
              </div>
              <button 
                onClick={togglePrimaryCamera}
                className={cn(
                  "px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all border",
                  isPrimaryActive ? "bg-brand-danger/20 text-brand-danger border-brand-danger/40" : "bg-brand-success/20 text-brand-success border-brand-success/40"
                )}
              >
                {isPrimaryActive ? "Disconnect Sovereign" : "Initialize Link"}
              </button>
           </div>
           
           <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={cn("w-full h-full object-cover", !isPrimaryActive && "hidden")} 
              />
              {!isPrimaryActive && (
                <div className="flex flex-col items-center gap-4 text-brand-text/20">
                   <ScanEye size={48} strokeWidth={1} />
                   <span className="text-[10px] font-black uppercase tracking-[4px]">Direct_Link_Inactive</span>
                </div>
              )}
              {isPrimaryActive && (
                <>
                  <div className="absolute inset-0 border-[20px] border-transparent border-t-white/10 border-l-white/10 opacity-20 pointer-events-none" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                     <div className="w-2 h-2 bg-brand-danger rounded-full animate-pulse" />
                     <span className="text-[10px] font-mono text-white/50 tracking-tighter uppercase">Primary Sovereign Ingest</span>
                  </div>
                  <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/30">
                     LAT: 0.02ms | RES: 1080P
                  </div>
                </>
              )}
           </div>
        </div>

        {/* Selected Network Feed */}
        <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden shadow-2xl">
           <div className="px-6 py-4 bg-brand-bg border-b border-brand-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-brand-bg border border-brand-border rounded">
                    <Camera size={18} className="text-brand-text/60" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-[3px] text-white">Network Witness</h3>
                    <p className="text-[9px] text-brand-text/50 uppercase tracking-widest mt-0.5">{selectedMain?.label || "No Camera Selected"}</p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-mono text-brand-success uppercase">Synced</span>
              </div>
           </div>
           
           <div className="aspect-video bg-black relative group">
              {selectedMain?.feed_url ? (
                <img 
                  src={selectedMain.feed_url} 
                  alt={selectedMain.label} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-brand-text/20">
                   <VideoOff size={32} />
                   <span className="text-[10px] font-black uppercase">No Feed Available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white uppercase">{selectedMain?.label}</span>
                    <span className="text-[8px] font-mono text-white/50">{selectedMain?.current_ip}</span>
                 </div>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     alert(`MAXIMIZED_VIEW: Expanding ${selectedMain?.label} to primary display vertex.`);
                   }}
                   className="p-2 bg-black/60 rounded border border-white/20 text-white hover:bg-brand-accent cursor-pointer"
                 >
                    <Maximize2 size={14} />
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="bg-brand-bg/40 border border-brand-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
              <LayoutGrid size={20} className="text-brand-text/40" />
              <h3 className="text-sm font-black uppercase tracking-[4px] text-brand-text/60 italic">Sovereign Watch Multi-View</h3>
           </div>
           <div className="flex items-center gap-4 text-[9px] font-black text-brand-text/40 uppercase tracking-widest">
              <span>Online: {cameras.length}</span>
              <div className="w-1 h-3 bg-brand-border" />
              <span>Shadow_Check: Clear</span>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           {cameras.map(camera => (
             <motion.div 
               key={camera.mac}
               whileHover={{ scale: 1.02 }}
               onClick={() => setSelectedMainId(camera.mac)}
               className={cn(
                 "aspect-video bg-black rounded-lg border overflow-hidden relative cursor-pointer transition-all group",
                 selectedMainId === camera.mac ? "border-brand-accent shadow-[0_0_20px_rgba(51,93,148,0.3)] ring-1 ring-brand-accent/50" : "border-brand-border/40 grayscale hover:grayscale-0"
               )}
             >
                <img 
                  src={camera.feed_url} 
                  alt={camera.label} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                
                {/* Information Tooltip Overlay */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center pointer-events-none backdrop-blur-[2px]">
                   <div className="flex flex-col items-center gap-1.5 p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="w-1 h-1 bg-brand-accent rounded-full animate-pulse" />
                         <span className="text-[10px] font-black text-white uppercase tracking-[3px]">{camera.label}</span>
                      </div>
                      <div className="h-[1px] w-full bg-brand-accent/20" />
                      <span className="text-[8px] font-mono text-brand-accent/80 uppercase tracking-widest">{camera.current_ip}</span>
                      <div className="mt-2 px-2 py-0.5 bg-brand-accent/10 border border-brand-accent/20 rounded">
                         <span className="text-[6px] font-black text-brand-accent uppercase tracking-[4px]">Verified_Node</span>
                      </div>
                   </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none group-hover:opacity-0 transition-opacity" />
                <div className="absolute bottom-2 left-2 flex flex-col group-hover:opacity-0 transition-opacity">
                   <span className="text-[9px] font-black text-white uppercase truncate max-w-[120px]">{camera.label}</span>
                   <span className="text-[7px] font-mono text-white/40 uppercase">LIVE</span>
                </div>
                {selectedMainId === camera.mac && (
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                     <div className="w-1 h-1 bg-brand-success rounded-full animate-ping" />
                     <span className="text-[7px] font-black text-brand-success uppercase">Tracking</span>
                  </div>
                )}
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
}

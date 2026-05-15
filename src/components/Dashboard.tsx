import React, { useState, useEffect, useRef } from "react";
import { Device, ConnectivityState, GatedActivity, NetworkProcess, PortActivity, BarredEntity, StasisFile } from "@/src/types";
import { cn } from "@/src/lib/utils";
import NetworkCard from "./NetworkCard";
import DeviceTable from "./DeviceTable";
import ConnectivityTimeline from "./ConnectivityTimeline";
import SovereignStatus from "./SovereignStatus";
import GatedActivityList from "./GatedActivity";
import ProcessSandbox from "./ProcessSandbox";
import PortWitness from "./PortWitness";
import DataStasisPanel from "./DataStasisPanel";
import BiometricNexus from "./BiometricNexus";
import DeviceDetailModal from "./DeviceDetailModal";
import AIIntegrityPanel from "./AIIntegrityPanel";
import ToolGuardMonitor from "./ToolGuardMonitor";
import IonAuditTrail from "./IonAuditTrail";
import CameraWall from "./CameraWall";
import GovernanceCradle from "./GovernanceCradle";
import IPMapping from "./IPMapping";
import AuthorityInterception from "./AuthorityInterception";
import NetworkHistoryMonitor from "./NetworkHistoryMonitor";
import SecurityScanners from "./SecurityScanners";
import ProcessIntegrityChart from "./ProcessIntegrityChart";
import CommandCenter from "./CommandCenter";
import FailoverAlert from "./FailoverAlert";
import { ScannerState, Command } from "@/src/types";
import { Search, RefreshCw, Database, Bell, ShieldAlert, Monitor, Camera, Map, Lock, Minimize2, ExternalLink, Activity, ShieldCheck, Crown, Layers, Eye, FileLock2, Shield, Info, LayoutGrid, Cpu, Map as MapIcon, Snowflake, History, Smartphone, Terminal, ShieldPlus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectivity, setConnectivity] = useState<ConnectivityState | null>(null);
  const [prevSsid, setPrevSsid] = useState<string | null>(null);
  const [failoverInfo, setFailoverInfo] = useState<{ ssid: string; prev: string; reason: string; timestamp: string } | null>(null);
  const [gated, setGated] = useState<GatedActivity[]>([]);
  const [processes, setProcesses] = useState<NetworkProcess[]>([]);
  const [ports, setPorts] = useState<PortActivity[]>([]);
  const [barred, setBarred] = useState<BarredEntity[]>([]);
  const [stasisFiles, setStasisFiles] = useState<StasisFile[]>([]);
  const [filter, setFilter] = useState("");
  const [activeView, setActiveTab] = useState<"entities" | "witness" | "ion" | "watch" | "cradle" | "ip_map" | "interception" | "history" | "commands" | "defense">("entities");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [history, setHistory] = useState<ConnectivityState[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [scannerState, setScannerState] = useState<ScannerState | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Load cached data on mount
  useEffect(() => {
    const cached = localStorage.getItem("guardian_g_cache");
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setDevices(data.devices || []);
        setConnectivity(data.connectivity || null);
        setGated(data.gated || []);
        setProcesses(data.processes || []);
        setPorts(data.ports || []);
        setBarred(data.barred || []);
        setStasisFiles(data.stasisFiles || []);
        setHistory(data.history || []);
        setCommands(data.commands || []);
        setScannerState(data.connectivity?.scanner_state || null);
      } catch (e) {
        console.error("Cache restoration failed", e);
      }
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    fetchConfig();
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    setShowDetailModal(true);
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      setConfig(data);
    } catch (e) {
      console.error("Error fetching config", e);
    }
  };

  const fetchData = async () => {
    try {
      const [devRes, connRes, gatedRes, procRes, portRes, barredRes, stasisRes, histRes, cmdRes] = await Promise.all([
        fetch("/api/devices"),
        fetch("/api/connectivity"),
        fetch("/api/gated"),
        fetch("/api/processes"),
        fetch("/api/ports"),
        fetch("/api/barred"),
        fetch("/api/stasis"),
        fetch("/api/history"),
        fetch("/api/commands")
      ]);
      const devs = await devRes.json();
      const currentConn = await connRes.json();
      const gd = await gatedRes.json();
      const pr = await procRes.json();
      const pt = await portRes.json();
      const br = await barredRes.json();
      const st = await stasisRes.json();
      const hist = await histRes.json();
      const cmds = await cmdRes.json();
      
      setDevices(devs);
      setConnectivity(currentConn);
      setScannerState(currentConn.scanner_state);

      // Failover Detection Logic
      if (prevSsid && currentConn.ssid !== prevSsid && prevSsid !== "N/A") {
         setFailoverInfo({
            ssid: currentConn.ssid,
            prev: prevSsid,
            reason: currentConn.reason || "Automatic Failover Switch",
            timestamp: currentConn.lastScan || new Date().toISOString()
         });
      }
      setPrevSsid(currentConn.ssid);

      setGated(gd);
      setProcesses(pr);
      setPorts(pt);
      setBarred(br);
      setStasisFiles(st);
      setHistory(hist);
      setCommands(cmds);

      // Persist to local storage
      localStorage.setItem("guardian_g_cache", JSON.stringify({
        devices: devs,
        connectivity: currentConn,
        gated: gd,
        processes: pr,
        ports: pt,
        barred: br,
        stasisFiles: st,
        history: hist,
        commands: cmds
      }));
    } catch (e) {
      console.error("Error fetching data", e);
    }
  };

  const handleAuthorize = async (id: string, action: "authorized" | "denied") => {
    try {
      await fetch(`/api/authorize/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      fetchData();
    } catch (e) {
      console.error("Error authorizing", e);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/commands/${id}/approve`, { method: "POST" });
      fetchData();
    } catch (e) {
      console.error("Approval failed", e);
    }
  };

  const handleQuarantineCommand = async (id: string) => {
    try {
      await fetch(`/api/commands/${id}/quarantine`, { method: "POST" });
      fetchData();
    } catch (e) {
      console.error("Quarantine failed", e);
    }
  };

  const executeSystemScan = async (type: "network" | "port" | "process") => {
    try {
      await fetch(`/api/scan/${type}`, { method: "POST" });
      fetchData();
    } catch (e) {
      console.error("Scan failed", e);
    }
  };

  const triggerScan = async () => {
    setIsScanning(true);
    try {
      await fetch("/api/scan", { method: "POST" });
      await fetchData();
    } finally {
      setIsScanning(false);
    }
  };

  const handleMitigate = async () => {
    try {
      await fetch("/api/mitigate-alerts", { method: "POST" });
      await fetchData();
    } catch (e) {
      console.error("Mitigation Failed:", e);
    }
  };

  const handleAIPurge = async () => {
    try {
      await fetch("/api/ai/purge", { method: "POST" });
      await fetchData();
    } catch (e) {
      console.error("AI Purge Failed:", e);
    }
  };

  const handleAIHardcode = async () => {
    try {
      await fetch("/api/ai/hardcode", { method: "POST" });
      await fetchData();
    } catch (e) {
      console.error("AI Hardcode Failed:", e);
    }
  };

  const handleQuarantine = async (mac: string) => {
    try {
      await fetch(`/api/devices/${mac}/quarantine`, { method: "POST" });
      await fetchData();
    } catch (e) {
      console.error("Quarantine Action Failed:", e);
    }
  };

  const stats = {
    known: devices.length,
    processes: processes.length,
    ports: ports.length
  };

  return (
    <div className="min-h-screen bg-brand-bg text-white selection:bg-brand-accent selection:text-white pb-10">
      {/* Sovereign Header */}
      <header className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-b from-brand-card/50 to-transparent">
        <div className="flex items-center gap-4">
           <div className="bg-brand-accent p-3 rounded shadow-[0_0_15px_rgba(51,93,148,0.5)]">
             <ShieldCheck size={28} className="text-white" />
           </div>
           <div>
             <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">System_Telemetry_G</h1>
             <p className="text-brand-text/50 text-[10px] font-bold uppercase tracking-[4px] mt-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" /> Real-Time Environment Monitoring
             </p>
           </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={triggerScan} disabled={isScanning} className="flex items-center gap-2 px-5 py-2.5 bg-brand-success/10 hover:bg-brand-success text-brand-success hover:text-white rounded-md border border-brand-success/30 transition-all text-xs font-black uppercase tracking-widest disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <RefreshCw size={14} className={isScanning ? "animate-spin" : ""} /> {isScanning ? "Refreshing..." : "Sync System State"}
          </button>
        </div>
      </header>

      {/* Sovereign Status Banner */}
      <section className="px-6 pt-6">
        <SovereignStatus state={connectivity} />
      </section>

      {/* Connectivity Meta */}
      <section className="px-6 pt-6">
        <div className="bg-brand-card border border-brand-border p-4 rounded-xl flex items-center justify-between">
           <div className="flex gap-8">
              <div>
                <span className="text-[10px] font-black text-brand-text/40 uppercase tracking-widest block mb-1">Active SSID</span>
                <span className="text-sm font-bold flex items-center gap-2">
                  {connectivity?.ssid === "Wolves_Den_Core" ? <ShieldCheck size={14} className="text-brand-success" /> : <ShieldAlert size={14} className="text-brand-danger" />}
                  {connectivity?.ssid || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black text-brand-text/40 uppercase tracking-widest block mb-1">Egress Authority</span>
                <span className="text-sm font-bold flex items-center gap-2">
                  <Smartphone size={14} className="text-brand-accent" /> Tethered_Only
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black text-brand-text/40 uppercase tracking-widest block mb-1">Hostile Detection</span>
                <span className={cn(
                  "text-sm font-bold",
                  connectivity?.internet === "ok" ? "text-brand-success" : "text-brand-danger animate-pulse"
                )}>
                  {connectivity?.internet === "ok" ? "SECURE_EGRESS" : "HOSTILE_ROUTES_DETECTED"}
                </span>
              </div>
           </div>
           <div className="text-right">
              <span className="text-[10px] font-black text-brand-text/40 uppercase tracking-widest block mb-1">Last Validated Scan</span>
              <span className="text-xs font-mono">{connectivity?.lastScan ? new Date(connectivity.lastScan).toLocaleTimeString() : "PENDING..."}</span>
           </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="px-6 py-6 h-auto">
         <div className="flex items-center gap-2 mb-6">
            <button 
              onClick={() => setActiveTab("entities")}
              className={cn(
                "px-6 py-2 rounded font-black uppercase text-[10px] tracking-[2px] transition-all border",
                activeView === "entities" ? "bg-brand-accent border-brand-accent text-white shadow-[0_0_15px_rgba(51,93,148,0.3)]" : "bg-brand-card/50 border-brand-border text-brand-text/50 hover:text-white"
              )}
            >
              System Processes
            </button>
            <button 
              onClick={() => setActiveTab("witness")}
              className={cn(
                "px-6 py-2 rounded font-black uppercase text-[10px] tracking-[2px] transition-all border",
                activeView === "witness" ? "bg-brand-accent border-brand-accent text-white shadow-[0_0_15px_rgba(51,93,148,0.3)]" : "bg-brand-card/50 border-brand-border text-brand-text/50 hover:text-white"
              )}
            >
              Hardware Registry
            </button>
            <button 
              onClick={() => setActiveTab("cradle")}
              className={cn(
                "px-6 py-2 rounded font-black uppercase text-[10px] tracking-[2px] transition-all border flex items-center gap-2",
                activeView === "cradle" ? "bg-brand-accent border-brand-accent text-white shadow-[0_0_15px_rgba(51,93,148,0.3)]" : "bg-brand-card/50 border-brand-border text-brand-text/50 hover:text-white"
              )}
            >
              <Cpu size={14} /> Sovereignty Governance
            </button>
            <button 
              onClick={() => setActiveTab("ip_map")}
              className={cn(
                "px-6 py-2 rounded font-black uppercase text-[10px] tracking-[2px] transition-all border flex items-center gap-2",
                activeView === "ip_map" ? "bg-brand-accent border-brand-accent text-white shadow-[0_0_15px_rgba(51,93,148,0.3)]" : "bg-brand-card/50 border-brand-border text-brand-text/50 hover:text-white"
              )}
            >
              <MapIcon size={14} /> Network Geometry
            </button>
            <button 
              onClick={() => setActiveTab("history")}
              className={cn(
                "px-6 py-2 rounded font-black uppercase text-[10px] tracking-[2px] transition-all border flex items-center gap-2",
                activeView === "history" ? "bg-brand-accent border-brand-accent text-white shadow-[0_0_15px_rgba(51,93,148,0.3)]" : "bg-brand-card/50 border-brand-border text-brand-text/50 hover:text-white"
              )}
            >
              <History size={14} /> Connectivity Log
            </button>
            <button 
              onClick={() => setActiveTab("defense")}
              className={cn(
                "px-6 py-2 rounded font-black uppercase text-[10px] tracking-[2px] transition-all border flex items-center gap-2",
                activeView === "defense" ? "bg-brand-success border-brand-success text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "bg-brand-card/50 border-brand-border text-brand-text/50 hover:text-white"
              )}
            >
              <ShieldPlus size={14} /> AI Integrity Defense
            </button>
            <button 
              onClick={() => setActiveTab("commands")}
              className={cn(
                "px-6 py-2 rounded font-black uppercase text-[10px] tracking-[2px] transition-all border flex items-center gap-2 relative ring-offset-black",
                activeView === "commands" ? "bg-brand-danger border-brand-danger text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "bg-brand-card/50 border-brand-border text-brand-text/50 hover:text-white",
                commands.some(c => c.status === "pending") && activeView !== "commands" && "animate-pulse ring-2 ring-brand-danger ring-offset-2"
              )}
            >
              <Terminal size={14} /> Logic Intercept
              {commands.some(c => c.status === "pending") && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-brand-danger rounded-full animate-ping" />
                </span>
              )}
            </button>
          </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-8 flex flex-col gap-6">
            {activeView === "entities" && (
              <ProcessSandbox processes={processes} />
            )}
            
            {activeView === "defense" && (
              <div className="space-y-6">
                <AIIntegrityPanel 
                  state={connectivity?.ai_integrity || { model_alignment: 100, semantic_drift: 0, jailbreak_attempts: 0, firewall_status: "active", last_scan_ts: new Date().toISOString() }} 
                  attempts={connectivity?.compromise_attempts || []} 
                  onMitigate={handleMitigate}
                  onPurge={handleAIPurge}
                  onHardcode={handleAIHardcode}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {scannerState && <SecurityScanners state={scannerState} onScan={executeSystemScan} />}
                  <ProcessIntegrityChart processes={processes} />
                </div>
              </div>
            )}
            
            {activeView === "commands" && (
              <CommandCenter 
                commands={commands} 
                onApprove={handleApprove} 
                onQuarantine={handleQuarantineCommand} 
              />
            )}

            {activeView === "witness" && (
              <div className="bg-brand-card/30 border border-brand-border rounded-xl p-6">
                 <div className="flex items-center gap-3 mb-6">
                    <Database className="text-brand-accent" size={20} />
                    <h2 className="text-sm font-black uppercase tracking-[3px] text-white">Verified_Hardware_Artifacts</h2>
                 </div>
                 {devices.length > 0 ? (
                    <DeviceTable 
                        devices={devices} 
                        filter={filter} 
                        onSelect={handleDeviceSelect} 
                        onQuarantineToggle={handleQuarantine}
                        selectedMac={selectedDevice?.mac} 
                    />
                 ) : (
                    <div className="py-20 text-center opacity-30 border-2 border-dashed border-brand-border rounded-xl">
                       <Monitor size={48} className="mx-auto mb-4" />
                       <p className="text-xs font-black uppercase italic">No Hardware Anchors Detected in Local Environment</p>
                    </div>
                 )}
              </div>
            )}

            {activeView === "cradle" && (
              <div className="grid grid-cols-1 gap-6">
                 <GovernanceCradle actions={connectivity?.governance_cradle || []} />
                 <IonAuditTrail entries={connectivity?.audit_trail || []} />
              </div>
            )}

            {activeView === "ip_map" && (
              <IPMapping devices={devices} onQuarantineToggle={handleQuarantine} />
            )}
            
            {activeView === "history" && (
              <NetworkHistoryMonitor history={history} />
            )}
          </div>

          <div className="xl:col-span-4 flex flex-col gap-6">
             <div className="bg-brand-card border-l-4 border-brand-danger p-4 rounded-xl">
                <h4 className="text-brand-danger font-black text-[10px] uppercase tracking-[3px] mb-2 flex items-center gap-2">
                   <ShieldAlert size={14} /> Active Threat Mitigation
                </h4>
                <div className="space-y-4">
                   {connectivity?.audit_trail?.filter(a => a.tags?.includes("hostile")).slice(0, 2).map(alert => (
                     <div key={alert.id} className="text-[11px] font-bold text-white border-b border-white/5 pb-2">
                        <span className="text-brand-danger uppercase block mb-1">拦截_INTERCEPT</span>
                        {alert.content}
                     </div>
                   ))}
                   {connectivity?.audit_trail?.filter(a => a.tags?.includes("hostile")).length === 0 && (
                     <p className="text-[10px] text-brand-text/40 italic">No hostile attempts currently intercepted.</p>
                   )}
                </div>
             </div>

             <div className="bg-brand-card border border-brand-border rounded-xl p-5">
               <h4 className="text-white font-black uppercase text-[10px] tracking-[4px] mb-4 flex items-center gap-2">
                 Infrastructure Evolution
               </h4>
               <ConnectivityTimeline history={history} />
             </div>
          </div>
        </div>
      </main>

      {/* Failover Alert Overlay */}
      <AnimatePresence>
        {failoverInfo && (
          <FailoverAlert 
            ssid={failoverInfo.ssid}
            previousSsid={failoverInfo.prev}
            reason={failoverInfo.reason}
            timestamp={failoverInfo.timestamp}
            onClose={() => setFailoverInfo(null)}
          />
        )}
      </AnimatePresence>

      {/* Device Detail Modal */}
      <DeviceDetailModal 
        device={showDetailModal ? selectedDevice : null} 
        onClose={() => setShowDetailModal(false)} 
      />

      {/* Sovereign Console Log */}
      <div className="fixed bottom-0 left-0 right-0 bg-brand-bg border-t border-brand-border/40 px-6 py-2 z-50">
        <div className="flex items-center justify-between gap-4">
           <div className="flex items-center gap-4 text-[10px] font-mono text-brand-text/60 overflow-hidden">
             <span className="text-brand-success font-black uppercase shrink-0 tracking-widest">Console.G</span>
             <span className="w-1 h-4 bg-brand-border shrink-0" />
             <div className="truncate whitespace-nowrap">
                {isOffline ? "[OFFLINE_MODE] Sovereignty Buffer Active. Sync deferred until Backbone visibility." : 
                 connectivity ? `[${new Date().toLocaleTimeString()}] Guardian v5.24.S Checking State... Flow status: ${connectivity.reason}` : "Booting kernel..."}
             </div>
           </div>
           
           <div className="hidden sm:flex items-center gap-6">
              {isOffline && (
                <div className="flex items-center gap-1.5 text-[9px] font-black text-brand-warning animate-pulse uppercase">
                  <Shield size={12} /> Local-Vanguard-Engaged
                </div>
              )}
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-brand-text opacity-40 uppercase">
                 <ShieldCheck size={12} className="text-brand-success" /> Logic-Validator 
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-brand-text opacity-40 uppercase">
                 <ShieldCheck size={12} className="text-brand-success" /> Integrity-Lock
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

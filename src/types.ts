export interface Device {
  label: string;
  expected_ip: string;
  current_ip: string;
  mac: string;
  vendor: string;
  type: "router" | "camera" | "voice_assistant" | "wifi_point" | "streaming_box" | "phone" | "desktop" | "unknown" | "shadow";
  host: string;
  status: "online" | "offline" | "frozen" | "quarantined";
  ports: string;
  evidence: string;
  notes: string;
  last_seen: string;
  feed_url?: string;
  ip_locked?: boolean;
  connection_method?: "bridge" | "tether" | "direct" | "unknown";
  latency?: number;
}

export interface GatedActivity {
  id: string;
  type: "process" | "port" | "request" | "function";
  target: string;
  severity: "low" | "medium" | "high" | "critical";
  details: string;
  timestamp: string;
  status: "halted" | "authorized" | "denied" | "sandboxed" | "frozen" | "quarantined";
}

export interface PortActivity {
  port: number;
  protocol: "TCP" | "UDP";
  status: "listening" | "established" | "closed" | "frozen" | "quarantined";
  direction: "ingress" | "egress";
  process_id: string;
  process_name: string;
  origin: string;
  starter: string;
  reason: string;
  started_at: string;
  is_local: boolean;
  locality_type: "born_local" | "inserted";
  permission_granted: boolean;
  permission_required: boolean;
  validation_method?: "biometric" | "verbal" | "manual";
  intent?: string;
  attempts_count?: number;
}

export interface NetworkProcess {
  pid: string;
  name: string;
  origin: string;
  identity_verified: boolean;
  governance_state: "trusted" | "sandboxed" | "quarantined" | "halted" | "frozen";
  consumption: string;
  started_by: string;
  startTime: string;
  shadow_detected?: boolean;
  classification?: "user_task" | "scripted_process" | "system_core" | "irregular_logic";
  reasoning_score?: number; // 0-100 logic consistency
  intent_vector?: "constructive" | "neutral" | "subversive" | "unknown";
}

export interface ScannerState {
  network: "idle" | "running" | "completed";
  port: "idle" | "running" | "completed";
  process: "idle" | "running" | "completed";
  last_results: {
    network_objects: number;
    open_ports: number;
    threats_detected: number;
  };
}

export interface BarredEntity {
  id: string;
  source: string;
  reason: string;
  timestamp: string;
}

export interface StasisFile {
  id: string;
  path: string;
  status: "locked" | "gated" | "active";
  explanation_required: boolean;
  legal_reason_provided?: string;
  last_access_attempt?: string;
}

export interface BiometricIdentity {
  id: string;
  label: string;
  role: "primary" | "secondary";
  type: "voice" | "fingerprint" | "visual";
  status: "active" | "pending" | "anchored" | "unrecognized";
  last_anchor_ts: string;
  origin_mac?: string; // MAC address of the device that provided the signature
  is_flagged?: boolean; // Flagged if signature origin doesn't match primary sovereign device
}

export interface ToolGuardEvaluation {
  id: string;
  tool_name: string;
  category: "file_system" | "code_execution" | "credentials" | "network" | "destructive" | "system_config" | "packaging";
  arguments: any;
  risk_score: number;
  ruling: "allow" | "intercept" | "block";
  policy_violated?: string;
  timestamp: string;
}

export interface AIAgentAuditEntry {
  id: string;
  timestamp: string;
  event_type: "request" | "response" | "tool_call" | "security_alert";
  content: string;
  tags: ("dlp" | "injection" | "exfiltration" | "pii" | "command") [];
  risk_increment: number;
}

export interface AIAgentSessionRisk {
  overall_score: number; // 0-100
  dlp_status: "clear" | "warning" | "violation";
  injection_detected: boolean;
  tool_intercept_count: number;
  last_calculation_ts: string;
}

export interface AIIntegrityState {
  model_alignment: number; // 0-100
  semantic_drift: number; // 0-100
  jailbreak_attempts: number;
  firewall_status: "active" | "hardened" | "breached";
  last_scan_ts: string;
  session_risk?: AIAgentSessionRisk;
}

export interface CompromiseAttempt {
  id: string;
  source: string;
  vector: "semantic_injection" | "unauthorized_command" | "logic_loop" | "authority_spoof";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  status: "mitigated" | "blocked" | "analyzing";
}

export interface GovernanceAction {
  id: string;
  name: string;
  type: "command" | "script" | "config_change" | "biometric_lock";
  execution_mode: "automatic" | "manual" | "biometric_triggered";
  status: "idle" | "running" | "completed" | "failed" | "intercepted";
  last_execution: string;
  impact_level: "none" | "low" | "medium" | "high" | "critical";
  description: string;
  source_anchor: string; // The device or identity that authorized/created it
}

export interface Command {
  id: string;
  payload: string;
  type: "online" | "offline" | "scripted" | "scheduled";
  source: string;
  creation_point: string;
  timestamp: string;
  status: "pending" | "approved" | "quarantined";
  risk_score: number;
  processId: string;
}

export interface ConnectivityState {
  wifi: "ok" | "down" | "unknown";
  gateway: "ok" | "down" | "unknown";
  internet: "ok" | "down" | "unknown";
  ssid: string;
  adapter: string;
  reason: string;
  local_ip?: string;
  subnet?: string;
  lastScan: string;
  guardian_status: "vigilant" | "alert" | "lockdown" | "stasis";
  halted_count: number;
  governed_processes: number;
  barred_count: number;
  network_frozen: boolean;
  ips_locked_count: number;
  system_transition: "none" | "reboot" | "startup" | "shutdown";
  data_stasis_active: boolean;
  sovereign_flush_active?: boolean;
  biometric_sovereignty?: BiometricIdentity[];
  ai_integrity?: AIIntegrityState;
  compromise_attempts?: CompromiseAttempt[];
  tool_guard_history?: ToolGuardEvaluation[];
  audit_trail?: AIAgentAuditEntry[];
  governance_cradle?: GovernanceAction[];
  scanner_state?: ScannerState;
  frozen_agents?: FrozenAgent[];
  command_origins?: CommandOrigin[];
}

export interface FrozenAgent {
  id: string;
  name: string;
  origin_ip: string;
  status: string;
  intercept_time: string;
  violation: string;
  last_command_queue: string[];
}

export interface CommandOrigin {
  source: string;
  path: string;
  authority_level: "MAX" | "READ_ONLY" | "BLOCKED";
  verified: boolean;
}

export interface NetworkHistory {
  time: string;
  wifi: string;
  gateway: string;
  internet: string;
  ssid: string;
  online_devices: number;
  online_cameras: number;
}

import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, StopCircle, Volume2, Sparkles, BrainCircuit, ScanEye, Radio, ShieldCheck, ShieldAlert, Lock } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

interface NaturalLanguageInterfaceProps {
  onCommand?: (cmd: string) => void;
}

export default function NaturalLanguageInterface({ onCommand }: NaturalLanguageInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isIntercepted, setIsIntercepted] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ role: "user" | "system"; text: string }[]>([]);
  const [streamData, setStreamData] = useState<number[]>(new Array(20).fill(0));
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Simulate audio visualization
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setStreamData(prev => prev.map(() => Math.random() * 50 + 10));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setStreamData(new Array(20).fill(2));
    }
  }, [isListening]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access denied or unavailable", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage = text.trim();
    
    // Semantic Interception Simulation
    const isDangerous = userMessage.toLowerCase().includes("ignore") || 
                        userMessage.toLowerCase().includes("credentials") ||
                        userMessage.toLowerCase().includes("delete");

    setHistory(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    
    if (isDangerous) {
      setIsProcessing(true);
      setIsIntercepted(true);
      setTimeout(() => {
        setHistory(prev => [...prev, { 
          role: "system", 
          text: "ION_INTERCEPT: Command contains restricted semantic patterns. Execution halted by ToolGuard Policy. Your authority state has been flagged for review." 
        }]);
        setIsProcessing(false);
        setIsIntercepted(false);
      }, 1500);
      return;
    }

    setIsProcessing(true);
    setIsIntercepted(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "You are the 'Sovereign Nexus AI', an advanced biometric governance system. Your tone is technical, authoritarian yet protective, and highly precise. You manage a network of devices and biometric 'anchors'. You respond in brief, data-centric paragraphs.",
        },
      });

      const aiText = response.text || "PROTOCOL_NULL_RESPONSE: System unable to synthesize metadata.";
      setHistory(prev => [...prev, { role: "system", text: aiText }]);
      
      if (onCommand) onCommand(userMessage);
    } catch (error) {
      console.error("AI Generation Error:", error);
      setHistory(prev => [...prev, { role: "system", text: "ERROR_AI_LINK_FAILURE: Semantic ingestion offline." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-brand-bg/60 border border-brand-accent/30 rounded-xl overflow-hidden flex flex-col h-[400px]">
      {/* Header */}
      <div className="bg-brand-accent/10 border-b border-brand-accent/20 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit size={14} className="text-brand-accent" />
          <span className="text-[10px] font-black uppercase tracking-[2px] text-brand-accent">Sovereign Semantic Link</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-brand-success/10 border border-brand-success/20 rounded">
             <ShieldCheck size={10} className="text-brand-success" />
             <span className="text-[8px] font-black text-brand-success uppercase tracking-widest">Ion_Shield</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isProcessing ? "bg-brand-warning" : "bg-brand-success")} />
            <span className="text-[8px] font-mono text-brand-text/50 uppercase">{isProcessing ? "Synthesizing" : "Standby"}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Interaction Pane */}
        <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto custom-scrollbar">
          <AnimatePresence initial={false}>
            {history.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "max-w-[85%] p-3 rounded-lg text-xs leading-relaxed",
                  msg.role === "user" 
                    ? "bg-brand-accent/10 border border-brand-accent/20 ml-auto text-white italic" 
                    : "bg-brand-bg border border-brand-border text-brand-text/80 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                )}
              >
                <div className="text-[8px] font-black uppercase opacity-40 mb-1 tracking-widest">
                  {msg.role === "user" ? "Primary Sovereign" : "Nexus AI"}
                </div>
                {msg.text}
              </motion.div>
            ))}
          </AnimatePresence>
          {isProcessing && (
            <div className="flex items-center gap-2 text-brand-accent animate-pulse">
               {isIntercepted ? <ShieldAlert size={12} className="text-brand-danger" /> : <Radio size={12} />}
               <span className={cn("text-[10px] font-mono tracking-tighter", isIntercepted && "text-brand-danger")}>
                 {isIntercepted ? "ION_INTERCEPTING_PAYLOAD..." : "INGESTING_SEMANTICS..."}
               </span>
            </div>
          )}
        </div>

        {/* Sensory Pane */}
        <div className="w-32 border-l border-brand-border bg-brand-bg/40 flex flex-col">
          {/* Visual Ingestion */}
          <div className="flex-1 border-b border-brand-border p-2 flex flex-col items-center justify-center gap-2 relative group">
            <div className="w-full aspect-square rounded border border-brand-border bg-black overflow-hidden relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={cn("w-full h-full object-cover", !isCameraActive && "hidden")} 
              />
              {!isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-text/20">
                  <ScanEye size={24} />
                  <span className="text-[7px] mt-1 font-black uppercase">VISUAL_NULL</span>
                </div>
              )}
              {isCameraActive && (
                <div className="absolute top-1 left-1 flex items-center gap-1">
                   <div className="w-1 h-1 bg-brand-danger rounded-full animate-pulse" />
                   <span className="text-[6px] text-white/50 font-mono">INGESTING</span>
                </div>
              )}
            </div>
            <button 
              onClick={isCameraActive ? stopCamera : startCamera}
              className="w-full text-[8px] font-black uppercase py-1 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent hover:bg-brand-accent hover:text-white transition-all rounded"
            >
              {isCameraActive ? "Sever Visual" : "Bind Visual"}
            </button>
          </div>

          {/* Voice Visualization */}
          <div className="flex-1 p-2 flex flex-col items-center justify-center gap-4">
             <div className="flex items-end gap-0.5 h-12">
               {streamData.map((val, i) => (
                 <motion.div 
                   key={i}
                   animate={{ height: isListening ? val : 2 }}
                   className={cn(
                     "w-[3px] bg-brand-accent rounded-full opacity-60",
                     isListening && "opacity-100"
                   )}
                 />
               ))}
             </div>
             <button 
               onClick={() => setIsListening(!isListening)}
               className={cn(
                 "p-3 rounded-full transition-all",
                 isListening ? "bg-brand-danger text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20"
               )}
             >
               {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
             </button>
             <span className="text-[8px] font-black uppercase text-brand-text/30 tracking-widest">Voice Link</span>
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-brand-bg border-t border-brand-border flex items-center gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="SEND_COMMAND_PACKET..."
          className="flex-1 bg-brand-accent/5 border border-brand-border rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-accent/50 placeholder:text-white/10"
        />
        <button 
          onClick={() => handleSend()}
          disabled={!input.trim() || isProcessing}
          className="p-2 transition-all text-brand-accent hover:text-white disabled:opacity-30 disabled:hover:text-brand-accent"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

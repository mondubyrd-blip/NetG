import React from "react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

interface NetworkCardProps {
  label: string;
  value: string;
  status?: "ok" | "down" | "unknown";
  className?: string;
}

export default function NetworkCard({ label, value, status, className }: NetworkCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "ok": return "bg-brand-success text-white";
      case "down": return "bg-brand-danger text-white";
      case "unknown": return "bg-gray-500 text-white";
      default: return "bg-brand-accent/50 text-white";
    }
  };

  const getGlowClass = () => {
    if (status === "ok") return "status-glow-ok";
    if (status === "down") return "status-glow-down";
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-brand-card flex flex-col p-4 rounded-lg border border-brand-border h-full",
        className
      )}
    >
      <div className="text-brand-text text-xs uppercase tracking-wider font-medium mb-2">
        {label}
      </div>
      <div className="flex items-center gap-3 mt-auto">
        {status && (
          <div className={cn("w-3 h-3 rounded-full", getStatusColor(), getGlowClass())} />
        )}
        <div className="text-xl font-bold tracking-tight break-all truncate">
          {value}
        </div>
      </div>
    </motion.div>
  );
}

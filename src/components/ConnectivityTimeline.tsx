import React from "react";
import { ConnectivityState } from "@/src/types";

interface ConnectivityTimelineProps {
  history: ConnectivityState[];
}

export default function ConnectivityTimeline({ history }: ConnectivityTimelineProps) {
  // Use last 60 points
  const displayData = history.slice(-60);
  
  if (displayData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-brand-text opacity-50 italic text-sm">
        Collecting data...
      </div>
    );
  }

  const getColor = (state: "ok" | "down" | "unknown") => {
    if (state === "ok") return "#3fb950";
    if (state === "down") return "#f85149";
    return "#4a5568";
  };

  const types: Array<keyof Pick<ConnectivityState, "wifi" | "gateway" | "internet">> = ["wifi", "gateway", "internet"];

  return (
    <div className="space-y-4 py-2">
      {types.map(type => (
        <div key={type} className="flex items-center gap-4">
          <div className="w-16 text-[10px] font-bold uppercase text-brand-text tracking-tighter">
            {type}
          </div>
          <div className="flex-1 flex gap-[1px]">
            {displayData.map((point, i) => (
              <div
                key={i}
                className="flex-1 h-5 rounded-sm"
                style={{ backgroundColor: getColor(point[type]) }}
                title={`${type}: ${point[type]} at ${new Date(point.lastScan).toLocaleTimeString()}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

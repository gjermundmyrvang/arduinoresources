import { ReactNode } from "react";

interface LCDScreenProps {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
  num?: string;
  topText?: string;
  statusLabel?: string;
  statusColor?: string;
  showStatus?: boolean;
  showHeader?: boolean;
  casingColor?: string;
}

export default function LCDScreen({
  children,
  className = "",
  screenClassName = "",
  topText = "Ressursside laget for IN1060 studenter",
  num = "01",
  statusLabel = "READY",
  statusColor = "#4f8",
  showStatus = true,
  showHeader = true,
  casingColor = "#404040",
}: LCDScreenProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`rounded-sm p-3`}
        style={{ backgroundColor: casingColor }}
      >
        <div
          className={`relative overflow-hidden rounded-xs px-4 py-3 ${screenClassName}`}
          style={{
            background:
              "linear-gradient(160deg, #1a3a5c 0%, #0d2137 60%, #0a1a2e 100%)",
            boxShadow:
              "inset 0 2px 8px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,80,160,0.2)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(130deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
            }}
          />
          {showHeader && (
            <div className="mb-2 flex items-center gap-1">
              <span
                style={{
                  color: "#4af",
                  fontSize: "9px",
                  opacity: 0.6,
                }}
                className="font-mono"
              >
                {num} &gt; {topText}
              </span>
            </div>
          )}

          <div
            className="relative"
            style={{
              color: "#7df",
              textShadow:
                "0 0 8px rgba(80,180,255,0.8), 0 0 20px rgba(80,180,255,0.4)",
            }}
          >
            {children}
          </div>

          {showStatus && (
            <div className="mt-3 flex items-center gap-2 font-mono">
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{
                  background: statusColor,
                  boxShadow: `0 0 4px ${statusColor}`,
                }}
              />
              <span
                style={{
                  color: statusColor,
                  fontSize: "8px",
                  opacity: 0.5,
                  letterSpacing: "0.1em",
                }}
              >
                {statusLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

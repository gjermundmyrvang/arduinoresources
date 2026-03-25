"use client";

interface ArduinoSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ArduinoSearch({
  value,
  onChange,
  placeholder = "SEARCH...",
  className = "",
}: ArduinoSearchProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Input casing */}
      <div
        className="flex-1 relative"
        style={{
          background: "#111",
          border: "1px solid #2a2a2a",
          boxShadow: "2px 2px 0 #000, inset 0 1px 0 rgba(255,255,255,0.03)",
          borderRadius: "2px",
        }}
      >
        {/* Corner screws */}
        <div className="absolute top-1 left-1 h-1.5 w-1.5 rounded-full bg-neutral-700 border border-neutral-600" />
        <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-neutral-700 border border-neutral-600" />

        {/* Screen surface */}
        <div
          className="mx-4 my-1.5 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #1a3a5c 0%, #0d2137 60%, #0a1a2e 100%)",
            boxShadow:
              "inset 0 2px 6px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,80,160,0.2)",
            borderRadius: "2px",
          }}
        >
          {/* Scanlines */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
            }}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="relative w-full bg-transparent outline-none font-mono text-xs py-2 px-2"
            style={{
              color: "#7df",
              textShadow: "0 0 8px rgba(80,180,255,0.8)",
              caretColor: "#4af",
              letterSpacing: "0.08em",
            }}
          />
        </div>

        {/* Status dot */}
        <div className="absolute bottom-1.5 right-3 flex items-center gap-1">
          <span
            className="h-1 w-1 rounded-full"
            style={{
              background: value ? "#4f8" : "#4af",
              boxShadow: value ? "0 0 3px #4f8" : "0 0 3px #4af",
              animation: "pulse 2s infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}

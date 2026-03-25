import { FilterOption } from "@/src/types";

interface ArduinoFilterProps<T extends string> {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function ArduinoFilter<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: ArduinoFilterProps<T>) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className="relative flex flex-col items-center gap-1"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <div
              className="relative flex items-center justify-center transition-all duration-75 active:translate-y-0.75"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: active
                  ? "linear-gradient(145deg, #1a9945, #0e7a34)"
                  : "linear-gradient(145deg, #4a4a4a, #2e2e2e)",
                boxShadow: active
                  ? "0 4px 0 #074d20, 0 5px 2px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.2)"
                  : "0 4px 0 #111, 0 5px 2px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.15)",
                border: active ? "2px solid #0a5c28" : "2px solid #1a1a1a",
                transition: "all 0.075s ease",
              }}
            />

            <div
              className="rounded-sm px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest mt-1"
              style={{
                background: active ? "#1a3a1a" : "#1a1a1a",
                color: active ? "#4f8" : "rgba(255,255,255,0.35)",
                border: active ? "1px solid #2a5a2a" : "1px solid #2a2a2a",
                fontFamily: "monospace",
                letterSpacing: "0.12em",
                textShadow: active ? "0 0 4px rgba(80,255,80,0.5)" : "none",
                transition: "all 0.075s ease",
              }}
            >
              {option.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

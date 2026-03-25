import { Resource } from "@/src/types";
import { useRouter } from "next/navigation";
import { formatNumber, parseDate } from "../lib/utils";
import ArduinoButton from "./arduino-button";
import LCDScreen from "./lcd-screen";

const typeColors: Record<string, { bg: string; text: string; glow: string }> = {
  guide: { bg: "#1a3a1a", text: "#4f8", glow: "rgba(80,255,80,0.5)" },
  example: { bg: "#1a2a3a", text: "#4af", glow: "rgba(80,180,255,0.5)" },
  inspiration: { bg: "#2a1a3a", text: "#c8f", glow: "rgba(180,80,255,0.5)" },
};

const fallbackColor = { bg: "#ececec", text: "#7df", glow: "none" };

function PCBLabel({ text, type }: { text: string; type: string }) {
  const color = typeColors[type] ?? fallbackColor;
  return (
    <span
      className="shrink-0 rounded-sm py-0.5 text-[9px] font-medium uppercase tracking-widest"
      style={{
        color: color.text,
        border: `1px solid ${color.text}33`,
        fontFamily: "monospace",
        textShadow: `0 0 4px ${color.glow}`,
      }}
    >
      {text}
    </span>
  );
}

export default function ResourceCard({ r, num }: { r: Resource; num: number }) {
  const router = useRouter();

  const color = typeColors[r.type];

  const handleNavigate = () => {
    router.push(`/resources/${r.slug}`);
  };
  return (
    <LCDScreen
      className="mt-4"
      num={formatNumber(num)}
      topText={r.slug}
      statusLabel={`Sist oppdatert: ${parseDate(r.updated_at)}`}
      casingColor={color.bg}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col mt-2">
          <h2 className="truncate text-2xl font-bold font-bitcount tracking-tight">
            {r.title}
          </h2>
          <PCBLabel text={r.type} type={r.type} />
        </div>
        <div>
          {r.summary && <p className="mb-3 text-xs leading-5">{r.summary}</p>}

          {/* Footer */}
          <div
            className="mt-4 pt-3 flex items-center justify-between"
            style={{ borderTop: "1px dashed #7df" }}
          >
            <ArduinoButton label="Åpne ressurs" onClick={handleNavigate} />
            <PCBLabel text={r.level ?? "—"} type="" />
          </div>
        </div>
      </div>
    </LCDScreen>
  );
}

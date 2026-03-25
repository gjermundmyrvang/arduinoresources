"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";

type Status = "idle" | "loading" | "success" | "duplicate" | "error";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async () => {
    if (!email) return;
    setStatus("loading");

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) setStatus("success");
    else if (res.status === 409) setStatus("duplicate");
    else setStatus("error");
  };

  const statusConfig = {
    idle: { label: "READY", color: "#4af", glow: "rgba(80,180,255,0.5)" },
    loading: {
      label: "SENDING...",
      color: "#facc15",
      glow: "rgba(250,204,21,0.5)",
    },
    success: {
      label: "SUBSCRIBED",
      color: "#4f8",
      glow: "rgba(80,255,80,0.5)",
    },
    duplicate: {
      label: "EXISTS",
      color: "#fb923c",
      glow: "rgba(251,146,60,0.5)",
    },
    error: { label: "ERROR", color: "#f87171", glow: "rgba(248,113,113,0.5)" },
  } satisfies Record<Status, { label: string; color: string; glow: string }>;

  const current = statusConfig[status];

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-semibold">Meld deg opp på nyhetsbrev</h1>
      <div
        className="relative p-0.75 mt-4"
        style={{ background: "#404040", borderRadius: "2px" }}
      >
        {/* Corner screws */}
        <div className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-neutral-600 border border-neutral-500" />
        <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-neutral-600 border border-neutral-500" />
        <div className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full bg-neutral-600 border border-neutral-500" />
        <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-neutral-600 border border-neutral-500" />

        <div className="bg-neutral-800 p-3 rounded-sm">
          <div
            className="px-4 py-3 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, #1a3a5c 0%, #0d2137 60%, #0a1a2e 100%)",
              boxShadow:
                "inset 0 2px 8px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,80,160,0.2)",
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
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(130deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
              }}
            />

            {/* Header */}
            <div className="mb-3 flex items-center gap-2">
              <Mail size={10} style={{ color: "#4af", opacity: 0.6 }} />
              <span
                style={{
                  color: "#4af",
                  fontSize: "9px",
                  fontFamily: "monospace",
                  opacity: 0.6,
                  letterSpacing: "0.1em",
                }}
              >
                VARSLE MEG OM NYE RESSURSER
              </span>
            </div>

            {status === "success" ? (
              <p
                className="font-mono text-sm py-1"
                style={{
                  color: "#4f8",
                  textShadow: "0 0 8px rgba(80,255,80,0.6)",
                }}
              >
                Du er nå meldt på nyhetsbrevet. For å være sikker på at du
                mottar e-postene, sjekk søppelpost eller spam og marker avsender
                som trygg.
              </p>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="din@epost.no"
                  disabled={status === "loading"}
                  className="flex-1 bg-transparent outline-none font-mono text-xs py-1"
                  style={{
                    color: "#7df",
                    textShadow: "0 0 8px rgba(80,180,255,0.8)",
                    caretColor: "#4af",
                    letterSpacing: "0.06em",
                    borderBottom: "1px solid rgba(80,180,255,0.2)",
                  }}
                />

                <button
                  onClick={handleSubmit}
                  disabled={status === "loading" || !email}
                  className="relative flex items-center justify-center transition-all duration-75 active:translate-y-0.5 disabled:opacity-40"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "linear-gradient(145deg, #1a9945, #0e7a34)",
                    boxShadow:
                      "0 3px 0 #074d20, inset 0 1px 1px rgba(255,255,255,0.2)",
                    border: "2px solid #0a5c28",
                    cursor:
                      status === "loading" || !email
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  <div
                    className="absolute inset-1 rounded-full"
                    style={{
                      background: "linear-gradient(145deg, #22b350, #128a3a)",
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  />
                  <Send
                    size={10}
                    className="relative z-10"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                  />
                </button>
              </div>
            )}

            {/* Status bar */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{
                    background: current.color,
                    boxShadow: `0 0 4px ${current.glow}`,
                  }}
                />
                <span
                  style={{
                    color: current.color,
                    fontSize: "8px",
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                    textShadow: `0 0 4px ${current.glow}`,
                  }}
                >
                  {current.label}
                </span>
              </div>

              {(status === "duplicate" || status === "error") && (
                <button
                  onClick={() => setStatus("idle")}
                  style={{
                    color: "#4af",
                    fontSize: "8px",
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    opacity: 0.6,
                  }}
                >
                  PRØV IGJEN
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

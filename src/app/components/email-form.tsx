"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function NotifyForm() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [sentCount, setSentCount] = useState(0);

  const handleSubmit = async () => {
    if (!subject || !body) return;
    setStatus("loading");

    console.log("Calls notify api");

    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body, resourceUrl }),
    });

    if (res.ok) {
      const data = await res.json();
      setSentCount(data.sent);
      setStatus("success");
    } else {
      console.log("Encountered an error");
      setStatus("error");
    }
  };

  const inputClass =
    "w-full border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400 transition-colors";

  return (
    <div className="w-full mt-4">
      <h2 className="text-2xl font-medium text-neutral-900 mb-4">
        Send varsel til abonnenter
      </h2>

      {status === "success" ? (
        <div className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Sendt til {sentCount} abonnent{sentCount !== 1 ? "er" : ""}.{" "}
          <button
            onClick={() => {
              setStatus("idle");
              setSubject("");
              setBody("");
              setResourceUrl("");
            }}
            className="underline"
          >
            Send ny
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Emne</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ny ressurs: ..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">
              Melding
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Skriv en kort beskrivelse..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">
              Ressurs URL <span className="text-neutral-400">(valgfritt)</span>
            </label>
            <input
              type="url"
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          {status === "error" && (
            <p className="text-xs text-red-600">Noe gikk galt.</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!subject || !body || status === "loading"}
            className="flex items-center gap-2 self-end border border-neutral-300 bg-white px-4 py-2 text-sm hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={13} />
            {status === "loading" ? "Sender..." : "Send"}
          </button>
        </div>
      )}
    </div>
  );
}

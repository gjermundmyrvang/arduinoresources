"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase/browser";
import Hero from "./components/hero";
import { BookOpen } from "lucide-react";

type Resource = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  type: "guide" | "example" | "inspiration" | "reference" | "troubleshooting";
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export default function Home() {
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<"all" | Resource["type"]>("all");

  const filteredItems =
    typeFilter === "all" ? items : items.filter((r) => r.type === typeFilter);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("resources")
        .select(
          "id,title,slug,summary,type,level,tags,featured,published,created_at,updated_at",
        )
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        setError(error.message);
        setItems([]);
      } else {
        setItems((data ?? []) as Resource[]);
      }

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="w-full px-4 py-10">
      <Hero />
      <h1 className="mt-4 text-2xl font-semibold">Arduino-ressurser</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            ["all", "Alle"],
            ["guide", "Guides"],
            ["example", "Eksempler"],
            ["inspiration", "Inspirasjon"],
            ["reference", "Referanse"],
            ["troubleshooting", "Feilsøking"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => setTypeFilter(value as any)}
            className={`rounded-full border px-3 py-1 text-sm ${
              typeFilter === value
                ? "bg-neutral-900 text-white border-neutral-900"
                : "hover:bg-neutral-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="mt-6">Laster…</p>}
      {error && <p className="mt-6 text-sm text-red-600">Feil: {error}</p>}

      <ul id="resources" className="mt-6 grid sm:grid-cols-2 gap-2">
        {filteredItems.map((r) => (
          <li
            key={r.id}
            className="rounded-xl border border-neutral-200 p-4 hover:bg-neutral-50"
          >
            <h2 className="font-medium">{r.title}</h2>

            {r.summary && (
              <p className="mt-2 text-sm text-neutral-700">{r.summary}</p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {r.tags?.slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="text-xs rounded-full bg-neutral-100 px-2 py-1 text-neutral-700"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <Link
                className="text-sm underline flex items-center gap-1"
                href={`/resources/${r.slug}`}
              >
                <BookOpen size={16} />
                <p>Åpne</p>
              </Link>
              <span className="text-xs rounded-full border px-2 py-1 text-neutral-600">
                {r.type} · {r.level}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

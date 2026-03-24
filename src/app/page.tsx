"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase/browser";
import Hero from "./components/hero";
import { BookOpen } from "lucide-react";
import { Resource } from "../types";
import ResourceList from "./components/resource-list";

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
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => setTypeFilter(value as any)}
            className={`border px-3 py-1 text-sm ${
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

      <ResourceList resources={filteredItems} />
    </main>
  );
}

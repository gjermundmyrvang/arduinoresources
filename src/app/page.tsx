"use client";

import { useEffect, useState } from "react";
import { Resource } from "../types";
import Hero from "./components/hero";
import ResourceList from "./components/resource-list";
import { supabase } from "./lib/supabase/browser";
import ArduinoFilter from "./components/filter";
import ArduinoSearch from "./components/search-bar";
import SubscribeForm from "./components/subscribe-form";

export default function Home() {
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Resource["type"]>("all");

  const filteredItems = items.filter((r) => {
    const matchesType = typeFilter === "all" || r.type === typeFilter;
    const matchesSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.summary?.toLowerCase().includes(search.toLowerCase()) ||
      r.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    return matchesType && matchesSearch;
  });

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
      <div className="mt-4 flex flex-wrap items-end gap-4">
        <ArduinoFilter
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: "all", label: "Alle" },
            { value: "guide", label: "Guides" },
            { value: "example", label: "Eksempler" },
            { value: "inspiration", label: "Inspirasjon" },
          ]}
          className="mt-4"
        />
        <ArduinoSearch
          value={search}
          onChange={setSearch}
          placeholder="SEARCH..."
          className="flex-1 min-w-48"
        />
      </div>

      {loading && <p className="mt-6">Laster…</p>}
      {error && <p className="mt-6 text-sm text-red-600">Feil: {error}</p>}

      <ResourceList resources={filteredItems} />
      <SubscribeForm />
    </main>
  );
}

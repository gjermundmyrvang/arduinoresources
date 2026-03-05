"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase/browser";

type ResourceRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  featured: boolean;
  type: string;
  level: string;
  updated_at: string;
};

export default function AdminPage() {
  const [items, setItems] = useState<ResourceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("resources")
      .select("id,title,slug,published,featured,type,level,updated_at")
      .order("updated_at", { ascending: false });

    if (error) {
      setError(error.message);
      setItems([]);
    } else {
      setItems((data ?? []) as ResourceRow[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  return (
    <main>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Ressurser</h1>
        <div className="flex items-center gap-3">
          <button
            className="text-sm underline"
            onClick={load}
            disabled={loading}
          >
            Oppdater
          </button>
          <Link className="text-sm underline" href="/admin/new">
            Ny ressurs
          </Link>
        </div>
      </div>

      {loading && <p className="mt-6">Laster…</p>}
      {error && <p className="mt-6 text-sm text-red-600">Feil: {error}</p>}

      <div className="mt-6 space-y-3">
        {items.map((r) => (
          <div key={r.id} className="rounded-xl border border-neutral-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium truncate">{r.title}</p>
                <p className="mt-1 text-sm text-neutral-600 truncate">
                  /resources/{r.slug}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {r.featured && (
                  <span className="rounded-full border px-2 py-1">
                    featured
                  </span>
                )}
                <span className="rounded-full border px-2 py-1">
                  {r.type} · {r.level}
                </span>
                <span
                  className={`rounded-full px-2 py-1 ${
                    r.published
                      ? "bg-green-100 text-green-700"
                      : "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {r.published ? "published" : "draft"}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-sm">
              <Link className="underline" href={`/resources/${r.slug}`}>
                Vis
              </Link>

              <span className="text-neutral-400">|</span>

              <Link className="underline" href={`/admin/edit/${r.id}`}>
                Rediger
              </Link>

              <span className="text-neutral-400">|</span>

              <span className="text-neutral-500 text-xs">
                Oppdatert: {new Date(r.updated_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!loading && items.length === 0 && (
        <p className="mt-6 text-neutral-600">Ingen ressurser enda.</p>
      )}
    </main>
  );
}

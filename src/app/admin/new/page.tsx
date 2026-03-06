"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/browser";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import RenderMarkdown from "../../components/render-markdown";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function AdminNewResource() {
  const router = useRouter();

  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadAlt, setUploadAlt] = useState("Wiring");
  const [uploadFolder, setUploadFolder] = useState("wiring");

  const [mdTab, setMdTab] = useState<"write" | "preview">("write");

  const [title, setTitle] = useState("");
  const autoSlug = useMemo(() => slugify(title), [title]);
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [contentMd, setContentMd] = useState(
    "## Overskrift\n\nSkriv innhold her…\n",
  );
  const [type, setType] = useState("guide");
  const [level, setLevel] = useState("beginner");
  const [tags, setTags] = useState("arduino, beginner");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function insertIntoMarkdown(snippet: string) {
    const el = contentRef.current;
    if (!el) {
      setContentMd((prev) => prev + "\n" + snippet + "\n");
      return;
    }

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;

    setContentMd((prev) => prev.slice(0, start) + snippet + prev.slice(end));

    requestAnimationFrame(() => {
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const safeExt = ext.replace(/[^a-z0-9]/g, "") || "png";
    const name = (
      globalThis.crypto?.randomUUID?.() ?? String(Date.now())
    ).slice(0, 16);

    // new/ folder (enkelt). Vi kan flytte til slug etter lagring senere hvis du vil.
    const path = `${uploadFolder}/new/${name}.${safeExt}`;

    const { error: upErr } = await supabase.storage
      .from("resources")
      .upload(path, file, { upsert: false });

    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("resources").getPublicUrl(path);
    const url = data.publicUrl;

    insertIntoMarkdown(`\n![${uploadAlt || "image"}](${url})\n`);

    setUploading(false);
  }

  return (
    <main>
      <h1 className="text-2xl font-semibold">Ny ressurs</h1>

      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          setError(null);

          const finalSlug = (slug || autoSlug).trim();
          if (!title.trim()) {
            setError("Mangler tittel.");
            setSaving(false);
            return;
          }
          if (!finalSlug) {
            setError("Mangler slug.");
            setSaving(false);
            return;
          }

          const tagsArr = tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

          const { error } = await supabase.from("resources").insert({
            title: title.trim(),
            slug: finalSlug,
            summary: summary.trim() || null,
            content_md: contentMd,
            type,
            level,
            tags: tagsArr,
            featured,
            published,
            links: [],
          });

          setSaving(false);

          if (error) {
            setError(error.message);
            return;
          }

          router.push(`/resources/${finalSlug}`);
        }}
      >
        <div>
          <label className="text-sm">Tittel</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm">Slug (URL)</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder={autoSlug}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="mt-1 text-xs text-neutral-600">
              Hvis tom, brukes: <code>{autoSlug || "..."}</code>
            </p>
          </div>

          <div className="grid gap-3 grid-cols-2">
            <div>
              <label className="text-sm">Type</label>
              <select
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="guide">guide</option>
                <option value="example">example</option>
                <option value="inspiration">inspiration</option>
                <option value="reference">reference</option>
                <option value="troubleshooting">troubleshooting</option>
              </select>
            </div>

            <div>
              <label className="text-sm">Nivå</label>
              <select
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="beginner">beginner</option>
                <option value="intermediate">intermediate</option>
                <option value="advanced">advanced</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm">Kort beskrivelse</label>
          <textarea
            className="mt-1 w-full rounded-md border px-3 py-2"
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Tags (komma-separert)</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Innhold (Markdown)</label>

          <div className="mt-2 flex flex-wrap items-end gap-3">
            <div>
              <label className="text-xs text-neutral-600">Alt-tekst</label>
              <input
                className="mt-1 w-64 rounded-md border px-3 py-2 text-sm"
                value={uploadAlt}
                onChange={(e) => setUploadAlt(e.target.value)}
                placeholder="Wiring diagram"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-600">Mappe</label>
              <select
                className="mt-1 rounded-md border px-3 py-2 text-sm"
                value={uploadFolder}
                onChange={(e) => setUploadFolder(e.target.value)}
              >
                <option value="wiring">wiring</option>
                <option value="projects">projects</option>
                <option value="components">components</option>
                <option value="misc">misc</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-neutral-600">Last opp bilde</label>
              <input
                className="mt-1 block text-sm"
                type="file"
                accept="image/*"
                disabled={uploading || saving}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  uploadImage(f);
                  e.currentTarget.value = "";
                }}
              />
            </div>

            {uploading && (
              <p className="text-sm text-neutral-600">Laster opp…</p>
            )}
          </div>

          <div className="mt-3 rounded-md border">
            <div className="flex items-center justify-between border-b px-2 py-2">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setMdTab("write")}
                  className={`rounded px-3 py-1 text-sm ${
                    mdTab === "write"
                      ? "bg-neutral-900 text-white"
                      : "hover:bg-neutral-100"
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setMdTab("preview")}
                  className={`rounded px-3 py-1 text-sm ${
                    mdTab === "preview"
                      ? "bg-neutral-900 text-white"
                      : "hover:bg-neutral-100"
                  }`}
                >
                  Preview
                </button>
              </div>

              <p className="text-xs text-neutral-600">Markdown</p>
            </div>

            {mdTab === "write" ? (
              <textarea
                ref={contentRef}
                className="w-full px-3 py-2 font-mono text-sm outline-none"
                rows={18}
                value={contentMd}
                onChange={(e) => setContentMd(e.target.value)}
              />
            ) : (
              <div className="px-3 py-3">
                <RenderMarkdown content={contentMd || "_(tom)_"} />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Published
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Lagrer…" : "Lagre"}
        </button>
      </form>
    </main>
  );
}

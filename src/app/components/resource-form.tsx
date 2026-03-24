"use client";

import RenderMarkdown from "@/src/app/components/render-markdown";
import { supabase } from "@/src/app/lib/supabase/browser";
import { LinkItem, ResourceRow } from "@/src/types";
import { useMemo, useRef, useState } from "react";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type Props = {
  initialValues?: Partial<ResourceRow>;
  resourceId?: string;
  onSubmit: (fields: ResourceRow) => Promise<void>;
  onDelete?: () => Promise<void>;
};

const DEFAULTS: ResourceRow = {
  title: "",
  slug: "",
  summary: "",
  content_md: "## Overskrift\n\nSkriv innhold her…\n",
  type: "guide",
  level: "beginner",
  tags: ["arduino, beginner"],
  featured: false,
  published: false,
  links: [],
};

export default function ResourceForm({
  initialValues,
  resourceId,
  onSubmit,
  onDelete,
}: Props) {
  const merged = { ...DEFAULTS, ...initialValues };

  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const [mdTab, setMdTab] = useState<"write" | "preview">("write");

  const [uploading, setUploading] = useState(false);
  const [uploadAlt, setUploadAlt] = useState("Wiring");
  const [uploadFolder, setUploadFolder] = useState("wiring");

  const [title, setTitle] = useState(merged.title);
  const autoSlug = useMemo(() => slugify(title), [title]);
  const [slug, setSlug] = useState(merged.slug);
  const [summary, setSummary] = useState(merged.summary ?? "");
  const [contentMd, setContentMd] = useState(merged.content_md);
  const [type, setType] = useState(merged.type);
  const [level, setLevel] = useState(merged.level);
  const [tags, setTags] = useState(merged.tags.join(", "));
  const [featured, setFeatured] = useState(merged.featured);
  const [published, setPublished] = useState(merged.published);
  const [linksText, setLinksText] = useState(
    merged.links
      .map((l) => `${l.label ?? ""} | ${l.url ?? ""}`.trim())
      .join("\n"),
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const folder = resourceId ?? "new";
    const path = `${uploadFolder}/${folder}/${name}.${safeExt}`;

    const { error: upErr } = await supabase.storage
      .from("resources")
      .upload(path, file, { upsert: false });

    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("resources").getPublicUrl(path);
    insertIntoMarkdown(`\n![${uploadAlt || "image"}](${data.publicUrl})\n`);
    setUploading(false);
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const finalSlug = (slug.trim() || autoSlug).trim();

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

    const links: LinkItem[] = linksText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [labelPart, urlPart] = line.split("|").map((s) => s.trim());
        if (!urlPart) return null;
        return { label: labelPart || urlPart, url: urlPart };
      })
      .filter(Boolean) as LinkItem[];

    try {
      await onSubmit({
        title: title.trim(),
        slug: finalSlug,
        summary: summary.trim() || null,
        content_md: contentMd,
        type,
        level,
        tags: tagsArr,
        featured,
        published,
        links,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Noe gikk galt.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    const ok = window.confirm("Slette ressursen permanent?");
    if (!ok) return;
    setSaving(true);
    try {
      await onDelete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Noe gikk galt.");
      setSaving(false);
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm">Tittel</label>
        <input
          className="mt-1 w-full border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-sm">Slug (URL)</label>
          <input
            className="mt-1 w-full border px-3 py-2"
            placeholder={autoSlug}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <p className="mt-1 text-xs text-neutral-600">
            Tom = bruker: <code>{autoSlug || "..."}</code>
          </p>
        </div>

        <div className="grid gap-3 grid-cols-2">
          <div>
            <label className="text-sm">Type</label>
            <select
              className="mt-1 w-full border px-3 py-2"
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
              className="mt-1 w-full border px-3 py-2"
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
          className="mt-1 w-full border px-3 py-2"
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm">Tags (komma-separert)</label>
        <input
          className="mt-1 w-full border px-3 py-2"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm">Lenker (en per linje: Label | URL)</label>
        <textarea
          className="mt-1 w-full border px-3 py-2 font-mono text-sm"
          rows={4}
          value={linksText}
          onChange={(e) => setLinksText(e.target.value)}
          placeholder={`Arduino Reference | https://www.arduino.cc/reference/en/\nDatasheet | https://...`}
        />
      </div>

      {/* MARKDOWN */}
      <div>
        <label className="text-sm">Innhold (Markdown)</label>

        <div className="mt-2 flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs text-neutral-600">Alt-tekst</label>
            <input
              className="mt-1 w-64 border px-3 py-2 text-sm"
              value={uploadAlt}
              onChange={(e) => setUploadAlt(e.target.value)}
              placeholder="Wiring diagram"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-600">Mappe</label>
            <select
              className="mt-1 border px-3 py-2 text-sm"
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

          {uploading && <p className="text-sm text-neutral-600">Laster opp…</p>}
        </div>

        <div className="mt-3 border">
          <div className="flex items-center justify-between border-b px-2 py-2">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setMdTab("write")}
                className={`px-3 py-1 text-sm ${
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
                className={`px-3 py-1 text-sm ${
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

      <div className="flex items-center gap-3">
        <button
          className="bg-black px-4 py-2 text-white disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Lagrer…" : "Lagre"}
        </button>

        {onDelete && (
          <button
            type="button"
            className="text-sm underline text-red-600 disabled:opacity-50"
            disabled={saving}
            onClick={handleDelete}
          >
            Slett
          </button>
        )}
      </div>
    </form>
  );
}

"use client";

import { CSSProperties, use, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { supabase } from "../../lib/supabase/browser";
import RenderMarkdown from "../../components/render-markdown";

type Resource = {
  title: string;
  summary: string | null;
  content_md: string;
  links: { label: string; url: string }[];
};

export default function ResourcePage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(props.params); // unwrap params Promise

  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  const syntaxStyle = oneDark as { [key: string]: CSSProperties };

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from("resources")
        .select("title,summary,content_md,links")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) console.error(error);

      setResource(error ? null : data);
      setLoading(false);
    }

    load();
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p>Laster…</p>
      </main>
    );
  }

  if (!resource) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p>Ressurs ikke funnet.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">{resource.title}</h1>

      {resource.summary && (
        <p className="mt-2 text-neutral-600">{resource.summary}</p>
      )}

      <RenderMarkdown content={resource.content_md} />

      {resource.links?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-medium">Lenker</h2>
          <ul className="mt-3 space-y-2">
            {resource.links.map((l, i) => (
              <li key={i}>
                <a
                  className="underline"
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

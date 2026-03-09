import { Resource } from "@/src/types";
import { BookOpen } from "lucide-react";
import Link from "next/link";

type Props = {
  resources: Resource[];
};

export default function ResourceList({ resources }: Props) {
  return (
    <ul
      id="resources"
      className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-3 font-mono text-sm"
    >
      {resources.map((r) => (
        <li
          key={r.id}
          className="mb-3 break-inside-avoid border border-neutral-300 bg-neutral-50 shadow-[2px_2px_0_0_rgba(0,0,0,0.08)] hover:bg-neutral-100 transition-colors"
        >
          <div className="border-b border-neutral-300 bg-neutral-100 px-3 py-2 flex items-center justify-between gap-3">
            <h2 className="truncate text-neutral-900">{r.title}</h2>

            <span className="shrink-0 text-xs text-neutral-500 uppercase tracking-wide">
              {r.type}
            </span>
          </div>

          <div className="px-3 py-3">
            {r.summary && (
              <p className="mb-3 text-xs leading-5 text-neutral-700">
                {r.summary}
              </p>
            )}

            {r.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {r.tags.slice(0, 6).map((t) => (
                  <span
                    key={t}
                    className="border border-neutral-300 px-2 py-0.5 text-[11px] text-neutral-700 bg-white"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 border-t border-dashed border-neutral-300 pt-3 flex items-center justify-between">
              <Link
                href={`/resources/${r.slug}`}
                className="inline-flex items-center gap-2 border border-neutral-400 bg-white px-2 py-1 text-xs hover:bg-neutral-200"
              >
                <BookOpen size={14} />
                Åpne
              </Link>

              <span className="text-[11px] text-neutral-500 uppercase">
                {r.level}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

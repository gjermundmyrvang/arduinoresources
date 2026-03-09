import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  if (!items?.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex ${className}`}>
      <ol className="inline-flex items-center gap-1 md:gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li
              key={`${item.label}-${index}`}
              aria-current={isLast ? "page" : undefined}
            >
              <div className="flex items-center gap-1.5">
                {!isFirst && (
                  <ChevronRight
                    size={14}
                    className="text-body rtl:rotate-180"
                  />
                )}

                {isLast || !item.href ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-body-subtle">
                    {isFirst && <Home size={16} />}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-body hover:text-fg-brand"
                  >
                    {isFirst && <Home size={16} />}
                    {item.label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

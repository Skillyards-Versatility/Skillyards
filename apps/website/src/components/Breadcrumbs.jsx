"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ className = "", currentLabel, items }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = items?.length
    ? items.map((item, index) => ({
        name: item.label,
        href: item.href,
        isLast: index === items.length - 1,
      }))
    : [
        { name: "Home", href: "/", isLast: segments.length === 0 },
        ...segments.map((segment, index) => {
          const isLast = index === segments.length - 1;

          return {
            name:
              isLast && currentLabel
                ? currentLabel
                : segment
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase()),
            href: "/" + segments.slice(0, index + 1).join("/"),
            isLast,
          };
        }),
      ];

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-sm text-accent-foreground ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1">
        {breadcrumbs.map((item, index) => {
          return (
            <li
              key={item.href || `breadcrumb-${index}`}
              className="flex items-center gap-1 text-accent-foreground"
            >
              {index > 0 && <ChevronRight className="h-4 w-4 text-primary" />}

              {index === 0 && item.href === "/" && <Home className="h-4 w-4" />}

              {item.isLast || !item.href ? (
                <span className="font-medium text-accent-foreground">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-accent-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

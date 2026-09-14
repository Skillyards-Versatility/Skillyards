"use client";

import { useEffect, useRef, useState } from "react";

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!headings?.length) return;

    const ids = headings.map((h) => h.id);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-10% 0px -70% 0px",
        threshold: 0,
      },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (!headings?.length) return null;

  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-0 top-1 bottom-1 w-px bg-border/50" />

      <ul className="space-y-1 text-sm relative z-10">
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;
          const isSubheading = heading.level === "h3" || heading.level === "h4";

          return (
            <li key={`${heading.id}-${index}`} id={`toc-${heading.id}`}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(heading.id);
                  if (el) {
                    const top =
                      el.getBoundingClientRect().top + window.scrollY - 96;
                    window.scrollTo({ top, behavior: "smooth" });
                    setActiveId(heading.id);
                  }
                }}
                className={`
                                    group flex items-center gap-3 py-1.5 pr-2 transition-all duration-300 rounded-r-lg border-l-2 -ml-[1px]
                                    ${isSubheading ? "pl-8" : "pl-4"}
                                    ${
                                      isActive
                                        ? "text-primary border-primary font-bold bg-primary/5"
                                        : "text-muted-foreground border-transparent hover:text-foreground hover:border-border/50"
                                    }
                                `}
              >
                <span
                  className={`
                                    leading-snug transition-transform duration-300
                                    ${isActive ? "translate-x-1" : "group-hover:translate-x-1"}
                                `}
                >
                  {heading.text}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Course description with expand/collapse on mobile.
 *
 * On screens below `md` the text is clamped to 4 lines. A toggle button
 * appears only when the clamped text actually overflows (measured via
 * ResizeObserver, which fires after layout and on window resize).
 * On `md+` the full description is always visible.
 */
export function CourseDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 22.75;
      const maxClamped = lineHeight * 4;
      setOverflow(el.clientHeight >= maxClamped - 1);
    };

    const observer = new ResizeObserver(check);
    observer.observe(el);
    check();

    return () => observer.disconnect();
  }, [text]);

  if (!text) return null;

  return (
    <div className="border-t pt-5">
      <div className="md:hidden">
        <p
          ref={ref}
          className={cn(
            "text-sm leading-relaxed text-muted-foreground",
            !expanded && "line-clamp-4",
          )}
        >
          {text}
        </p>
        {(overflow || expanded) && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {expanded ? "收起" : "展开"}
            <ChevronDownIcon
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                expanded && "rotate-180",
              )}
            />
          </button>
        )}
      </div>
      <p className="hidden md:block text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  );
}

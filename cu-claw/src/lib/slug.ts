import { pinyin } from "pinyin-pro";

const RESERVED_FIRST_SEGMENTS = new Set(["edit", "history", "new", "search"]);

export function generateSlug(title: string): string {
  const parts: string[] = [];
  const segments = title.match(/[一-鿿]+|[a-zA-Z0-9]+/g) ?? [];

  for (const seg of segments) {
    if (/[一-鿿]/.test(seg)) {
      const py = pinyin(seg, { toneType: "none", type: "array" });
      parts.push(...py);
    } else {
      parts.push(seg.toLowerCase());
    }
  }

  return parts
    .join("-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function validateSlug(slug: string): boolean {
  if (!slug) return false;
  if (!/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/.test(slug)) return false;
  const [firstSegment] = slug.split("/");
  return !RESERVED_FIRST_SEGMENTS.has(firstSegment);
}

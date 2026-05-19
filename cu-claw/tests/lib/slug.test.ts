import { describe, it, expect } from "vitest";
import { generateSlug, validateSlug } from "@/lib/slug";

describe("generateSlug", () => {
  it("converts Chinese title to pinyin slug", () => {
    const slug = generateSlug("八达通");
    expect(slug).toBe("ba-da-tong");
  });

  it("preserves English words", () => {
    const slug = generateSlug("WiFi Setup");
    expect(slug).toBe("wifi-setup");
  });

  it("handles mixed content", () => {
    const slug = generateSlug("校园WiFi指南");
    expect(slug).toBe("xiao-yuan-wifi-zhi-nan");
  });
});

describe("validateSlug", () => {
  it("accepts valid slug", () => {
    expect(validateSlug("hello-world")).toBe(true);
  });

  it("accepts nested slug", () => {
    expect(validateSlug("college/shatin")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(validateSlug("")).toBe(false);
  });

  it("rejects slugs with spaces", () => {
    expect(validateSlug("hello world")).toBe(false);
  });

  it("rejects reserved app route prefixes", () => {
    expect(validateSlug("edit/octopus")).toBe(false);
    expect(validateSlug("history/octopus")).toBe(false);
    expect(validateSlug("new")).toBe(false);
    expect(validateSlug("search/results")).toBe(false);
  });
});

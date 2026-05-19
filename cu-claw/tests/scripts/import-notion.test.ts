import { describe, it, expect } from "vitest";
import { parseNotionFilename } from "../../scripts/import-notion";
import { generateSlug } from "@/lib/slug";

describe("parseNotionFilename", () => {
  it("extracts title and UUID", () => {
    const result = parseNotionFilename("八达通 09e7498223e7494dac05c8eaa7d25f89.md");
    expect(result.title).toBe("八达通");
    expect(result.uuid).toBe("09e7498223e7494dac05c8eaa7d25f89");
  });

  it("handles English titles", () => {
    const result = parseNotionFilename("Research 7d37f4cf11e34fb5bf2cabb5ebbad966.md");
    expect(result.title).toBe("Research");
    expect(result.uuid).toBe("7d37f4cf11e34fb5bf2cabb5ebbad966");
  });

  it("handles titles with spaces", () => {
    const result = parseNotionFilename("For 国际生 6e1ec4af86e3440b980ed3b21dc47162.md");
    expect(result.title).toBe("For 国际生");
  });
});

describe("generateSlug (used by import)", () => {
  it("converts Chinese to pinyin slug", () => {
    expect(generateSlug("八达通")).toBe("ba-da-tong");
  });

  it("handles mixed content", () => {
    expect(generateSlug("CU 全港觅食指南")).toMatch(/^cu-/);
  });
});

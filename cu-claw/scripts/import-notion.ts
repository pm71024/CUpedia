import fs from "fs";
import path from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { wikiPages, wikiRevisions } from "../src/db/schema";
import { generateSlug, validateSlug } from "../src/lib/slug";

export function parseNotionFilename(filename: string): { title: string; uuid: string } {
  const match = filename.match(/^(.+)\s+([a-f0-9]{32})\.md$/);
  if (!match) return { title: filename.replace(/\.md$/, ""), uuid: "" };
  return { title: match[1], uuid: match[2] };
}

interface ImportEntry {
  title: string;
  slug: string;
  content: string;
  children: ImportEntry[];
}

function makeImportSlug(title: string, parentSlug: string | undefined, usedSlugs: Set<string>): string {
  const basePart = generateSlug(title) || "untitled";
  const base = parentSlug ? `${parentSlug}/${basePart}` : basePart;
  let candidate = base;
  let i = 2;

  while (!validateSlug(candidate) || usedSlugs.has(candidate)) {
    candidate = `${base}-${i}`;
    i += 1;
  }

  usedSlugs.add(candidate);
  return candidate;
}

function scanDir(dir: string, parentSlug?: string, usedSlugs = new Set<string>()): ImportEntry[] {
  const entries: ImportEntry[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isFile() && item.endsWith(".md")) {
      const { title } = parseNotionFilename(item);
      const slug = makeImportSlug(title, parentSlug, usedSlugs);
      const content = fs.readFileSync(fullPath, "utf-8");
      const children: ImportEntry[] = [];

      const dirName = item.replace(/\.md$/, "");
      const subDir = path.join(dir, dirName);
      if (fs.existsSync(subDir) && fs.statSync(subDir).isDirectory()) {
        children.push(...scanDir(subDir, slug, usedSlugs));
      }

      entries.push({ title, slug, content, children });
    }
  }

  return entries;
}

async function insertEntries(
  db: ReturnType<typeof drizzle>,
  adminUserId: string,
  entries: ImportEntry[],
  parentId: string | null
) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const [page] = await db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(wikiPages)
        .values({
          slug: entry.slug,
          title: entry.title,
          content: entry.content,
          parentId,
          sortOrder: i,
          createdBy: adminUserId,
          updatedBy: adminUserId,
        })
        .returning();

      await tx.insert(wikiRevisions).values({
        pageId: inserted.id,
        title: entry.title,
        content: entry.content,
        editedBy: adminUserId,
        editSummary: "导入 Notion 页面",
      });

      return [inserted];
    });

    console.log(`Imported: ${entry.slug}`);

    if (entry.children.length > 0) {
      await insertEntries(db, adminUserId, entry.children, page.id);
    }
  }
}

async function main() {
  const notionDir = process.argv[2];
  if (!notionDir) {
    console.error("Usage: npx tsx scripts/import-notion.ts <notion-export-dir>");
    process.exit(1);
  }

  const adminUserId = process.env.ADMIN_USER_ID;
  if (!adminUserId) {
    console.error("ADMIN_USER_ID is required");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  const existingPages = await db.select({ slug: wikiPages.slug }).from(wikiPages);
  const usedSlugs = new Set(existingPages.map((page) => page.slug));

  console.log(`Scanning ${notionDir}...`);
  const entries = scanDir(notionDir, undefined, usedSlugs);
  console.log(`Found ${entries.length} top-level pages`);

  await insertEntries(db, adminUserId, entries, null);
  console.log("Import complete.");
  await pool.end();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

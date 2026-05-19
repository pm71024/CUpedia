import Link from "next/link";
import { searchWikiPages } from "@/lib/wiki-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const results = q ? await searchWikiPages(q) : [];

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">搜索 Wiki</h1>
      <form className="flex gap-2">
        <Input
          name="q"
          defaultValue={q ?? ""}
          placeholder="搜索页面..."
          className="flex-1"
        />
        <Button type="submit">搜索</Button>
      </form>
      {q && (
        <p className="text-sm text-muted-foreground">
          找到 {results.length} 个结果
        </p>
      )}
      <div className="space-y-2">
        {results.map((r) => (
          <Link key={r.id} href={`/wiki/${r.slug}`} className="block rounded border p-3 hover:bg-gray-50">
            <p className="font-medium">{r.title}</p>
            <p className="text-xs text-muted-foreground">/{r.slug}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

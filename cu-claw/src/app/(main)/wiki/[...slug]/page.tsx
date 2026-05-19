import { notFound } from "next/navigation";
import Link from "next/link";
import { getWikiPage, getWikiTree } from "@/lib/wiki-actions";
import { WikiSidebar } from "@/components/layout/wiki-sidebar";
import { WikiRenderer } from "@/components/wiki/wiki-renderer";
import { Button } from "@/components/ui/button";
import { getOptionalUser } from "@/lib/auth-guard";

export default async function WikiReadPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");
  const [page, pages, user] = await Promise.all([
    getWikiPage(slug),
    getWikiTree(),
    getOptionalUser(),
  ]);

  if (!page) notFound();

  return (
    <div className="flex gap-6">
      <WikiSidebar pages={pages} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{page.title}</h1>
          <div className="flex gap-2">
            <Link href={`/wiki/history/${slug}`}>
              <Button variant="outline" size="sm">历史</Button>
            </Link>
            {user && (
              <Link href={`/wiki/edit/${slug}`}>
                <Button size="sm">编辑</Button>
              </Link>
            )}
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          最后编辑：{(page as any).updatedByUser?.nickname ?? "未知用户"} · {page.updatedAt.toLocaleDateString("zh-CN")}
        </div>
        <div className="mt-6">
          <WikiRenderer content={page.content} />
        </div>
      </div>
    </div>
  );
}

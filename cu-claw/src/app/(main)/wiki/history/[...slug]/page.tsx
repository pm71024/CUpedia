import { notFound } from "next/navigation";
import Link from "next/link";
import { getWikiPage, getRevisions, getRevision, rollbackToRevision } from "@/lib/wiki-actions";
import { RevisionList } from "@/components/wiki/revision-list";
import { RevisionDiff } from "@/components/wiki/revision-diff";
import { WikiRenderer } from "@/components/wiki/wiki-renderer";
import { Button } from "@/components/ui/button";
import { getOptionalUser } from "@/lib/auth-guard";
import { redirect } from "next/navigation";

export default async function HistoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ view?: string; diff?: string; with?: string }>;
}) {
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");
  const sp = await searchParams;
  const page = await getWikiPage(slug);
  if (!page) notFound();

  const revisions = await getRevisions(page.id);
  const user = await getOptionalUser();

  if (sp.view) {
    const rev = await getRevision(page.id, sp.view);
    if (!rev) notFound();

    async function handleRollback() {
      "use server";
      await rollbackToRevision(page!.id, sp.view!);
      redirect(`/wiki/${slug}`);
    }

    return (
      <div className="max-w-4xl space-y-4">
        <Link href={`/wiki/history/${slug}`} className="text-sm text-blue-600 hover:underline">
          &larr; 返回历史
        </Link>
        <h1 className="text-xl font-bold">历史版本：{rev.title}</h1>
        <p className="text-xs text-muted-foreground">
          {rev.createdAt.toLocaleString("zh-CN")}
        </p>
        {user && (
          <form action={handleRollback}>
            <Button variant="outline" size="sm" type="submit">
              回滚到此版本
            </Button>
          </form>
        )}
        <WikiRenderer content={rev.content} />
      </div>
    );
  }

  if (sp.diff && sp.with) {
    const [older, newer] = await Promise.all([
      getRevision(page.id, sp.diff),
      getRevision(page.id, sp.with),
    ]);
    if (!older || !newer) notFound();

    return (
      <div className="max-w-4xl space-y-4">
        <Link href={`/wiki/history/${slug}`} className="text-sm text-blue-600 hover:underline">
          &larr; 返回历史
        </Link>
        <h1 className="text-xl font-bold">版本对比</h1>
        <RevisionDiff
          oldText={older.content}
          newText={newer.content}
          oldLabel={older.createdAt.toLocaleString("zh-CN")}
          newLabel={newer.createdAt.toLocaleString("zh-CN")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">编辑历史：{page.title}</h1>
        <Link href={`/wiki/${slug}`}>
          <Button variant="outline" size="sm">返回页面</Button>
        </Link>
      </div>
      <RevisionList revisions={revisions} slug={slug} />
    </div>
  );
}

import Link from "next/link";
import { getWikiTree } from "@/lib/wiki-actions";
import { WikiSidebar } from "@/components/layout/wiki-sidebar";
import { Button } from "@/components/ui/button";
import { getOptionalUser } from "@/lib/auth-guard";

export default async function WikiIndexPage() {
  const pages = await getWikiTree();
  const user = await getOptionalUser();

  return (
    <div className="flex gap-6">
      <WikiSidebar pages={pages} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Wiki</h1>
          {user && (
            <Link href="/wiki/new">
              <Button size="sm">新建页面</Button>
            </Link>
          )}
        </div>
        <p className="mt-4 text-muted-foreground">
          从左侧导航选择一个页面开始阅读。
        </p>
      </div>
    </div>
  );
}

import { requireAuth } from "@/lib/auth-guard";
import { createWikiPage } from "@/lib/wiki-actions";
import { WikiEditor } from "@/components/wiki/wiki-editor";

export default async function NewWikiPage() {
  await requireAuth();

  async function handleCreate(data: {
    slug: string;
    title: string;
    content: string;
    parentId?: string | null;
  }) {
    "use server";
    try {
      const page = await createWikiPage(data);
      return { slug: page.slug };
    } catch (e: any) {
      return { error: e.message };
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">新建页面</h1>
      <WikiEditor mode="create" onSubmit={handleCreate} />
    </div>
  );
}

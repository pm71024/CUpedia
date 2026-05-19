import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth-guard";
import { getWikiPage, updateWikiPage } from "@/lib/wiki-actions";
import { WikiEditor } from "@/components/wiki/wiki-editor";

export default async function EditWikiPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  await requireAuth();
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");
  const page = await getWikiPage(slug);
  if (!page) notFound();

  async function handleUpdate(data: {
    slug: string;
    title: string;
    content: string;
    editSummary?: string;
    expectedUpdatedAt?: string;
  }) {
    "use server";
    try {
      const updated = await updateWikiPage({
        slug: data.slug,
        title: data.title,
        content: data.content,
        editSummary: data.editSummary,
        expectedUpdatedAt: data.expectedUpdatedAt!,
      });
      return { slug: updated.slug };
    } catch (e: any) {
      return { error: e.message };
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">编辑：{page.title}</h1>
      <WikiEditor
        mode="edit"
        initialTitle={page.title}
        initialContent={page.content}
        initialSlug={page.slug}
        expectedUpdatedAt={page.updatedAt.toISOString()}
        onSubmit={handleUpdate}
      />
    </div>
  );
}

import { requireAdmin } from "@/lib/auth-guard";
import { Navbar } from "@/components/layout/navbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <p className="mb-4 text-sm text-muted-foreground">管理后台</p>
        {children}
      </main>
    </>
  );
}

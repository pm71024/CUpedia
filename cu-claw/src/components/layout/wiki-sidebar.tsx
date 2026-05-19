"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type TreeNode = {
  id: string;
  slug: string;
  title: string;
  parentId: string | null;
  children: TreeNode[];
};

function buildTree(
  pages: { id: string; slug: string; title: string; parentId: string | null }[]
): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const p of pages) {
    map.set(p.id, { ...p, children: [] });
  }
  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

function TreeItem({ node, depth }: { node: TreeNode; depth: number }) {
  const pathname = usePathname();
  const href = `/wiki/${node.slug}`;
  const active = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "block rounded px-2 py-1 text-sm hover:bg-gray-100",
          active && "bg-gray-100 font-medium"
        )}
        style={{ paddingLeft: `${(depth + 1) * 12}px` }}
      >
        {node.title}
      </Link>
      {node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <TreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function WikiSidebar({
  pages,
}: {
  pages: { id: string; slug: string; title: string; parentId: string | null }[];
}) {
  const tree = buildTree(pages);

  return (
    <nav className="w-64 shrink-0 overflow-y-auto border-r pr-4">
      <ul className="space-y-0.5">
        {tree.map((node) => (
          <TreeItem key={node.id} node={node} depth={0} />
        ))}
      </ul>
    </nav>
  );
}

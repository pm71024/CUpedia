"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold">
          CUHK Wiki
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/wiki" className="text-sm hover:underline">
            Wiki
          </Link>
          <Link href="/wiki/search" className="text-sm hover:underline">
            搜索
          </Link>
          {session?.user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">{session.user.nickname || session.user.email}</span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                登出
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">登录</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

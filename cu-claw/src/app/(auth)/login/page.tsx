"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAllowedEmail } from "@/lib/email";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isAllowedEmail(email)) {
      setError("仅支持 CUHK 邮箱注册");
      return;
    }

    const result = await signIn("email", { email, redirect: false });
    if (result?.error) {
      setError("发送失败，请稍后重试");
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>查看你的邮箱</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            登录链接已发送至 <strong>{email}</strong>，点击链接即可登录。
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>登录 CUHK Wiki</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">CUHK 邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="sid@link.cuhk.edu.hk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            发送登录链接
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

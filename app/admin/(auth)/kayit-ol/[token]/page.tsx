"use client";

import { useState, use } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { registerWithInvite } from "@/actions/auth";
import Image from "next/image";

export default function RegisterPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    formData.set("token", token);
    const result = await registerWithInvite(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <form action={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/logo.svg"
                  width={80}
                  height={80}
                  alt="logo"
                  className="w-20"
                />
                <CardTitle className="text-2xl font-bold">Kayıt Ol</CardTitle>
                <CardDescription>
                  Can Gayrimenkul yönetim paneline davet edildiniz
                </CardDescription>
              </div>

              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md text-center">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="fullName">Ad Soyad</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@example.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="*******"
                  minLength={6}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Şifre (Tekrar)</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="*******"
                  minLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Kayıt Ol
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

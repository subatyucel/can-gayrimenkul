"use client";

import { useState } from "react";
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
import { requestPasswordReset } from "@/actions/auth";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    error?: string;
    success?: string;
  }>({});

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage({});
    const result = await requestPasswordReset(formData);
    setMessage(result);
    setLoading(false);
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <form action={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <CardTitle className="text-2xl font-bold">
                  Şifremi Unuttum
                </CardTitle>
                <CardDescription>
                  E-posta adresinize şifre sıfırlama linki göndereceğiz
                </CardDescription>
              </div>

              {message.error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md text-center">
                  {message.error}
                </div>
              )}
              {message.success && (
                <div className="bg-green-500/15 text-green-700 text-sm p-3 rounded-md text-center">
                  {message.success}
                </div>
              )}

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

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Sıfırlama Linki Gönder
              </Button>

              <Link
                href="/admin/giris-yap"
                className="text-sm text-center text-muted-foreground underline-offset-4 hover:underline"
              >
                Giriş sayfasına dön
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

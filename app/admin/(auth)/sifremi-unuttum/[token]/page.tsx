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
import { resetPasswordWithToken } from "@/actions/auth";

export default function ResetPasswordPage({
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
    const result = await resetPasswordWithToken(formData);
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
                <CardTitle className="text-2xl font-bold">
                  Şifre Sıfırla
                </CardTitle>
                <CardDescription>Yeni şifrenizi belirleyin</CardDescription>
              </div>

              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md text-center">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="newPassword">Yeni Şifre</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="*******"
                  minLength={6}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
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
                Şifreyi Sıfırla
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

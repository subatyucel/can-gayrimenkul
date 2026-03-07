"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Mail,
  UserPlus,
  Copy,
  Check,
  MessageCircle,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import {
  changePassword,
  changeEmail,
  createInvitation,
} from "@/actions/settings";

interface SettingsPageProps {
  currentEmail: string;
}

export function SettingsPage({ currentEmail }: SettingsPageProps) {
  const [passwordMsg, setPasswordMsg] = useState<{
    error?: string;
    success?: string;
  }>({});
  const [emailMsg, setEmailMsg] = useState<{
    error?: string;
    success?: string;
  }>({});
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  async function handlePasswordSubmit(formData: FormData) {
    setPasswordLoading(true);
    const result = await changePassword(formData);
    setPasswordMsg(result);
    setPasswordLoading(false);
  }

  async function handleEmailSubmit(formData: FormData) {
    setEmailLoading(true);
    const result = await changeEmail(formData);
    setEmailMsg(result);
    setEmailLoading(false);
  }

  async function handleCreateInvite() {
    setInviteLoading(true);
    setCopied(false);
    const result = await createInvitation();
    if (result.link) {
      setInviteLink(result.link);
    }
    setInviteLoading(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(
      `Can Gayrimenkul yönetim paneline davet edildiniz! Kayıt olmak için: ${inviteLink}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Ayarlar</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Şifre Değiştir
          </CardTitle>
          <CardDescription>Hesap şifrenizi güncelleyin</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mevcut Şifre</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Yeni Şifre</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                minLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                minLength={6}
                required
              />
            </div>

            {passwordMsg.error && (
              <p className="text-sm text-destructive">{passwordMsg.error}</p>
            )}
            {passwordMsg.success && (
              <p className="text-sm text-green-600">{passwordMsg.success}</p>
            )}

            <Button
              type="submit"
              disabled={passwordLoading}
              className="cursor-pointer"
            >
              {passwordLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Şifreyi Güncelle
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            E-posta Değiştir
          </CardTitle>
          <CardDescription>
            Mevcut e-posta:{" "}
            <span className="font-medium text-foreground">{currentEmail}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newEmail">Yeni E-posta</Label>
              <Input id="newEmail" name="newEmail" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailPassword">Şifreniz (Doğrulama)</Label>
              <Input
                id="emailPassword"
                name="password"
                type="password"
                required
              />
            </div>

            {emailMsg.error && (
              <p className="text-sm text-destructive">{emailMsg.error}</p>
            )}
            {emailMsg.success && (
              <p className="text-sm text-green-600">{emailMsg.success}</p>
            )}

            <Button
              type="submit"
              disabled={emailLoading}
              className="cursor-pointer"
            >
              {emailLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              E-postayı Güncelle
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Kullanıcı Davet Et
          </CardTitle>
          <CardDescription>
            Yeni bir kullanıcı davet etmek için link oluşturun (24 saat geçerli)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleCreateInvite}
            disabled={inviteLoading}
            variant="outline"
            className="cursor-pointer"
          >
            {inviteLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LinkIcon className="h-4 w-4" />
            )}
            Davet Linki Oluştur
          </Button>

          {inviteLink && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-3">
                <code className="flex-1 text-sm break-all">{inviteLink}</code>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="cursor-pointer"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Kopyalandı!" : "Kopyala"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWhatsApp}
                  className="cursor-pointer text-green-600 hover:text-green-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp ile Paylaş
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

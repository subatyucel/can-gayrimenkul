'use client';

import { generateInviteLink } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Check,
  Copy,
  LinkIcon,
  Loader2,
  MessageCircle,
  UserPlus,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function InviteUser() {
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleCreateLink() {
    setLoading(true);
    const toastId = toast.loading('Link oluşturuluyor...');
    setCopied(false);

    const response = await generateInviteLink();
    if (!response.success) {
      toast.error(response.error, { id: toastId });
      return;
    }

    toast.success(response.message, { id: toastId });
    setInviteLink(response.data!);
    setLoading(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function handleShareWithWhatsapp() {
    const text = encodeURIComponent(
      `Can Gayrimenkul yönetim paneline davet edildiniz! Kayıt olmak için: ${inviteLink}`,
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
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
      <CardContent className="space-y-2">
        <Button variant="outline" onClick={handleCreateLink} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <LinkIcon />}
          {inviteLink && 'Yeni'} Davet Linki Oluştur
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
                disabled={loading}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? 'Kopyalandı!' : 'Kopyala'}
              </Button>

              <Button
                variant="outline"
                className="cursor-pointer text-green-600 hover:text-green-700"
                onClick={handleShareWithWhatsapp}
                disabled={loading}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp ile Paylaş
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function InvalidTokenCard() {
  return (
    <Card className="overflow-hidden w-full max-w-sm border-destructive/50">
      <CardHeader className="text-center justify-items-center gap-2">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <CardTitle className="text-xl">Geçersiz Bağlantı</CardTitle>
        <CardDescription>
          Geçerli bir davet bağlantınız bulunmuyor. Lütfen yöneticiyle iletişime
          geçin.
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-center">
        <Button>
          <Link href={'/'}>Anasayfa</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

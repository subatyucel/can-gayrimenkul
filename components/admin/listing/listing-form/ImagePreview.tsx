'use client';

import { useEffect, useRef } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ImagePreviewProps =
  | {
      type: 'new';
      file: File;
      onRemove: () => void;
    }
  | {
      type: 'existing';
      url: string;
      onRemove: () => void;
    };

export function ImagePreview(props: ImagePreviewProps) {
  const { type, onRemove } = props;
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (type !== 'new') return;
    const objectUrl = URL.createObjectURL(props.file);

    if (imgRef.current) {
      imgRef.current.src = objectUrl;
    }
    return () => URL.revokeObjectURL(objectUrl);
  }, [type, type === 'new' ? props.file : null]);

  return (
    <div className="relative group aspect-square rounded-md overflow-hidden border bg-muted shadow-sm hover:border-primary/50 transition-colors">
      <img
        ref={imgRef}
        src={type === 'existing' ? props.url : undefined}
        alt="Fotoğraf Önizleme"
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
      />

      <Badge
        variant={type == 'new' ? 'info' : 'secondary'}
        className="absolute bottom-1 left-1"
      >
        {type === 'new' ? 'Yeni' : 'Mevcut'}
      </Badge>

      <Button
        type="button"
        size="icon"
        onClick={onRemove}
        variant="destructive"
        className="absolute top-1 right-1"
        title={type === 'new' ? 'Seçimi Kaldır' : 'Mevcut Resmi Sil'}
      >
        {type === 'existing' ? (
          <Trash2 className="w-4 h-4" />
        ) : (
          <X className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}

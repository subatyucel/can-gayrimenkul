'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export function ImagePreview({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);

    if (imgRef.current) {
      imgRef.current.src = objectUrl;
    }

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="relative group aspect-square rounded-md overflow-hidden border bg-muted">
      <img ref={imgRef} alt="Önizleme" className="object-cover w-full h-full" />

      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" color="white" />
      </button>
    </div>
  );
}

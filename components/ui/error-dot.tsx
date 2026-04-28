import { cn } from '@/lib/utils';

export default function ErrorDot({ className }: { className?: string }) {
  return (
    <span className={cn('absolute flex h-2 w-2', className)}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
    </span>
  );
}

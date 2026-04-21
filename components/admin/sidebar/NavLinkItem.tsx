import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type navLinkItemProps = {
  href: string;
  name: string;
  isActive: boolean;
  Icon: React.ElementType;
};

export default function NavLinkItem({
  href,
  name,
  isActive,
  Icon,
}: navLinkItemProps) {
  return (
    <Link href={href}>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start gap-3 px-3 cursor-pointer',
          isActive
            ? 'bg-accent text-accent-foreground font-medium'
            : 'text-muted-foreground',
        )}
      >
        <Icon className="h-5 w-5" />
        {name}
      </Button>
    </Link>
  );
}

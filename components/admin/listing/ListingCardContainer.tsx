import { ListingCardData } from '@/types';
import { ListingCard } from './ListingCard';

export default function ListingCardContainer({
  data,
}: {
  data: ListingCardData[];
}) {
  return (
    <>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {data.map((data) => (
            <ListingCard key={data.id} listing={data} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-10 text-center text-muted-foreground">
          Henüz ilan eklenmemiş.
        </div>
      )}
    </>
  );
}

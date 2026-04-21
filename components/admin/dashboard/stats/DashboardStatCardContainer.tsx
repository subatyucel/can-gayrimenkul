import { getListingStats } from '@/actions/dashboard';
import StatCard from './StatCard';
import {
  BadgeDollarSign,
  BadgeTurkishLira,
  Check,
  CheckCheck,
} from 'lucide-react';

export default async function DashboardStatCardContainer() {
  const response = await getListingStats();

  if (!response.success) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {response.error}
      </div>
    );
  }

  const { data } = response;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Toplam İlan"
        Icon={Check}
        statistic={data!.totalListingsCount}
        additionalInfo={`Bu ay eklenen: ${data!.addedThisMonthCount}`}
      />
      <StatCard
        title="Aktif İlan"
        Icon={CheckCheck}
        statistic={data!.activeListingsCount}
      />
      <StatCard
        title="Satılık"
        Icon={BadgeDollarSign}
        statistic={data!.forSaleTotalCount}
        additionalInfo={`Aktif: ${data!.forSaleActiveCount}`}
      />
      <StatCard
        title="Kiralık"
        Icon={BadgeTurkishLira}
        statistic={data!.forRentTotalCount}
        additionalInfo={`Aktif: ${data!.forRentActiveCount}`}
      />
    </div>
  );
}

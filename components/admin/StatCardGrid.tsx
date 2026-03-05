import { BadgeCent, BadgeDollarSign, Check, CheckCheck } from "lucide-react";
import StatCard from "./StatCard";

type Stats = {
  forSaleTotal: number;
  forSaleActive: number;
  forRentTotal: number;
  forRentActive: number;
  listedThisMonth: number;
};

export default async function StatCardGrid({ stats }: { stats: Stats }) {
  const {
    forSaleTotal,
    forSaleActive,
    forRentTotal,
    forRentActive,
    listedThisMonth,
  } = stats;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Toplam İlan"
        Icon={Check}
        statistic={forSaleTotal + forRentTotal}
        additionalInfo={`Bu ay eklenen: ${listedThisMonth}`}
      />
      <StatCard
        title="Aktif İlan"
        Icon={CheckCheck}
        statistic={forRentActive + forSaleActive}
      />
      <StatCard
        title="Satılık"
        Icon={BadgeDollarSign}
        statistic={forSaleActive}
        additionalInfo={`Toplam: ${forSaleTotal}`}
      />
      <StatCard
        title="Kiralık"
        Icon={BadgeCent}
        statistic={forRentActive}
        additionalInfo={`Toplam: ${forRentTotal}`}
      />
    </div>
  );
}

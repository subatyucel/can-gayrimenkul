import { getDashboardStats } from "@/actions/stats";
import { DistrictChart } from "@/components/admin/DistrictChart";
import { RecentListingsTable } from "@/components/admin/RecentListingsTable";
import StatCardGrid from "@/components/admin/StatCardGrid";
import { TypeChart } from "@/components/admin/TypeChart";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const typeChartData = [
    {
      type: "sale",
      label: "Satılık",
      value: stats.forSaleActive,
      fill: "var(--color-chart-1)",
    },
    {
      type: "rent",
      label: "Kiralık",
      value: stats.forRentActive,
      fill: "var(--color-chart-2)",
    },
  ];
  const districtChartData = stats.districtStats.map((item, i) => ({
    district: item.name,
    count: item.count,
    fill: `var(--color-chart-${(i % 5) + 1})`,
  }));

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-center mb-4">
        Dashboard
      </h1>
      <StatCardGrid stats={stats} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 my-6">
        <div className="col-span-4 md:col-span-3">
          <TypeChart data={typeChartData} />
        </div>

        <div className="col-span-4">
          <DistrictChart data={districtChartData} />
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <div className="overflow-x-auto">
          <RecentListingsTable data={stats.recentListings} />
        </div>
      </div>
    </>
  );
}

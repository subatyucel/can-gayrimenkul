import DashboardChartContainer from '@/components/admin/dashboard/charts/DashboardChartContainer';
import DashboardStatCardContainer from '@/components/admin/dashboard/stats/DashboardStatCardContainer';

export default async function AdminDashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-center mb-4">
        Dashboard
      </h1>
      <DashboardStatCardContainer />
      <DashboardChartContainer />
    </>
  );
}
